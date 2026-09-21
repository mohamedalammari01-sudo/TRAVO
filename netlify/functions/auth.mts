import type { Config, Context } from "@netlify/functions";
import { getDeployStore, getStore } from "@netlify/blobs";
import { createHash, randomBytes, randomInt } from "node:crypto";

type ProfileInput = { name?: string; email?: string; phone?: string; location?: string };
type Body = {
  action?: "request_otp" | "verify_otp" | "logout";
  profile?: ProfileInput;
  email?: string;
  otp?: string;
  token?: string;
};

function store(name: string) {
  const isProd = (Netlify as any).context?.deploy?.context === "production";
  return isProd ? getStore(name, { consistency: "strong" }) : getDeployStore(name);
}

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function normalizePhone(value = "") {
  let d = value.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (/^05\d{8}$/.test(d)) d = `966${d.slice(1)}`;
  if (d.startsWith("0") && d.length >= 9) d = d.slice(1);
  if (!/^\d{9,15}$/.test(d)) throw new Error("INVALID_PHONE");
  return d;
}

function normalizeEmail(value = "") {
  return value.trim().toLowerCase().slice(0, 160);
}

function validEmail(value = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function authSecret() {
  const secret = Netlify.env.get("TRAVO_AUTH_SECRET");
  if (!secret) throw new Error("AUTH_NOT_CONFIGURED");
  return secret;
}

function otpDigest(email: string, otp: string) {
  return hash(`${authSecret()}:${email}:${otp}`);
}

function emailConfig() {
  return {
    apiKey: Netlify.env.get("BREVO_API_KEY") || "",
    senderEmail: Netlify.env.get("BREVO_SENDER_EMAIL") || "",
    senderName: Netlify.env.get("BREVO_SENDER_NAME") || "TRAVO",
  };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[ch] || ch));
}

async function sendEmailOtp(email: string, name: string, otp: string) {
  const cfg = emailConfig();
  if (!cfg.apiKey || !cfg.senderEmail) {
    return { configured: false, sent: false };
  }

  const safeName = escapeHtml(name || "TRAVO traveler");
  const html = `<!doctype html>
<html lang="ar" dir="rtl">
  <body style="margin:0;background:#f7f4ff;font-family:Arial,Tahoma,sans-serif;color:#211a2f">
    <div style="max-width:560px;margin:0 auto;padding:32px 18px">
      <div style="background:#ffffff;border-radius:24px;padding:32px;box-shadow:0 12px 36px rgba(87,61,125,.10)">
        <div style="font-size:24px;font-weight:800;letter-spacing:.08em;color:#7257a6">TRAVO</div>
        <h1 style="font-size:24px;margin:22px 0 8px">رمز التحقق الخاص بك</h1>
        <p style="font-size:16px;line-height:1.8;margin:0 0 20px">مرحبًا ${safeName}، استخدم الرمز التالي لإكمال تسجيل الدخول إلى TRAVO.</p>
        <div style="font-size:38px;font-weight:800;letter-spacing:10px;text-align:center;background:#f3edff;border-radius:18px;padding:20px;margin:18px 0">${otp}</div>
        <p style="font-size:14px;line-height:1.8;color:#6f6879;margin:0">الرمز صالح لمدة 5 دقائق. إذا لم تطلب هذا الرمز فتجاهل الرسالة.</p>
        <hr style="border:0;border-top:1px solid #eee8f7;margin:26px 0">
        <p dir="ltr" style="font-size:13px;line-height:1.7;color:#8a8392;margin:0">Your TRAVO verification code is <b>${otp}</b>. It expires in 5 minutes.</p>
      </div>
    </div>
  </body>
</html>`;

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": cfg.apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: cfg.senderName, email: cfg.senderEmail },
      to: [{ email, name }],
      subject: "TRAVO — رمز التحقق",
      htmlContent: html,
      textContent: `TRAVO verification code: ${otp}. This code expires in 5 minutes.`,
      tags: ["travo-otp"],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("TRAVO email OTP error", response.status, detail.slice(0, 800));
    return { configured: true, sent: false };
  }

  return { configured: true, sent: true };
}

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  const visible = local.length <= 2 ? local[0] || "" : local.slice(0, 2);
  return `${visible}••••@${domain}`;
}

async function sessionUser(token?: string) {
  if (!token) return null;
  const sessions = store("travo-sessions");
  const session = (await sessions.get(`session/${hash(token)}`, { type: "json" })) as any;
  if (!session || Date.now() > Number(session.expiresAt || 0)) return null;
  const users = store("travo-users");
  return (await users.get(`user/${session.userId}`, { type: "json" })) as any;
}

