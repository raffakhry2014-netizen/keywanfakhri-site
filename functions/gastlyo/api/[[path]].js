// Gastlyo on keywanfakhri.com/gastlyo/ — forwards the two Gastlyo API calls
// (menu config and KIWA chat) to the Gastlyo backend on Vercel.
// No secrets live here: the Vercel project keeps the Supabase and OpenAI keys.
const BACKEND = "https://kf-restaurant-steel.vercel.app/api/";
const ALLOWED = { config: ["GET"], chat: ["POST"] };

export async function onRequest({ request, params }) {
  const name = Array.isArray(params.path) ? params.path.join("/") : String(params.path || "");
  const methods = ALLOWED[name];
  if (!methods) return json({ error: "Not found" }, 404);
  if (!methods.includes(request.method)) return json({ error: "Method not allowed" }, 405);

  const init = { method: request.method, headers: { "Content-Type": "application/json" } };
  if (request.method === "POST") {
    const body = await request.text();
    if (body.length > 4000) return json({ error: "Request too large" }, 413);
    init.body = body;
  }

  try {
    const upstream = await fetch(BACKEND + name, init);
    return new Response(upstream.body, {
      status: upstream.status,
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
    });
  } catch (e) {
    return json({ error: "Gastlyo backend not reachable" }, 502);
  }
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}
