// Serves the server-localized pages (About, 6M, Prozessatlas) in the language given by ?lang=
// and counts page requests from AI crawlers/agents separately (they don't run track.js).
import { detectAI, recordAI } from "./api/track.js";

const AI_FILES = ["/robots.txt", "/llms.txt", "/sitemap.xml"];
const isPage = p => !/^\/(api|admin|cms)(\/|$)/.test(p) && (/(\/|\.html)$/.test(p) || !/\.[a-z0-9]+$/i.test(p) || AI_FILES.includes(p));
const LOCALIZED = ["/about", "/projects/6m", "/projects/prozessatlas", "/templates/warehouse-intelligence", "/templates/executive-reporting-center", "/guides/warehouse-kpis"];
const LANGS = ["de","en","fa","ar","tr","it","fr","ko","zh","ja","es","sq"];

export async function onRequest(context) {
  const response = await serve(context);
  try {
    const { request } = context;
    if ((request.method === "GET" || request.method === "HEAD") && response.status < 400) {
      const p = new URL(request.url).pathname;
      if (isPage(p)) {
        const bot = detectAI(request);
        if (bot) context.waitUntil(recordAI(context.env, request, p.replace(/index(\.[a-z]{2})?\.html$/, ""), bot));
      }
    }
  } catch {}
  return response;
}

async function serve(context) {
  const url = new URL(context.request.url);
  const path = url.pathname.replace(/\/(index(\.html)?)?$/, "");
  const lang = url.searchParams.get("lang");
  if (LOCALIZED.includes(path) && lang && LANGS.includes(lang) && lang !== "de") {
    const asset = await context.env.ASSETS.fetch(new URL(`${path}/index.${lang}`, url.origin));
    if (asset.ok) {
      return new Response(asset.body, {
        headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" }
      });
    }
  }
  return context.next();
}
