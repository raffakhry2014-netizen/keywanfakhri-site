// This score is a historical error measure, never a probability of being right.
export function rankForecasters(data, assetId, asOf = new Date()) {
 const cutoff = new Date(asOf);
 const years = data.window;
 if (!Number.isFinite(+cutoff) || years.length !== 5 || new Set(years).size !== 5 || years.some(y => y >= cutoff.getUTCFullYear())) throw Error('Five completed years required');
 const weights = years.map(y => data.weights[y]);
 if (weights.some(w => !Number.isFinite(w) || w <= 0) || Math.abs(weights.reduce((a,b)=>a+b,0)-1)>1e-9) throw Error('Invalid weights');
 const link = s => typeof s === 'string' && /^https:\/\//.test(s);
 const benchmark=data.benchmarks?.[assetId];
 const earlyVintage=r=>{const february2021=r.target_year===2021&&benchmark?.panel==='LBMA annual survey';return new Date(r.issued_by)<=new Date(Date.UTC(r.target_year,february2021?1:0,february2021?9:31,23,59,59));};
 const valid = r => !!benchmark && Number.isFinite(r.forecast) && r.forecast > 0 && link(r.source_url) && link(r.date_source) && Number.isFinite(+new Date(r.issued_by)) && new Date(r.issued_by) <= cutoff && ['publication_bound','survey_deadline','publication_date'].includes(r.issued_date_kind) && r.currency === benchmark.currency && r.unit === benchmark.unit && r.basis === benchmark.basis && new Date(r.issued_by).getUTCFullYear() === r.target_year;
 const groups = new Map();
 for (const r of data.records.filter(r => r.asset_id === assetId)) {
  if (!r.forecaster_id) continue;
  if (!groups.has(r.forecaster_id)) groups.set(r.forecaster_id, []);
  groups.get(r.forecaster_id).push(r);
 }
 const ranked=[], excluded=[];
 for (const [id, records] of groups) {
  const history=years.map(y=>records.filter(r=>r.target_year===y));
  const complete=history.every(rs=>rs.length===1 && valid(rs[0]) && earlyVintage(rs[0]) && rs[0].status==='completed' && Number.isFinite(rs[0].actual) && rs[0].actual>0 && link(rs[0].actual_source));
  const current=records.filter(r=>r.target_year===cutoff.getUTCFullYear() && r.status==='pending' && valid(r));
  const latest=current.length===1?current[0]:null;
  if (!complete) { excluded.push({id,forecaster:records.at(-1).forecaster,years:history.filter(rs=>rs.length===1 && valid(rs[0]) && earlyVintage(rs[0]) && rs[0].status==='completed' && rs[0].actual>0 && link(rs[0].actual_source)).length,latest}); continue; }
  const scored=history.map(([r])=>({...r,error:Math.abs(r.forecast-r.actual)/r.actual*100}));
  ranked.push({id,forecaster:scored[4].forecaster,history:scored,latest,error:scored.reduce((s,r)=>s+r.error*data.weights[r.target_year],0)});
 }
 ranked.sort((a,b)=>a.error-b.error || a.id.localeCompare(b.id));
 return {ranked:ranked.slice(0,10),eligible:ranked.length,excluded};
}
