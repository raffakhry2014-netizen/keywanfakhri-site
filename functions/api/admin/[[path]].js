// Admin-API für /admin: Anmeldung, Statistik (D1) und Bearbeitung der Website über die GitHub-API.
// Benötigte Einstellungen in Cloudflare Pages (Settings → Variables and Secrets / Bindings):
//   ADMIN_PASSWORD  (Secret)  – Passwort für das Panel
//   GITHUB_TOKEN    (Secret)  – Fine-grained Token, nur dieses Repository, "Contents: Read and write"
//   DB              (D1-Binding) – Datenbank für die Statistik
//   GITHUB_REPO     (optional) – Standard: raffakhry2014-netizen/keywanfakhri-site
import { SCHEMA } from "../track.js";

const COOKIE = "keyone_admin";
const SESSION_HOURS = 12;
const enc = new TextEncoder();

const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers }
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

// ---------- GitHub ----------
const b64encode = text => {
  const bytes = enc.encode(text);
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
};
const b64decode = b64 => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g, "")), c => c.charCodeAt(0)));

async function gh(env, path, init = {}) {
  const repo = env.GITHUB_REPO || "raffakhry2014-netizen/keywanfakhri-site";
  const res = await fetch(`https://api.github.com/repos/${repo}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${env.GITHUB_TOKEN}`,
      accept: "application/vnd.github+json",
      "x-github-api-version": "2022-11-28",
      "user-agent": "keyone-admin",
      ...(init.body ? { "content-type": "application/json" } : {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.message || "GitHub " + res.status), { status: res.status });
  return data;
}
async function readFile(env, path) {
  const d = await gh(env, `/contents/${encodeURI(path)}?ref=main`);
  if (d.content === "" && d.size > 0 && d.git_url) {
    const blob = await gh(env, `/git/blobs/${d.sha}`);
    return { text: b64decode(blob.content), sha: d.sha };
  }
  return { text: b64decode(d.content || ""), sha: d.sha };
}
async function writeFile(env, path, text, sha, message) {
  const d = await gh(env, `/contents/${encodeURI(path)}`, {
    method: "PUT",
    body: JSON.stringify({ message: message || `Panel: ${path} aktualisiert`, content: b64encode(text), sha, branch: "main" })
  });
  return { sha: d.content && d.content.sha, commit: d.commit && d.commit.sha };
}
const EDITABLE = /\.(html|css|js|json|md|txt|svg|xml)$/i;
const BLOCKED = /^(functions\/|\.git)/;

// ---------- Statistik ----------
async function stats(env, days) {
  if (!env.DB) return { configured: false };
  await env.DB.exec(SCHEMA.replace(/\n\s*/g, " "));
  const since = new Date(Date.now() - (days - 1) * 864e5).toISOString().slice(0, 10);
  const q = (sql) => env.DB.prepare(sql).bind(since).all().then(r => r.results);
  const [daily, pages, clicks, langs, refs, countries] = await Promise.all([
    q(`SELECT day, type, SUM(n) AS n FROM stats WHERE day >= ? GROUP BY day, type ORDER BY day`),
    q(`SELECT path, SUM(n) AS n FROM stats WHERE day >= ? AND type='view' GROUP BY path ORDER BY n DESC LIMIT 60`),
    q(`SELECT target, path, SUM(n) AS n FROM stats WHERE day >= ? AND type='click' GROUP BY target, path ORDER BY n DESC LIMIT 100`),
    q(`SELECT lang AS k, SUM(n) AS n FROM stats WHERE day >= ? AND type='view' GROUP BY lang ORDER BY n DESC`),
    q(`SELECT ref AS k, SUM(n) AS n FROM stats WHERE day >= ? AND type='view' AND ref<>'' GROUP BY ref ORDER BY n DESC LIMIT 20`),
    q(`SELECT country AS k, SUM(n) AS n FROM stats WHERE day >= ? AND type='view' GROUP BY country ORDER BY n DESC LIMIT 20`)
  ]);
  return { configured: true, since, days, daily, pages, clicks, langs, refs, countries };
}

// ---------- Router ----------
export async function onRequest({ request, env, params }) {
  const route = (params.path || []).join("/");
  const method = request.method;
  const url = new URL(request.url);

  if (!env.ADMIN_PASSWORD) return json({ error: "setup", missing: "ADMIN_PASSWORD" }, 503);

  if (method !== "GET") {
    const origin = request.headers.get("origin");
    if (origin && new URL(origin).host !== url.host) return json({ error: "forbidden" }, 403);
  }

  if (route === "login" && method === "POST") {
    const { password } = await request.json().catch(() => ({}));
    await new Promise(r => setTimeout(r, 400));
    const a = await hmac("cmp", String(password || "")), b = await hmac("cmp", env.ADMIN_PASSWORD);
    if (!safeEqual(a, b)) return json({ error: "wrong-password" }, 401);
    const exp = Date.now() + SESSION_HOURS * 3600e3;
    const sig = await hmac(env.ADMIN_PASSWORD, "session:" + exp);
    return json({ ok: true }, 200, {
      "set-cookie": `${COOKIE}=${exp}.${sig}; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_HOURS * 3600}`
    });
  }
  if (route === "logout") {
    return json({ ok: true }, 200, { "set-cookie": `${COOKIE}=; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=0` });
  }

  if (!(await isAuthed(request, env))) return json({ error: "unauthorized" }, 401);

  try {
    if (route === "me") return json({ ok: true, db: !!env.DB, github: !!env.GITHUB_TOKEN });

    if (route === "stats") {
      const days = Math.min(365, Math.max(1, parseInt(url.searchParams.get("days") || "30", 10)));
      return json(await stats(env, days));
    }

    if (!env.GITHUB_TOKEN) return json({ error: "setup", missing: "GITHUB_TOKEN" }, 503);

    if (route === "content" && method === "GET") {
      const f = await readFile(env, "cms/content.json");
      return json({ sha: f.sha, data: JSON.parse(f.text) });
    }
    if (route === "content" && method === "PUT") {
      const { data, sha, message } = await request.json();
      if (!data || !data.snapshot || !data.snapshot.content) return json({ error: "invalid content" }, 400);
      return json(await writeFile(env, "cms/content.json", JSON.stringify(data), sha, message || "Panel: Texte aktualisiert"));
    }
    if (route === "files") {
      const t = await gh(env, `/git/trees/main?recursive=1`);
      return json(t.tree.filter(x => x.type === "blob" && EDITABLE.test(x.path) && !BLOCKED.test(x.path)).map(x => ({ path: x.path, size: x.size })));
    }
    if (route === "file") {
      const path = method === "GET" ? url.searchParams.get("path") : null;
      if (method === "GET") {
        if (!path || !EDITABLE.test(path) || BLOCKED.test(path) || path.includes("..")) return json({ error: "not allowed" }, 400);
        return json(await readFile(env, path));
      }
      if (method === "PUT") {
        const b = await request.json();
        if (!b.path || !EDITABLE.test(b.path) || BLOCKED.test(b.path) || b.path.includes("..")) return json({ error: "not allowed" }, 400);
        if (b.path.endsWith(".json")) JSON.parse(b.text);
        return json(await writeFile(env, b.path, b.text, b.sha, b.message));
      }
    }
    if (route === "history") {
      const c = await gh(env, `/commits?sha=main&per_page=20`);
      return json(c.map(x => ({ sha: x.sha, message: x.commit.message.split("\n")[0], date: x.commit.author.date, url: x.html_url })));
    }
    if (route === "deploy-status") {
      const c = await gh(env, `/commits/main/status`).catch(() => null);
      const runs = await gh(env, `/commits/main/check-runs`).catch(() => null);
      return json({ state: c && c.state, checks: runs && runs.check_runs ? runs.check_runs.map(r => ({ name: r.name, status: r.status, conclusion: r.conclusion })) : [] });
    }
    return json({ error: "not found" }, 404);
  } catch (e) {
    return json({ error: e.message || "error", status: e.status }, e.status === 409 ? 409 : 500);
  }
}
