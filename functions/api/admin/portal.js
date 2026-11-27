// Admin: Protokoll der Projektseite lesen (gleiche Anmeldung wie /admin).
import { PORTAL_SCHEMA } from "../portal.js";

const COOKIE = "keyone_admin";
const enc = new TextEncoder();
const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
});
async function hmac(secret, msg) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(msg));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, "0")).join("");
}
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
async function isAuthed(request, env) {
  const m = (request.headers.get("cookie") || "").match(new RegExp(COOKIE + "=([0-9]+)\\.([0-9a-f]{64})"));
  if (!m || Number(m[1]) < Date.now()) return false;
  return safeEqual(m[2], await hmac(env.ADMIN_PASSWORD, "session:" + m[1]));
}

export async function onRequestGet({ request, env }) {
  if (!env.ADMIN_PASSWORD || !(await isAuthed(request, env))) return json({ error: "unauthorized" }, 401);
  if (!env.DB) return json({ configured: false, rows: [] });
  await env.DB.exec(PORTAL_SCHEMA.replace(/\n\s*/g, " "));
  const r = await env.DB.prepare("SELECT ts,page,event,item,own,dev FROM portal_events ORDER BY id DESC LIMIT 3000").all();
  return json({ configured: true, rows: r.results });
}
