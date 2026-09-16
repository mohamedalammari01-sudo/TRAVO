import type { Config, Context } from "@netlify/functions";
import { getDeployStore, getStore } from "@netlify/blobs";
import { createHash, randomBytes, randomInt } from "node:crypto";

type ProfileInput = { name?: string; email?: string; phone?: string; location?: string };
type Body = { action?: "request_otp" | "verify_otp" | "logout"; profile?: ProfileInput; phone?: string; otp?: string; token?: string };

function store(name: string) {
  const isProd = (Netlify as any).context?.deploy?.context === "production";
  return isProd ? getStore(name, { consistency: "strong" }) : getDeployStore(name);
}
function hash(value: string) { return createHash("sha256").update(value).digest("hex"); }
function normalizePhone(value = "") {
  let d = value.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (/^05\d{8}$/.test(d)) d = `966${d.slice(1)}`;
  if (d.startsWith("0") && d.length >= 9) d = d.slice(1);
  if (!/^\d{9,15}$/.test(d)) throw new Error("INVALID_PHONE");
  return d;
}
function validEmail(value = "") { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()); }
function authSecret() {
  const s = Netlify.env.get("TRAVO_AUTH_SECRET");
  if (!s) throw new Error("AUTH_NOT_CONFIGURED");
  return s;
}
function otpDigest(phone: string, otp: string) { return hash(`${authSecret()}:${phone}:${otp}`); }
async function sendWhatsAppOtp(phone: string, otp: string) {
  const token = Netlify.env.get("WHATSAPP_ACCESS_TOKEN");
  const phoneNumberId = Netlify.env.get("WHATSAPP_PHONE_NUMBER_ID");
  const templateName = Netlify.env.get("WHATSAPP_OTP_TEMPLATE");
  const graphVersion = Netlify.env.get("WHATSAPP_GRAPH_VERSION");
  const languageCode = Netlify.env.get("WHATSAPP_OTP_LANGUAGE") || "ar";
  if (!token || !phoneNumberId || !templateName || !graphVersion) return { configured: false, sent: false };
  const response = await fetch(`https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: phone,
      type: "template",
      template: {
        name: templateName,
        language: { code: languageCode },
        components: [{ type: "body", parameters: [{ type: "text", text: otp }] }]
      }
    })
  });
  if (!response.ok) {
    const detail = await response.text();
    console.error("TRAVO WhatsApp OTP error", response.status, detail.slice(0, 500));
    return { configured: true, sent: false };
  }
  return { configured: true, sent: true };
}
async function sessionUser(token?: string) {
  if (!token) return null;
  const sessions = store("travo-sessions");
  const session = await sessions.get(`session/${hash(token)}`, { type: "json" }) as any;
  if (!session || Date.now() > Number(session.expiresAt || 0)) return null;
  const users = store("travo-users");
  return await users.get(`user/${session.userId}`, { type: "json" }) as any;
}

export default async (req: Request, _context: Context) => {
  if (req.method === "GET") {
    const configured = Boolean(Netlify.env.get("WHATSAPP_ACCESS_TOKEN") && Netlify.env.get("WHATSAPP_PHONE_NUMBER_ID") && Netlify.env.get("WHATSAPP_OTP_TEMPLATE") && Netlify.env.get("WHATSAPP_GRAPH_VERSION"));
    return Response.json({ ready: true, whatsappOtpConfigured: configured });
  }
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  try {
    const body = await req.json() as Body;
    if (body.action === "request_otp") {
      const p = body.profile || {};
      const name = (p.name || "").trim().slice(0, 100);
      const email = (p.email || "").trim().toLowerCase().slice(0, 160);
      const location = (p.location || "").trim().slice(0, 160);
      if (name.length < 2 || !validEmail(email)) return Response.json({ error: "INVALID_PROFILE" }, { status: 400 });
      const phone = normalizePhone(p.phone);
      const pending = store("travo-auth");
      const key = `otp/${hash(phone)}`;
      const previous = await pending.get(key, { type: "json" }) as any;
      if (previous?.lastSentAt && Date.now() - Number(previous.lastSentAt) < 60000) return Response.json({ error: "WAIT_BEFORE_RESEND" }, { status: 429 });
      const otp = String(randomInt(100000, 1000000));
      await pending.setJSON(key, { phone, name, email, location, otpHash: otpDigest(phone, otp), expiresAt: Date.now() + 5 * 60 * 1000, attempts: 0, lastSentAt: Date.now() });
      const delivery = await sendWhatsAppOtp(phone, otp);
      if (!delivery.configured) return Response.json({ ok: false, error: "WHATSAPP_NOT_CONFIGURED", whatsappOtpConfigured: false }, { status: 503 });
      if (!delivery.sent) return Response.json({ ok: false, error: "WHATSAPP_SEND_FAILED", whatsappOtpConfigured: true }, { status: 502 });
      return Response.json({ ok: true, phoneMasked: `+${phone.slice(0, 3)}••••${phone.slice(-3)}`, expiresInSeconds: 300 });
    }
    if (body.action === "verify_otp") {
      const phone = normalizePhone(body.phone);
      const otp = (body.otp || "").replace(/\D/g, "");
      if (!/^\d{6}$/.test(otp)) return Response.json({ error: "INVALID_OTP" }, { status: 400 });
      const pending = store("travo-auth");
      const key = `otp/${hash(phone)}`;
      const record = await pending.get(key, { type: "json" }) as any;
      if (!record || Date.now() > Number(record.expiresAt || 0)) return Response.json({ error: "OTP_EXPIRED" }, { status: 400 });
      if (Number(record.attempts || 0) >= 5) return Response.json({ error: "TOO_MANY_ATTEMPTS" }, { status: 429 });
      if (record.otpHash !== otpDigest(phone, otp)) {
        record.attempts = Number(record.attempts || 0) + 1;
        await pending.setJSON(key, record);
        return Response.json({ error: "OTP_MISMATCH", attemptsLeft: Math.max(0, 5 - record.attempts) }, { status: 400 });
      }
      const users = store("travo-users");
      const phoneKey = `phone/${hash(phone)}`;
      const existingId = await users.get(phoneKey);
      const now = new Date();
      const id = existingId || `TR-${randomInt(100000, 999999)}`;
      const existing = await users.get(`user/${id}`, { type: "json" }) as any;
      const trialEnd = existing?.trialEnd || new Date(Date.now() + 7 * 86400000).toISOString();
      const user = {
        id, name: record.name, email: record.email, phone: `+${phone}`, location: record.location || "",
        plan: existing?.plan || "7-Day Trial", status: existing?.status || "trial", trialStart: existing?.trialStart || now.toISOString(), trialEnd,
        createdAt: existing?.createdAt || now.toISOString(), updatedAt: now.toISOString(), lastLoginAt: now.toISOString()
      };
      await users.setJSON(`user/${id}`, user);
      await users.set(phoneKey, id);
      await pending.delete(key);
      const rawToken = randomBytes(32).toString("base64url");
      const sessions = store("travo-sessions");
      await sessions.setJSON(`session/${hash(rawToken)}`, { userId: id, createdAt: Date.now(), expiresAt: Date.now() + 30 * 86400000 });
      return Response.json({ ok: true, token: rawToken, user: { ...user, phone: user.phone.replace(/(\+\d{3})\d+(\d{3})$/, "$1•••••$2") } });
    }
    if (body.action === "logout") {
      if (body.token) await store("travo-sessions").delete(`session/${hash(body.token)}`);
      return Response.json({ ok: true });
    }
    const user = await sessionUser(body.token);
    return Response.json({ user });
  } catch (error: any) {
    const code = error?.message || "AUTH_ERROR";
    return Response.json({ error: code }, { status: code === "INVALID_PHONE" ? 400 : 500 });
  }
};

export const config: Config = { path: "/api/auth" };
