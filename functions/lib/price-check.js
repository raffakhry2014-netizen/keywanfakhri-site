const positive = v => v !== null && v !== undefined && String(v).trim() !== '' && Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : null;
const setting = (v, fallback) => positive(v) ?? fallback;

// Never return upstream error text: it can contain request URLs or API keys.
async function avFetch(params, key) {
  const url = new URL('https://www.alphavantage.co/query');
  Object.entries({...params, apikey:key}).forEach(([k,v]) => url.searchParams.set(k,v));
  let response;
  try { response = await fetch(url, {signal:AbortSignal.timeout(12000)}); }
  catch { throw new Error('Alpha Vantage request failed or timed out.'); }
  let data;
  try { data = await response.json(); } catch { throw new Error('Alpha Vantage returned invalid JSON.'); }
  if (data.Note || data.Information) throw new Error('Alpha Vantage quota or subscription restriction.');
  if (!response.ok || data['Error Message']) throw new Error('Alpha Vantage quote unavailable.');
  return data;
}

export async function alphaQuote(market, env) {
  const base = {provider:'Alpha Vantage', status:'unavailable', price:null, currency:null, timestamp:null, retrieved_at:new Date().toISOString()};
  if (!env.ALPHA_VANTAGE_API_KEY) return {...base, message:'ALPHA_VANTAGE_API_KEY is not configured.'};
  try {
    let q;
    if (market.key === 'gold') {
      const d = await avFetch({function:'GOLD_SILVER_SPOT',symbol:'GOLD'}, env.ALPHA_VANTAGE_API_KEY);
      q = {price:positive(d.price),currency:'USD',timestamp:d.timestamp || null, timezone:'UTC',symbol:'XAU/USD',unit:'troy oz',basis:'spot',instrument:'gold-spot'};
    } else if (market.key === 'copper') {
      const d = await avFetch({function:'COPPER',interval:'monthly'},env.ALPHA_VANTAGE_API_KEY);
      const row = (d.data || []).find(x => positive(x.value));
      q = {price:positive(row?.value),currency:'USD',timestamp:row?.date || null,symbol:'COPPER',unit:d.unit || 'USD per metric ton',basis:'monthly benchmark',instrument:'copper-benchmark'};
    } else if (String(market.asset_type).toLowerCase().includes('crypto')) {
      const pair = market.symbol.split('/');
      if (pair.length !== 2) throw new Error('No matching Alpha Vantage crypto pair.');
      const d = await avFetch({function:'CURRENCY_EXCHANGE_RATE',from_currency:pair[0],to_currency:pair[1]},env.ALPHA_VANTAGE_API_KEY);
      const r = d['Realtime Currency Exchange Rate'] || {};
      if (r['1. From_Currency Code'] !== pair[0] || r['3. To_Currency Code'] !== pair[1]) throw new Error('Crypto pair mismatch.');
      q = {price:positive(r['5. Exchange Rate']),currency:pair[1],timestamp:r['6. Last Refreshed'] || null,timezone:r['7. Time Zone'],symbol:market.symbol,unit:pair[0],basis:'spot',instrument:market.instrument};
    } else {
      // Plain tickers are safe only for the same US USD listing. Do not
      // silently compare an Amsterdam share with the US ASML ADR.
      if (market.source_currency !== 'USD' || !['NASDAQ','NYSE','NYSE ARCA','AMEX','BATS'].includes(String(market.exchange).toUpperCase())) throw new Error('Matching listing is not supported by the secondary connector.');
      const d = await avFetch({function:'GLOBAL_QUOTE',symbol:market.symbol},env.ALPHA_VANTAGE_API_KEY);
      const r = d['Global Quote'] || {};
      if (r['01. symbol'] !== market.symbol) throw new Error('Stock symbol mismatch.');
      q = {price:positive(r['05. price']),currency:'USD',timestamp:r['07. latest trading day'] || null,symbol:market.symbol,unit:'share',basis:'daily close',instrument:market.instrument};
    }
    if (!q.price) throw new Error('Alpha Vantage returned no valid positive price.');
    return {...base,...q,status:'ok'};
  } catch (e) { return {...base,message:e.message}; }
}

const epoch = q => {
  if (!q.timestamp) return NaN;
  // Preserve date-only precision; never manufacture a source timestamp.
  if (/^\d{4}-\d{2}-\d{2}$/.test(q.timestamp)) return Date.parse(q.timestamp+'T00:00:00Z');
  if (/Z$|[+-]\d\d:\d\d$/.test(q.timestamp)) return Date.parse(q.timestamp);
  if (q.timezone === 'UTC') return Date.parse(q.timestamp.replace(' ','T')+'Z');
  return NaN;
};

export function compareQuotes(a,b,env = {},now = Date.now()) {
  const commodity = /commodity/i.test(a.asset_type || '');
  const threshold = setting(commodity ? env.PRICE_CHECK_COMMODITY_THRESHOLD_PCT : env.PRICE_CHECK_THRESHOLD_PCT,commodity ? 1.5 : 1);
  const reasons = [];
  const ta = epoch(a), tb = epoch(b);
  const daily = a.basis === 'daily close' && b.basis === 'daily close';
  const ageLimit = daily ? setting(env.PRICE_CHECK_CLOSE_MAX_AGE_HOURS,96)*3600000 : setting(env.PRICE_CHECK_MAX_AGE_MINUTES,30)*60000;
  const skewLimit = setting(env.PRICE_CHECK_MAX_SKEW_MINUTES,15)*60000;
  const identity = a.instrument && a.instrument === b.instrument && a.unit === b.unit && a.basis === b.basis;
  if (a.status !== 'ok' || !positive(a.price)) reasons.push('primary_unavailable');
  if (b.status !== 'ok' || !positive(b.price)) reasons.push('secondary_unavailable');
  if (!identity) reasons.push('incompatible_instrument_or_basis');
  if (a.currency !== b.currency) reasons.push('currency_mismatch');
  if (!Number.isFinite(ta) || !Number.isFinite(tb)) reasons.push('timestamp_unavailable');
  else {
    if (now-ta > ageLimit || now-tb > ageLimit || ta-now > 60000 || tb-now > 60000) reasons.push('stale_or_future_quote');
    if (daily ? a.timestamp.slice(0,10) !== b.timestamp.slice(0,10) : Math.abs(ta-tb)>skewLimit) reasons.push('timestamp_mismatch');
  }
  const comparable = identity && a.currency === b.currency && positive(a.price) && positive(b.price);
  const difference = comparable ? Math.abs(a.price-b.price)/a.price*100 : null;
  if (difference !== null && difference > threshold+1e-10) reasons.push('price_difference_exceeds_threshold');
  return {status:reasons.length ? 'warning':'verified',data_warning:reasons.length>0,difference_pct:difference,threshold_pct:threshold,reasons,provider_a:a,provider_b:b};
}
