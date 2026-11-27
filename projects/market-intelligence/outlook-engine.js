export const PERIODS=['annual','Q1','Q2','Q3','Q4'];
export function forecastsFor(data,assetId,period='annual'){
 if(!PERIODS.includes(period))return [];
 const asOf=new Date(data.reviewed_at);
 const bases=period==='annual'?['annual average','year-end target','by year-end target']:['quarterly average','quarter-end target'];
 const valid=data.records.filter(r=>r.asset_id===assetId&&r.year===2027&&r.period===period&&r.kind==='published_forecast'&&Number.isFinite(r.value)&&r.value>0&&r.currency==='USD'&&r.unit&&r.benchmark&&bases.includes(r.basis)&&['base','bear','bull'].includes(r.scenario)&&/^https:\/\//.test(r.source_url)&&Number.isFinite(+new Date(r.issued_at))&&new Date(r.issued_at)<=asOf);
 // Ambiguous duplicate observations never become a consensus.
 return valid.filter(r=>valid.filter(x=>x.provider===r.provider&&x.benchmark===r.benchmark&&x.basis===r.basis&&x.scenario===r.scenario).length===1);
}
export function scenarioSummary(data,assetId,period='annual'){
 const rows=forecastsFor(data,assetId,period),groups=new Map();
 for(const r of rows){const key=[r.benchmark,r.currency,r.unit,r.basis].join('|');if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r);}
 return [...groups.values()].map(records=>({benchmark:records[0].benchmark,unit:records[0].unit,basis:records[0].basis,bear:records.filter(r=>r.scenario==='bear'),base:records.filter(r=>r.scenario==='base'),bull:records.filter(r=>r.scenario==='bull')}));
}
