// Serves the server-localized pages (About, 6M, Prozessatlas) in the language given by ?lang=
const LOCALIZED = ["/about", "/projects/6m", "/projects/prozessatlas"];
const LANGS = ["de","en","fa","ar","tr","it","fr","ko","zh","ja","es","sq"];

export async function onRequest(context) {
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
