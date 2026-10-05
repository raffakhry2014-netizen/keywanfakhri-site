import {PERIODS,forecastsFor,scenarioSummary} from './outlook-engine.js';
const n=(tag,text,cls)=>{const el=document.createElement(tag);if(text)el.textContent=text;if(cls)el.className=cls;return el;};
export const formatValue=v=>'$'+new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(v);
function a(text,url){const el=n('a',text);el.href=url;el.target='_blank';el.rel='noopener';return el;}
function table(headers,rows){const w=n('div',null,'table-scroll'),t=n('table'),h=n('thead'),tr=n('tr');for(const s of headers)tr.append(n('th',s));h.append(tr);t.append(h);const body=n('tbody');for(const row of rows){const tr=n('tr');for(const c of row){const td=n('td');td.append(typeof c==='string'?document.createTextNode(c):c);tr.append(td);}body.append(tr);}t.append(body);w.append(t);return w;}
function values(records){const d=n('div');if(!records.length){d.append(n('span','Not available','missing'));return d;}for(const r of records){const line=n('div',null,'source-value');line.append(a(formatValue(r.value),r.source_url),n('small',`${r.provider} · ${r.basis} · USD / ${r.unit}`));d.append(line);}return d;}
export function renderOutlook(data,asset,target){
 target.append(n('div','2027 outlook','eyebrow'),n('h3','The year. The four quarters.'));
 const rows=PERIODS.map(period=>{const rs=forecastsFor(data,asset.id,period);const sources=n('div');for(const r of rs)sources.append(n('small',`${r.provider}: ${r.issued_at}`));if(!rs.length)sources.append(n('span','No verified 2027 target imported','missing'));return [period==='annual'?'Full year 2027':`${period} 2027`,values(rs),sources];});
 target.append(table(['Horizon','Published baseline / target','Source publication date'],rows));
 target.append(n('p','Annual and quarterly averages describe a whole period. They are not end-of-period prices. Missing horizons remain empty; no interpolation is used. Source dates identify each imported report; these are not claimed to be every provider’s latest revision.','fine'));
 if(['gold','silver','platinum'].includes(asset.id))target.append(n('p','The 2027 World Bank forecast below is separate from the LBMA analysts’ 2026 survey. No 2027 target is attributed to an analyst who has not published one.','fine'));
}
export function renderAssetScenarios(data,asset,target){
 target.append(n('div','2027 scenario summary','eyebrow'),n('h3','Bearish · Base · Bullish'));
 target.append(n('p','Only source-published scenarios appear here. Baseline forecasts from different benchmarks remain separate. No probability or invented price range is assigned.','fine'));
 const rows=[];for(const period of PERIODS){const groups=scenarioSummary(data,asset.id,period);if(!groups.length)rows.push([period==='annual'?'2027 annual':period,'Not available','Not available','Not available']);for(const g of groups){const label=n('div',`${period==='annual'?'2027 annual':period} · ${g.benchmark}`);label.append(n('small',`${g.basis} · USD / ${g.unit}`));rows.push([label,values(g.bear),values(g.base),values(g.bull)]);}}
 target.append(table(['Period / price basis','Bearish','Base','Bullish'],rows));
}
export function renderOverview(data,assets,target,period='annual'){
 target.replaceChildren();const rows=[];for(const asset of assets){const gs=scenarioSummary(data,asset.id,period);if(!gs.length){rows.push([asset.name,'—','No verified target','—']);continue;}for(const g of gs){const title=n('div',asset.name);title.append(n('small',`${g.benchmark} · ${g.basis} · USD / ${g.unit}`));rows.push([title,values(g.bear),values(g.base),values(g.bull)]);}}
 target.append(table(['Asset / price basis','Bearish','Base','Bullish'],rows));
}
