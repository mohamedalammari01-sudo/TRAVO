import type { Config, Context } from "@netlify/functions";
import { getDeployStore, getStore } from "@netlify/blobs";
import { createHash, timingSafeEqual } from "node:crypto";

function store(name: string) {
  const isProd = (Netlify as any).context?.deploy?.context === "production";
  return isProd ? getStore(name, { consistency: "strong" }) : getDeployStore(name);
}

function secureEqual(a: string, b: string) {
  const ah = createHash("sha256").update(a).digest();
  const bh = createHash("sha256").update(b).digest();
  return timingSafeEqual(ah, bh);
}

function authorized(req: Request) {
  const secret = Netlify.env.get("TRAVO_ADMIN_TOKEN");
  if (!secret) return false;
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  return Boolean(token) && secureEqual(token, secret);
}

export default async (req: Request, _context: Context) => {
  if (req.method !== "GET") return new Response("Method not allowed", { status: 405 });
  if (!authorized(req)) return Response.json({ error: "OWNER_AUTH_REQUIRED" }, { status: 401 });
  try {
    const usersStore = store("travo-users");
    const listed = await usersStore.list({ prefix: "user/" }) as any;
    const users = [] as any[];
    for (const item of listed.blobs || []) {
      const user = await usersStore.get(item.key, { type: "json" });
      if (user) users.push(user);
    }
    users.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
    const now = Date.now();
    const premium = users.filter(u => u.status === "active" && String(u.plan || "").toLowerCase().includes("premium")).length;
    const trials = users.filter(u => u.status === "trial" && new Date(u.trialEnd || 0).getTime() > now).length;
    const expiring = users.filter(u => {
      const d = new Date(u.trialEnd || u.renewal || 0).getTime();
      return d > now && d <= now + 7 * 86400000;
    }).length;
    return Response.json({ users, metrics: { total: users.length, premium, trials, expiring } });
  } catch (error) {
    console.error("TRAVO admin customers error", error);
    return Response.json({ error: "ADMIN_DATA_UNAVAILABLE" }, { status: 500 });
  }
};

export const config: Config = { path: "/api/admin/customers" };
