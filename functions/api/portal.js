// Anonymes Protokoll der Projektseite /p/xwzhgeyiox/ in D1 (Binding "DB").
// Gespeichert wird nur: Zeit, Aktion, Datei, eigener Browser ja/nein, Gerätetyp. Keine IP, keine Cookies.
import { detectAI } from "./track.js";

export const PORTAL_SCHEMA = `CREATE TABLE IF NOT EXISTS portal_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT, ts TEXT NOT NULL, page TEXT NOT NULL DEFAULT '',
  event TEXT NOT NULL, item TEXT NOT NULL DEFAULT '', own INTEGER NOT NULL DEFAULT 0, dev TEXT NOT NULL DEFAULT '')`;
const EVENTS = new Set(["view", "unlock", "open", "play", "dl"]);
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|curl|wget|python|monitor/i;
const clean = (v, max) => String(v || "").replace(/[\u0000-\u001f]/g, "").slice(0, max);

export async function onRequestPost({ request, env }) {
  const ok = new Response(null, { status: 204 });
  if (!env.DB) return ok;
  const ua = request.headers.get("user-agent") || "";
  if (!ua || BOT.test(ua) || detectAI(request)) return ok;
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) return ok;
  let d;
  try { d = JSON.parse(await request.text() || "{}"); } catch { return ok; }
  if (!EVENTS.has(d.e)) return ok;
  const row = [new Date().toISOString(), clean(d.page, 40), d.e, clean(d.item, 80), d.own ? 1 : 0,
    /Mobi|Android|iPhone|iPad/i.test(ua) ? "mobile" : "desktop"];
  const sql = "INSERT INTO portal_events (ts,page,event,item,own,dev) VALUES (?,?,?,?,?,?)";
  try { await env.DB.prepare(sql).bind(...row).run(); }
  catch (e) { try { await env.DB.exec(PORTAL_SCHEMA.replace(/\n\s*/g, " ")); await env.DB.prepare(sql).bind(...row).run(); } catch {} }
  return ok;
}

export const onRequest = () => new Response(null, { status: 405 });
