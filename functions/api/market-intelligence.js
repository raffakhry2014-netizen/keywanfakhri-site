// KeyOne Market Intelligence — Cloudflare Pages Function
// POST /api/market-intelligence  { asset: "Gold", forceResearch?: false }
// Required secrets for full live mode:
//   TWELVE_DATA_API_KEY
//   OPENAI_API_KEY
// Optional:
//   OPENAI_MODEL (defaults to gpt-5.5)
//
// Design principle:
// AI researches and extracts timestamped evidence; all scoring, weighting,
// EUR conversion, ranking and consensus calculations are deterministic here.

import { alphaQuote, compareQuotes } from '../lib/price-check.js';

const YEAR_WEIGHTS = [0.35, 0.25, 0.18, 0.13, 0.09];
const CACHE_HOURS = 24;
const MAX_ASSET_LEN = 80;

const RESEARCH_SCHEMA = {
  type: "object",
  properties: {
    asset_name: { type: "string" },
    asset_type: { type: "string" },
    analysts: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          institution: { type: "string" },
          current_forecast_date: { type: "string" },
          forecast_currency: { type: "string" },
          forecast_3m: { anyOf: [{ type: "number" }, { type: "null" }] },
          forecast_next_year: { anyOf: [{ type: "number" }, { type: "null" }] },
          primary_source_url: { type: "string" },
          secondary_source_url: { type: "string" },
          history: {
            type: "array",
            items: {
              type: "object",
              properties: {
                year: { type: "integer" },
                forecast_value: { type: "number" },
                realized_value: { type: "number" },
                reference_value: { type: "number" },
                currency: { type: "string" },
                source_url: { type: "string" }
              },
              required: ["year", "forecast_value", "realized_value", "reference_value", "currency", "source_url"],
              additionalProperties: false
            }
          }
        },
        required: [
          "name", "institution", "current_forecast_date", "forecast_currency",
          "forecast_3m", "forecast_next_year", "primary_source_url",
          "secondary_source_url", "history"
        ],
        additionalProperties: false
      }
    }
  },
  required: ["asset_name", "asset_type", "analysts"],
  additionalProperties: false
};

const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": "*"
  }
});

const cleanAsset = (v) =>
  String(v || "").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, MAX_ASSET_LEN);

