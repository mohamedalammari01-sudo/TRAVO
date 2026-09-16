import type { Config, Context } from "@netlify/functions";
import { getDeployStore, getStore } from "@netlify/blobs";
import { createHash } from "node:crypto";

function store(name: string) {
  const isProd = (Netlify as any).context?.deploy?.context === "production";
  return isProd ? getStore(name, { consistency: "strong" }) : getDeployStore(name);
}
function hash(value: string) { return createHash("sha256").update(value).digest("hex"); }
async function getUserFromRequest(req: Request) {
  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) return null;
  const sessions = store("travo-sessions");
  const session = await sessions.get(`session/${hash(token)}`, { type: "json" }) as any;
  if (!session || Date.now() > Number(session.expiresAt || 0)) return null;
  const users = store("travo-users");
  const user = await users.get(`user/${session.userId}`, { type: "json" }) as any;
  return user ? { token, session, user, users } : null;
}
function validEmail(value = "") { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()); }

export default async (req: Request, _context: Context) => {
  const auth = await getUserFromRequest(req);
  if (!auth) return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  if (req.method === "GET") return Response.json({ user: auth.user });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  try {
    const body = await req.json() as { name?: string; email?: string; location?: string };
    const name = (body.name ?? auth.user.name ?? "").trim().slice(0, 100);
    const email = (body.email ?? auth.user.email ?? "").trim().toLowerCase().slice(0, 160);
    const location = (body.location ?? auth.user.location ?? "").trim().slice(0, 160);
    if (name.length < 2 || !validEmail(email)) return Response.json({ error: "INVALID_PROFILE" }, { status: 400 });
    const user = { ...auth.user, name, email, location, updatedAt: new Date().toISOString() };
    await auth.users.setJSON(`user/${user.id}`, user);
    return Response.json({ ok: true, user });
  } catch {
    return Response.json({ error: "PROFILE_UPDATE_FAILED" }, { status: 500 });
  }
};

export const config: Config = { path: "/api/profile" };
