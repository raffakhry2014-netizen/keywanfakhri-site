import {PERIODS,forecastsFor} from './outlook-engine.js';
export const MIN_FORECASTERS=3, MAX_FORECASTERS=10;
export function comparisonStatus(count){return count>=MIN_FORECASTERS?'comparable':'insufficient';}
export function forecasterPeriods(outlook,assetId,forecasterId){
 const quarterly=PERIODS.slice(1).some(period=>forecastsFor(outlook,assetId,period).some(r=>r.forecaster_id===forecasterId));
 return quarterly?['2026','annual','Q1','Q2','Q3','Q4']:['2026','annual'];
}
export function annual2026(evidence,assetId,id,provider){
 const valid=r=>r.asset_id===assetId&&r.target_year===2026&&r.currency==='USD'&&Number.isFinite(r.forecast)&&r.forecast>0&&/^https:\/\//.test(r.source_url||'')&&Number.isFinite(+new Date(r.issued_by))&&new Date(r.issued_by)<=new Date(evidence.reviewed_at);
 const direct=(evidence.records||[]).filter(r=>valid(r)&&r.forecaster_id===id&&r.status==='pending');
 const context=(evidence.context_forecasts||[]).filter(r=>valid(r)&&r.provider===provider);
 const records=direct.length?direct:context;
 if(records.length!==1)return [];
 const r=records[0];return [{...r,value:r.forecast,provider:r.provider||r.forecaster,issued_at:r.issued_by,year:2026}];
}
