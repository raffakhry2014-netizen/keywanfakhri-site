// Kontaktformular: nimmt Nachrichten direkt auf der Website entgegen.
// 1) Speichert jede Nachricht in Cloudflare D1 (Binding "DB", Tabelle "messages") → sichtbar im Panel (/admin, Tab „پیام‌ها").
// 2) Schickt zusätzlich eine E-Mail an CONTACT_TO (Standard: keywanfakhri1@gmail.com), wenn das Secret RESEND_API_KEY gesetzt ist.
// Keine IP-Adresse, keine Cookies.

export const MSG_SCHEMA = `CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT, created TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL,
  message TEXT NOT NULL, lang TEXT NOT NULL DEFAULT '', page TEXT NOT NULL DEFAULT '', mailed INTEGER NOT NULL DEFAULT 0)`;

const TO = "keywanfakhri1@gmail.com";
const clean = (v, max) => String(v || "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, max);
const json = (d, status = 200) => new Response(JSON.stringify(d), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

async function sendMail(env, m) {
  if (!env.RESEND_API_KEY) return false;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: env.CONTACT_FROM || "KeyOne Website <onboarding@resend.dev>",
      to: [env.CONTACT_TO || TO],
      reply_to: m.email,
      subject: `Neue Nachricht von ${m.name} – keywanfakhri.com`,
      text: `Name: ${m.name}\nE-Mail: ${m.email}\nSprache: ${m.lang}\nSeite: ${m.page}\n\n${m.message}`,
      html: `<p><b>Name:</b> ${esc(m.name)}<br><b>E-Mail:</b> <a href="mailto:${esc(m.email)}">${esc(m.email)}</a><br><b>Sprache:</b> ${esc(m.lang)}</p><p style="white-space:pre-wrap">${esc(m.message)}</p>`
    })
  });
  return r.ok;
}

export async function onRequestPost({ request, env }) {
  const url = new URL(request.url);
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== url.host) return json({ error: "forbidden" }, 403);

  let d;
  try { d = await request.json(); } catch { return json({ error: "invalid" }, 400); }

  // Spam-Schutz: verstecktes Feld muss leer sein, Formular nicht in < 3 s ausgefüllt
  if (d.website || (Number(d.elapsed) > 0 && Number(d.elapsed) < 3000)) return json({ ok: true });

  const m = {
    name: clean(d.name, 100), email: clean(d.email, 150), message: clean(d.message, 3000),
    lang: clean(d.lang, 5), page: clean(d.page, 120)
  };
  if (!m.name || !m.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email)) return json({ error: "invalid" }, 400);

  let stored = false, mailed = false;
  if (env.DB) {
    const ins = () => env.DB.prepare("INSERT INTO messages (created,name,email,message,lang,page) VALUES (?,?,?,?,?,?)")
      .bind(new Date().toISOString(), m.name, m.email, m.message, m.lang, m.page).run();
    try { await ins(); stored = true; }
    catch { try { await env.DB.exec(MSG_SCHEMA.replace(/\n\s*/g, " ")); await ins(); stored = true; } catch {} }
  }
  try { mailed = await sendMail(env, m); } catch {}
  if (stored && mailed) {
    try { await env.DB.prepare("UPDATE messages SET mailed=1 WHERE id=(SELECT MAX(id) FROM messages WHERE email=?)").bind(m.email).run(); } catch {}
  }

  if (!stored && !mailed) return json({ error: "unavailable" }, 503);
  return json({ ok: true });
}

export const onRequest = () => json({ error: "method" }, 405);