export default async (req: Request, _context: Context) => {
  if (req.method === "GET") {
    const cfg = emailConfig();
    const configured = Boolean(cfg.apiKey && cfg.senderEmail);
    return Response.json({ ready: true, emailOtpConfigured: configured });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = (await req.json()) as Body;

    if (body.action === "request_otp") {
      const p = body.profile || {};
      const name = (p.name || "").trim().slice(0, 100);
      const email = normalizeEmail(p.email);
      const location = (p.location || "").trim().slice(0, 160);

      if (name.length < 2 || !validEmail(email)) {
        return Response.json({ error: "INVALID_PROFILE" }, { status: 400 });
      }

      const phone = normalizePhone(p.phone);
      const pending = store("travo-auth");
      const key = `otp-email/${hash(email)}`;
      const now = Date.now();
      const previous = (await pending.get(key, { type: "json" })) as any;

      if (previous?.lastSentAt && now - Number(previous.lastSentAt) < 60_000) {
        return Response.json({ error: "WAIT_BEFORE_RESEND" }, { status: 429 });
      }

      const rateKey = `rate-email/${hash(email)}`;
      let rate = (await pending.get(rateKey, { type: "json" })) as any;
      if (!rate || now - Number(rate.windowStartedAt || 0) >= 60 * 60 * 1000) {
        rate = { windowStartedAt: now, sentCount: 0 };
      }

      if (Number(rate.sentCount || 0) >= 6) {
        const retryAfterSeconds = Math.max(
          1,
          Math.ceil((Number(rate.windowStartedAt) + 60 * 60 * 1000 - now) / 1000),
        );
        return Response.json(
          { error: "OTP_RATE_LIMIT", retryAfterSeconds },
          { status: 429 },
        );
      }

      const otp = String(randomInt(100000, 1000000));
      const delivery = await sendEmailOtp(email, name, otp);

      if (!delivery.configured) {
        return Response.json(
          {
            ok: false,
            error: "EMAIL_NOT_CONFIGURED",
            emailOtpConfigured: false,
          },
          { status: 503 },
        );
      }

      if (!delivery.sent) {
        return Response.json(
          {
            ok: false,
            error: "EMAIL_SEND_FAILED",
            emailOtpConfigured: true,
          },
          { status: 502 },
        );
      }

      await pending.setJSON(key, {
        phone,
        name,
        email,
        location,
        otpHash: otpDigest(email, otp),
        expiresAt: now + 5 * 60 * 1000,
        attempts: 0,
        lastSentAt: now,
      });

      rate.sentCount = Number(rate.sentCount || 0) + 1;
      rate.lastSentAt = now;
      await pending.setJSON(rateKey, rate);

      return Response.json({
        ok: true,
        emailMasked: maskEmail(email),
        expiresInSeconds: 300,
      });
    }

    if (body.action === "verify_otp") {
      const email = normalizeEmail(body.email);
      const otp = (body.otp || "").replace(/\D/g, "");

      if (!validEmail(email)) {
        return Response.json({ error: "INVALID_EMAIL" }, { status: 400 });
      }
      if (!/^\d{6}$/.test(otp)) {
        return Response.json({ error: "INVALID_OTP" }, { status: 400 });
      }

      const pending = store("travo-auth");
      const key = `otp-email/${hash(email)}`;
      const record = (await pending.get(key, { type: "json" })) as any;

      if (!record || Date.now() > Number(record.expiresAt || 0)) {
        return Response.json({ error: "OTP_EXPIRED" }, { status: 400 });
      }
      if (Number(record.attempts || 0) >= 5) {
        return Response.json({ error: "TOO_MANY_ATTEMPTS" }, { status: 429 });
      }

      if (record.otpHash !== otpDigest(email, otp)) {
        record.attempts = Number(record.attempts || 0) + 1;
        await pending.setJSON(key, record);
        return Response.json(
          {
            error: "OTP_MISMATCH",
            attemptsLeft: Math.max(0, 5 - record.attempts),
          },
          { status: 400 },
        );
      }

      const users = store("travo-users");
      const emailKey = `email/${hash(email)}`;
      const existingId = await users.get(emailKey);
      const now = new Date();
      const id = existingId || `TR-${randomInt(100000, 999999)}`;
      const existing = (await users.get(`user/${id}`, { type: "json" })) as any;
      const trialEnd =
        existing?.trialEnd || new Date(Date.now() + 7 * 86400000).toISOString();

      const user = {
        id,
        name: record.name,
        email: record.email,
        phone: `+${record.phone}`,
        location: record.location || "",
        emailVerified: true,
        plan: existing?.plan || "7-Day Trial",
        status: existing?.status || "trial",
        trialStart: existing?.trialStart || now.toISOString(),
        trialEnd,
        createdAt: existing?.createdAt || now.toISOString(),
        updatedAt: now.toISOString(),
        lastLoginAt: now.toISOString(),
      };

      await users.setJSON(`user/${id}`, user);
      await users.set(emailKey, id);
      await pending.delete(key);

      const rawToken = randomBytes(32).toString("base64url");
      const sessions = store("travo-sessions");
      await sessions.setJSON(`session/${hash(rawToken)}`, {
        userId: id,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * 86400000,
      });

      return Response.json({
        ok: true,
        token: rawToken,
        user: {
          ...user,
          phone: user.phone.replace(/(\+\d{3})\d+(\d{3})$/, "$1•••••$2"),
        },
      });
    }

    if (body.action === "logout") {
      if (body.token) {
        await store("travo-sessions").delete(`session/${hash(body.token)}`);
      }
      return Response.json({ ok: true });
    }

    const user = await sessionUser(body.token);
    return Response.json({ user });
  } catch (error: any) {
    const code = error?.message || "AUTH_ERROR";
    return Response.json(
      { error: code },
      { status: code === "INVALID_PHONE" ? 400 : 500 },
    );
  }
};

export const config: Config = { path: "/api/auth" };