const num = (v) => {
  if (v === null || v === undefined || String(v).trim() === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const mean = (a) => a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0;

const stdev = (a) => {
  if (!a.length) return 0;
  const m = mean(a);
  return Math.sqrt(mean(a.map(x => (x - m) ** 2)));
};

const normalizeCurrency = (c) => String(c || "USD").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3) || "USD";

const knownAsset = (q) => {
  const s = q.toLowerCase();
  if (["gold", "xau", "xauusd", "طلا", "gold spot"].includes(s)) {
    return { key: "gold", name: "Gold", type: "Commodity", symbol: "XAU/USD", unit: "EUR / troy oz", currency: "USD" };
  }
  if (["bitcoin", "btc", "btceur", "بیت کوین", "بیت‌کوین"].includes(s)) {
    return { key: "bitcoin", name: "Bitcoin", type: "Crypto", symbol: "BTC/EUR", unit: "EUR / BTC", currency: "EUR" };
  }
  if (["copper", "hg1", "مس", "copper spot"].includes(s)) {
    return { key: "copper", name: "Copper", type: "Commodity", symbol: "HG1", unit: "EUR / lb", currency: "USD" };
  }
  if (s === 'asml') return { key:'asml-nasdaq',name:'ASML (US ADR)',type:'Stock',symbol:'ASML',exchange:'NASDAQ',currency:'USD',unit:'EUR / share' };
  return null;
};

async function tdFetch(path, params, apiKey) {
  const u = new URL("https://api.twelvedata.com/" + path);
  for (const [k, v] of Object.entries(params || {})) if (v !== undefined && v !== null && v !== "") u.searchParams.set(k, String(v));
  u.searchParams.set("apikey", apiKey);
  let r;
  try { r = await fetch(u.toString(), { headers: { accept: "application/json" }, signal:AbortSignal.timeout(12000) }); }
  catch { throw new Error('Twelve Data request failed or timed out.'); }
  let d;
  try { d = await r.json(); } catch { throw new Error("Market-data provider returned invalid JSON"); }
  if (!r.ok || d.status === "error" || d.code) throw new Error('Twelve Data quote unavailable or quota/subscription restricted.');
  return d;
}

async function convertToEUR(amount, currency, apiKey, fxCache) {
  const value = num(amount);
  if (value === null) return null;
  const c = normalizeCurrency(currency);
  if (c === "EUR") return value;
  if (!fxCache[c]) {
    const d = await tdFetch("currency_conversion", { symbol: c + "/EUR", amount: 1 }, apiKey);
    fxCache[c] = num(d.rate) || num(d.amount);
    if (!fxCache[c]) throw new Error("No EUR conversion rate for " + c);
  }
  return value * fxCache[c];
}

async function resolveMarket(asset, apiKey) {
  if (!apiKey) return { ...knownAsset(asset), asset_type:knownAsset(asset)?.type, provider:'Twelve Data', status: "configuration_required", message: "TWELVE_DATA_API_KEY is not configured." };

  const fixed = knownAsset(asset);
  let resolved = fixed;

  if (!resolved) {
    const search = await tdFetch("symbol_search", { symbol: asset, outputsize: 12 }, apiKey);
    const rows = Array.isArray(search.data) ? search.data : [];
    if (!rows.length) throw new Error("No matching market symbol found.");

    const exact = rows.filter(x =>
      String(x.symbol || "").toLowerCase() === asset.toLowerCase() ||
      String(x.instrument_name || "").toLowerCase() === asset.toLowerCase()
    );
    const pool = exact.length ? exact : rows;

    // Prefer a EUR listing when relevance is otherwise comparable.
    const hit = pool.find(x => String(x.currency || "").toUpperCase() === "EUR") || pool[0];
    resolved = {
      key: (hit.symbol + "-" + (hit.exchange || "")).toLowerCase(),
      name: hit.instrument_name || hit.symbol,
      type: hit.instrument_type || "Market instrument",
      symbol: hit.symbol,
      exchange: hit.exchange || "",
      unit: (hit.currency || "") + " / unit",
      currency: hit.currency || "USD"
    };
  }

  const quote = await tdFetch("quote", {
    symbol: resolved.symbol,
    exchange: resolved.exchange || undefined
  }, apiKey);

  const price = num(quote.close) ?? num(quote.price);
  if (price === null || price <= 0) throw new Error("No valid current price returned for " + resolved.symbol);

  const currency = quote.currency || resolved.currency || (resolved.symbol.includes("/EUR") ? "EUR" : "USD");
  const fxCache = {};
  const priceEUR = await convertToEUR(price, currency, apiKey, fxCache);

  return {
    status: "ok",
    key: resolved.key,
    name: quote.name || resolved.name,
    symbol: quote.symbol || resolved.symbol,
    exchange: quote.exchange || resolved.exchange || "Commodity / aggregate",
    asset_type: resolved.type,
    source_currency: normalizeCurrency(currency),
    source_price: price,
    price_eur: priceEUR,
    unit: resolved.unit.replace(/^[A-Z]{3}/,'EUR'),
    quote_unit: resolved.key === 'gold' ? 'troy oz' : /crypto/i.test(resolved.type) ? resolved.symbol.split('/')[0] : resolved.key === 'copper' ? 'lb' : 'share',
    instrument: resolved.key === 'gold' ? 'gold-spot' : resolved.key === 'copper' ? 'copper-futures-HG1' : resolved.symbol+'@'+(quote.exchange || resolved.exchange || 'aggregate'),
    basis: /stock|etf|equity/i.test(resolved.type) && quote.is_market_open === false ? 'daily close' : 'spot',
    timezone: quote.exchange_timezone || null,
    timestamp: quote.timestamp ? new Date(Number(quote.timestamp) * 1000).toISOString() : (quote.datetime || null),
    retrieved_at: new Date().toISOString(),
    provider: "Twelve Data"
  };
}

function collectWebSources(openaiResponse) {
  const out = new Map();

  const add = (x) => {
    if (!x) return;
    const url = typeof x === "string" ? x : x.url;
    if (!url || !/^https?:\/\//i.test(url)) return;
    const title = typeof x === "string" ? "" : (x.title || x.name || "");
    try {
      const u = new URL(url);
      out.set(u.href.replace(/\/$/, ""), { url: u.href, title: title || u.hostname.replace(/^www\./, "") });
    } catch {}
  };

  for (const item of openaiResponse.output || []) {
    if (item.type === "web_search_call" && item.action && Array.isArray(item.action.sources)) {
      item.action.sources.forEach(add);
    }
    if (item.type === "message") {
      for (const c of item.content || []) {
        for (const a of c.annotations || []) {
          if (a.type === "url_citation") add(a);
        }
      }
    }
  }
  return [...out.values()];
}

function extractOutputText(openaiResponse) {
  if (typeof openaiResponse.output_text === "string") return openaiResponse.output_text;
  for (const item of openaiResponse.output || []) {
    if (item.type !== "message") continue;
    for (const c of item.content || []) {
      if (c.type === "output_text" && typeof c.text === "string") return c.text;
    }
  }
  return "";
}

async function researchAsset(asset, env) {
  if (!env.OPENAI_API_KEY) {
    return { status: "configuration_required", message: "OPENAI_API_KEY is not configured." };
  }

  const model = env.OPENAI_MODEL || "gpt-5.6-sol";
  const prompt = `
Research the asset "${asset}" as a financial forecast-audit task.

Goal:
Find up to 15 senior analysts or established institutions with the strongest VERIFIABLE historical forecasting record for this specific asset. We will later keep the best 10 candidates that have at least five usable annual observations.

Hard evidence rules:
- Search the live web.
- A usable historical observation must have a forecast that was publicly timestamped before the relevant outcome, a numeric forecast_value, the realized_value for the same forecast definition/period, and a reference_value from the time the forecast was made (or the nearest defensible starting reference).
- Do NOT calculate percentage errors or accuracy scores. The server will calculate them.
- Do NOT invent missing data. Omit unusable historical observations.
- Prefer primary sources: analyst/institution research pages, exchange/benchmark organizations, LBMA, CME, company investor relations, central banks, official commodity organizations. Use Reuters, FT, WSJ, Bloomberg and other high-quality financial reporting as independent verification.
- Current forecasts must be currently valid as of today. Give 3-month and next-calendar-year targets only when a numeric target can be verified; otherwise use null.
- Keep forecast numbers in the currency used by the source. Put that ISO currency in forecast_currency.
- source_url fields must be exact URLs you actually opened or found with web search.
- For each analyst, try to provide at least five annual historical observations from the last five or more years. More than five is welcome if genuinely verified.
- If an analyst does not have enough evidence, still return the candidate only if useful; the server will exclude candidates with fewer than five valid years.
- Do not use anonymous social-media predictions.

Definitions:
- forecast_value: the analyst's published numeric target/annual average/period forecast.
- realized_value: actual market value using the same definition/period as forecast_value.
- reference_value: market value at the time/base period against which direction can be tested.
- current_forecast_date: ISO date YYYY-MM-DD when possible.
`;

  const body = {
    model,
    reasoning: { effort: "medium" },
    tools: [{ type: "web_search", search_context_size: "high", external_web_access: true }],
    tool_choice: "required",
    include: ["web_search_call.action.sources"],
    input: [
      { role: "system", content: "You are a financial research auditor. Evidence quality is more important than filling fields. Never fabricate forecasts, dates, prices or URLs." },
      { role: "user", content: prompt }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "market_intelligence_research",
        strict: true,
        schema: RESEARCH_SCHEMA
      }
    }
  };

  const r = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "authorization": "Bearer " + env.OPENAI_API_KEY,
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  });

  let response;
  try { response = await r.json(); } catch { throw new Error("OpenAI returned invalid JSON"); }
  if (!r.ok) throw new Error(response.error?.message || "OpenAI research request failed");

  const outputText = extractOutputText(response);
  if (!outputText) throw new Error("OpenAI research returned no structured output");

  let research;
  try { research = JSON.parse(outputText); } catch { throw new Error("Structured research output could not be parsed"); }

  return {
    status: "ok",
    model,
    generated_at: new Date().toISOString(),
    research,
    sources: collectWebSources(response)
  };
}

