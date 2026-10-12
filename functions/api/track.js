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

// ---------- KI-Bots & KI-Agenten ----------
// kind: train = sammelt Trainingsdaten · search = KI-Suche/Index · user = ruft Seite für eine Nutzerfrage ab · agent = steuert einen Browser
export const AI_BOTS = [
  ["GPTBot", "OpenAI", "train"], ["OAI-SearchBot", "OpenAI", "search"], ["ChatGPT-User", "OpenAI", "user"],
  ["ClaudeBot", "Anthropic", "train"], ["Claude-SearchBot", "Anthropic", "search"], ["Claude-User", "Anthropic", "user"],
  ["Claude-Web", "Anthropic", "user"], ["anthropic-ai", "Anthropic", "train"],
  ["PerplexityBot", "Perplexity", "search"], ["Perplexity-User", "Perplexity", "user"],
  ["Google-CloudVertexBot", "Google", "user"], ["Gemini-Deep-Research", "Google", "user"],
  ["meta-externalagent", "Meta", "train"], ["meta-externalfetcher", "Meta", "user"], ["FacebookBot", "Meta", "train"],
  ["Amazonbot", "Amazon", "search"], ["Bytespider", "ByteDance", "train"], ["CCBot", "Common Crawl", "train"],
  ["MistralAI-User", "Mistral", "user"], ["DuckAssistBot", "DuckDuckGo", "user"],
  ["cohere-training-data-crawler", "Cohere", "train"], ["cohere-ai", "Cohere", "user"],
  ["YouBot", "You.com", "search"], ["Diffbot", "Diffbot", "train"], ["AI2Bot", "Allen AI", "train"],
  ["Timpibot", "Timpi", "train"], ["ImagesiftBot", "ImageSift", "train"], ["Omgilibot", "Webz.io", "train"],
  ["PanguBot", "Huawei", "train"], ["PetalBot", "Huawei", "search"], ["Kangaroo Bot", "Kangaroo LLM", "train"],
  ["img2dataset", "img2dataset", "train"], ["iaskspider", "iAsk", "search"], ["Brightbot", "Bright Data", "train"]
];
const AI_RE = new RegExp(AI_BOTS.map(b => b[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "i");
const SIGNED_AGENTS = { "chatgpt.com": ["ChatGPT Agent", "OpenAI", "agent"] };

export function aiInfo(name) {
  const b = AI_BOTS.find(x => x[0].toLowerCase() === String(name).toLowerCase())
    || Object.values(SIGNED_AGENTS).find(x => x[0] === name);
  return b ? { org: b[1], kind: b[2] } : { org: "", kind: "other" };
}

// Liefert den Bot-Namen, wenn die Anfrage von einem KI-Crawler oder KI-Agenten stammt, sonst null.
export function detectAI(request) {
  const sig = (request.headers.get("signature-agent") || "").replace(/["\s]/g, "");
  if (sig) {
    let host = sig;
    try { host = new URL(sig).host; } catch {}
    host = host.replace(/^www\./, "");
    return SIGNED_AGENTS[host] ? SIGNED_AGENTS[host][0] : clean("Agent: " + host, 60);
  }
  const ua = request.headers.get("user-agent") || "";
  const m = ua.match(AI_RE);
  if (m) {
    const hit = AI_BOTS.find(b => b[0].toLowerCase() === m[0].toLowerCase());
    return hit ? hit[0] : m[0];
  }
  const cat = request.cf && request.cf.verifiedBotCategory;
  if (cat && /^AI /i.test(cat)) return clean(cat, 60);
  return null;
}

// Zählt einen Seitenabruf durch einen KI-Bot (type = "ai", target = Bot-Name).
export async function recordAI(env, request, path, bot) {
  if (!env.DB) return;
  const row = [new Date().toISOString().slice(0, 10), "ai", clean(path, 120), clean(bot, 80), "", "", clean(request.cf && request.cf.country, 2)];
  const sql = `INSERT INTO stats (day,type,path,target,lang,ref,country,n) VALUES (?,?,?,?,?,?,?,1)
    ON CONFLICT(day,type,path,target,lang,ref,country) DO UPDATE SET n = n + 1`;
  try {
    await env.DB.prepare(sql).bind(...row).run();
  } catch (e) {
    try { await env.DB.exec(SCHEMA.replace(/\n\s*/g, " ")); await env.DB.prepare(sql).bind(...row).run(); } catch {}
  }
}

export async function onRequestPost({ request, env }) {
  const ok = new Response(null, { status: 204 });
  if (!env.DB) return ok;
  const ua = request.headers.get("user-agent") || "";
  if (!ua || BOT.test(ua)) return ok;
  // KI-Agenten mit echtem Browser: Seitenabruf wurde schon in _middleware.js als "ai" gezählt
  if (detectAI(request)) return ok;
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
