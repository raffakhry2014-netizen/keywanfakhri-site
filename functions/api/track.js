// Anonyme, aggregierte Zählung von Seitenaufrufen und Klicks in Cloudflare D1 (Binding "DB").
// Gespeichert wird nur: Tag, Typ, Pfad, Klickziel, Sprache, verweisende Domain, Land, Anzahl.
// Keine IP-Adresse, keine Kennung, keine Cookies.
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|curl|wget|python|monitor/i;

export const SCHEMA = `CREATE TABLE IF NOT EXISTS stats (
  day TEXT NOT NULL, type TEXT NOT NULL, path TEXT NOT NULL, target TEXT NOT NULL DEFAULT '',
  lang TEXT NOT NULL DEFAULT '', ref TEXT NOT NULL DEFAULT '', country TEXT NOT NULL DEFAULT '',
  n INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, type, path, target, lang, ref, country))`;

const clean = (v, max) => String(v || "").replace(/[\u0000-\u001f]/g, "").slice(0, max);

export async function onRequestPost({ request, env }) {
  const ok = new Response(null, { status: 204 });
  if (!env.DB) return ok;
  const ua = request.headers.get("user-agent") || "";
  if (!ua || BOT.test(ua)) return ok;
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) return ok;
  let d;
  try { d = await request.json(); } catch { return ok; }
  const type = d.t === "click" ? "click" : "view";
  const path = clean(d.p, 120);
  if (!path.startsWith("/") || path.startsWith("/admin") || path.startsWith("/api")) return ok;
  const row = [
    new Date().toISOString().slice(0, 10), type, path,
    type === "click" ? clean(d.k, 80) : "", clean(d.l, 5),
    clean(d.r, 80).toLowerCase().replace(/^www\./, ""),
    clean(request.cf && request.cf.country, 2)
  ];
  const sql = `INSERT INTO stats (day,type,path,target,lang,ref,country,n) VALUES (?,?,?,?,?,?,?,1)
    ON CONFLICT(day,type,path,target,lang,ref,country) DO UPDATE SET n = n + 1`;
  try {
    await env.DB.prepare(sql).bind(...row).run();
  } catch (e) {
    try { await env.DB.exec(SCHEMA.replace(/\n\s*/g, " ")); await env.DB.prepare(sql).bind(...row).run(); } catch {}
  }
  return ok;
}

export const onRequest = () => new Response(null, { status: 405 });