const sourceKey = (url) => {
  try { return new URL(url).href.replace(/\/$/, ""); } catch { return ""; }
};

function verifyResearchSources(researchPack) {
  if (researchPack.status !== "ok") return researchPack;
  const known = new Set((researchPack.sources || []).map(s => sourceKey(s.url)).filter(Boolean));

  const validUrl = (u) => known.has(sourceKey(u));
  const copy = structuredClone(researchPack);

  for (const a of copy.research.analysts || []) {
    a.primary_source_verified = validUrl(a.primary_source_url);
    a.secondary_source_verified = validUrl(a.secondary_source_url);
    for (const h of a.history || []) h.source_verified = validUrl(h.source_url);
  }
  return copy;
}

function weightedPercentile(items, p) {
  const rows = items.filter(x => Number.isFinite(x.value) && x.weight > 0).sort((a, b) => a.value - b.value);
  const total = rows.reduce((s, x) => s + x.weight, 0);
  if (!total) return null;
  let c = 0;
  for (const row of rows) {
    c += row.weight;
    if (c / total >= p) return row.value;
  }
  return rows[rows.length - 1]?.value ?? null;
}

async function scoreResearch(researchPack, market, env) {
  if (researchPack.status !== "ok") return { status: researchPack.status, message: researchPack.message || "Research unavailable" };
  if (!env.TWELVE_DATA_API_KEY) return { status: "configuration_required", message: "TWELVE_DATA_API_KEY is required for EUR target conversion." };

  const fxCache = {};
  const candidates = [];

  for (const raw of researchPack.research.analysts || []) {
    const history = (raw.history || [])
      .filter(h => h.source_verified && num(h.forecast_value) !== null && num(h.realized_value) !== null && num(h.reference_value) !== null && num(h.realized_value) !== 0)
      .sort((a, b) => b.year - a.year);

    // Requirement: at least five verified historical annual observations.
    if (history.length < 5) continue;

    const latest5 = history.slice(0, 5);
    const errors = latest5.map(h => Math.abs((Number(h.forecast_value) - Number(h.realized_value)) / Number(h.realized_value)) * 100);
    const weightedMape = errors.reduce((s, e, i) => s + e * YEAR_WEIGHTS[i], 0);

    const directionHits = latest5.map(h => {
      const f = Math.sign(Number(h.forecast_value) - Number(h.reference_value));
      const a = Math.sign(Number(h.realized_value) - Number(h.reference_value));
      return f === a ? 1 : 0;
    });
    const directionAccuracy = mean(directionHits) * 100;
    const consistency = Math.max(0, 100 - stdev(errors) * 6);
    const coverage = Math.min(100, (history.length / 5) * 100);

    const verifiedHistorical = history.filter(h => h.source_verified).length;
    const currentChecks = Number(Boolean(raw.primary_source_verified)) + Number(Boolean(raw.secondary_source_verified));
    const evidenceRatio = Math.min(1, (verifiedHistorical + currentChecks) / (history.length + 2));
    const sourceQuality = evidenceRatio * 100;

    const accuracyScore =
      0.55 * Math.max(0, 100 - weightedMape) +
      0.20 * directionAccuracy +
      0.10 * consistency +
      0.05 * coverage +
      0.10 * sourceQuality;

    const fc = normalizeCurrency(raw.forecast_currency);
    let forecast3mEUR = null;
    let forecastNextYearEUR = null;
    try {
      forecast3mEUR = raw.forecast_3m === null ? null : await convertToEUR(raw.forecast_3m, fc, env.TWELVE_DATA_API_KEY, fxCache);
      forecastNextYearEUR = raw.forecast_next_year === null ? null : await convertToEUR(raw.forecast_next_year, fc, env.TWELVE_DATA_API_KEY, fxCache);
    } catch {}

    candidates.push({
      name: raw.name,
      institution: raw.institution,
      years_reviewed: history.length,
      weighted_avg_error: weightedMape,
      direction_accuracy: directionAccuracy,
      consistency,
      source_quality: sourceQuality,
      accuracy_score: accuracyScore,
      current_forecast_date: raw.current_forecast_date,
      forecast_currency: fc,
      forecast_3m_original: raw.forecast_3m,
      forecast_next_year_original: raw.forecast_next_year,
      forecast_3m_eur: forecast3mEUR,
      forecast_next_year_eur: forecastNextYearEUR,
      primary_source_url: raw.primary_source_verified ? raw.primary_source_url : null,
      secondary_source_url: raw.secondary_source_verified ? raw.secondary_source_url : null,
      history: history.map(h => ({
        year: h.year,
        forecast_value: h.forecast_value,
        realized_value: h.realized_value,
        reference_value: h.reference_value,
        currency: h.currency,
        error_pct: Math.abs((Number(h.forecast_value) - Number(h.realized_value)) / Number(h.realized_value)) * 100,
        direction_correct:
          Math.sign(Number(h.forecast_value) - Number(h.reference_value)) ===
          Math.sign(Number(h.realized_value) - Number(h.reference_value)),
        source_url: h.source_url
      }))
    });
  }

  const ranked = candidates.sort((a, b) => b.accuracy_score - a.accuracy_score).slice(0, 10);
  const weightSum3m = ranked.filter(a => Number.isFinite(a.forecast_3m_eur)).reduce((s, a) => s + a.accuracy_score, 0);
  const weightSum1y = ranked.filter(a => Number.isFinite(a.forecast_next_year_eur)).reduce((s, a) => s + a.accuracy_score, 0);

  const consensus3m = weightSum3m
    ? ranked.reduce((s, a) => s + (Number.isFinite(a.forecast_3m_eur) ? a.forecast_3m_eur * a.accuracy_score : 0), 0) / weightSum3m
    : null;

  const consensus1y = weightSum1y
    ? ranked.reduce((s, a) => s + (Number.isFinite(a.forecast_next_year_eur) ? a.forecast_next_year_eur * a.accuracy_score : 0), 0) / weightSum1y
    : null;

  const dist = ranked
    .filter(a => Number.isFinite(a.forecast_next_year_eur))
    .map(a => ({ value: a.forecast_next_year_eur, weight: a.accuracy_score }));

  const bearish = weightedPercentile(dist, 0.10);
  const bullish = weightedPercentile(dist, 0.90);

  return {
    status: ranked.length ? "ok" : "insufficient_verified_history",
    methodology: {
      minimum_years: 5,
      year_weights: YEAR_WEIGHTS,
      formula: "55% × (100 − Weighted MAPE) + 20% × Direction Accuracy + 10% × Consistency + 5% × Coverage + 10% × Source Quality",
      source_rule: "Only historical observations whose URL appeared in the model's actual web-search source set are eligible for scoring."
    },
    analysts: ranked,
    consensus: {
      forecast_3m_eur: consensus3m,
      forecast_next_year_eur: consensus1y,
      upside_3m_pct: consensus3m && market?.price_eur ? (consensus3m / market.price_eur - 1) * 100 : null,
      upside_next_year_pct: consensus1y && market?.price_eur ? (consensus1y / market.price_eur - 1) * 100 : null
    },
    scenarios: {
      bearish_eur: bearish,
      base_eur: consensus1y,
      bullish_eur: bullish,
      major_shock_range_eur: bearish && bullish ? [bearish * 0.80, bullish * 1.20] : null
    }
  };
}

async function ensureCacheTable(db) {
  if (!db) return;
  await db.exec(`CREATE TABLE IF NOT EXISTS market_intelligence_cache (
    asset_key TEXT PRIMARY KEY,
    asset_name TEXT NOT NULL,
    generated_at TEXT NOT NULL,
    payload TEXT NOT NULL
  )`);
}

async function getCachedResearch(db, key) {
  if (!db) return null;
  try {
    await ensureCacheTable(db);
    const row = await db.prepare("SELECT generated_at,payload FROM market_intelligence_cache WHERE asset_key=?").bind(key).first();
    if (!row) return null;
    const age = Date.now() - Date.parse(row.generated_at);
    if (!Number.isFinite(age) || age > CACHE_HOURS * 3600 * 1000) return null;
    return JSON.parse(row.payload);
  } catch { return null; }
}

async function setCachedResearch(db, key, assetName, pack) {
  if (!db || pack.status !== "ok") return;
  try {
    await ensureCacheTable(db);
    await db.prepare(`INSERT INTO market_intelligence_cache(asset_key,asset_name,generated_at,payload)
      VALUES(?,?,?,?)
      ON CONFLICT(asset_key) DO UPDATE SET asset_name=excluded.asset_name,generated_at=excluded.generated_at,payload=excluded.payload`)
      .bind(key, assetName, pack.generated_at, JSON.stringify(pack)).run();
  } catch {}
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST,OPTIONS",
      "access-control-allow-headers": "content-type"
    }
  });
}

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return json({ error: "Invalid JSON body" }, 400); }

  const asset = cleanAsset(body.asset);
  if (!asset) return json({ error: "Asset is required" }, 400);

  const started = Date.now();

  try {
    let market;
    try { market = await resolveMarket(asset, env.TWELVE_DATA_API_KEY); }
    catch (e) { market = {status:'unavailable',message:e.message,...knownAsset(asset),provider:'Twelve Data',timestamp:null}; }
    const providerA = {provider:'Twelve Data',symbol:market.symbol,status:market.status,price:market.source_price ?? null,currency:market.source_currency ?? null,timestamp:market.timestamp ?? null,timezone:market.timezone,unit:market.quote_unit,instrument:market.instrument,basis:market.basis,asset_type:market.asset_type || market.type,retrieved_at:market.retrieved_at,message:market.message};
    const providerB = await alphaQuote(market,env);
    market.price_check = compareQuotes(providerA,providerB,env);
    market.data_warning = market.price_check.data_warning;
    // Quote-only mode lets preview validation avoid expensive AI research.
    if (body.quoteOnly === true) return json({asset,market,generated_at:new Date().toISOString(),configuration:{market_data_connected:Boolean(env.TWELVE_DATA_API_KEY),secondary_price_connected:Boolean(env.ALPHA_VANTAGE_API_KEY)}});

    const cacheKey = market.status === "ok" ? market.key : asset.toLowerCase();
    let research = body.forceResearch ? null : await getCachedResearch(env.DB, cacheKey);
    let researchCache = research ? "hit" : "miss";

    if (!research) {
      try { research = await researchAsset(asset, env); }
      catch { research = {status:'unavailable',message:'AI research request failed. Market quotes remain available.'}; }
      research = verifyResearchSources(research);
      await setCachedResearch(env.DB, cacheKey, market.name || asset, research);
    }

    const analysis = market.status === "ok"
      ? await scoreResearch(research, market, env)
      : { status: "market_data_unavailable", message: market.message || "Market data unavailable" };

    return json({
      asset,
      generated_at: new Date().toISOString(),
      elapsed_ms: Date.now() - started,
      research_cache: researchCache,
      market,
      analysis,
      sources: research.sources || [],
      configuration: {
        market_data_connected: Boolean(env.TWELVE_DATA_API_KEY),
        secondary_price_connected: Boolean(env.ALPHA_VANTAGE_API_KEY),
        ai_research_connected: Boolean(env.OPENAI_API_KEY),
        database_connected: Boolean(env.DB)
      }
    });
  } catch (e) {
    return json({
      error: "Unexpected market intelligence error",
      asset,
      elapsed_ms: Date.now() - started
    }, 500);
  }
}

export const onRequest = () => json({ error: "Method not allowed" }, 405);
