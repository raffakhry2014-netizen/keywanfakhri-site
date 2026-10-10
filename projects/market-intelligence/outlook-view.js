import {forecasterPeriods,annual2026} from './forecast-layout.js';
import {PERIODS,forecastsFor,scenarioSummary} from './outlook-engine.js';
const n=(tag,text,cls)=>{const el=document.createElement(tag);if(text)el.textContent=text;if(cls)el.className=cls;return el;};
export const formatValue=v=>'$'+new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(v);
function a(text,url){const el=n('a',text);el.href=url;el.target='_blank';el.rel='noopener';return el;}
function table(headers,rows){const w=n('div',null,'table-scroll'),t=n('table'),h=n('thead'),tr=n('tr');for(const s of headers)tr.append(n('th',s));h.append(tr);t.append(h);const body=n('tbody');for(const row of rows){const tr=n('tr');for(const c of row){const td=n('td');td.append(typeof c==='string'?document.createTextNode(c):c);tr.append(td);}body.append(tr);}t.append(body);w.append(t);return w;}
function values(records){const d=n('div');if(!records.length){d.append(n('span','Not available','missing'));return d;}for(const r of records){const line=n('div',null,'source-value');line.append(a(formatValue(r.value),r.source_url),n('small',`${r.provider} · ${r.basis} · USD / ${r.unit}`));d.append(line);}return d;}
export function renderOutlook(data,asset,target,evidence){
 target.append(n('div','Published outlooks','eyebrow'),n('h3','Forecasts by source'));
 const records=PERIODS.flatMap(period=>forecastsFor(data,asset.id,period));
 const groups=new Map();
 for(const r of records)groups.set(r.forecaster_id,r);
 for(const r of evidence.context_forecasts||[])if(r.asset_id===asset.id&&r.target_year===2026&&!Array.from(groups.values()).some(g=>g.provider===r.provider))groups.set('context:'+r.provider,{forecaster_id:'context:'+r.provider,provider:r.provider});
 if(!groups.size)target.append(n('p','No source-linked annual 2026 or 2027 forecast has been imported.','fine'));
 for(const [id,source] of groups){
  target.append(n('h3',source.provider));
  const periods=forecasterPeriods(data,asset.id,id);
  const cells=periods.map(period=>{const rs=period==='2026'?annual2026(evidence,asset.id,id,source.provider):forecastsFor(data,asset.id,period).filter(r=>r.forecaster_id===id);const cell=values(rs);for(const r of rs)cell.append(n('small',`Published: ${r.issued_at}`));return cell;});
  target.append(table(periods.map(period=>period==='2026'?'2026 annual':period==='annual'?'2027 annual':period+' 2027'),[cells]));
 }
 target.append(n('p','Sources with quarterly forecasts show the annual outlook and quarters; annual-only sources show 2026 and 2027. Missing values remain unavailable. Annual averages and year-end targets keep their original definitions. Publication dates identify the imported reports.','fine'));
 if(['gold','silver','platinum'].includes(asset.id))target.append(n('p','World Bank forecasts are separate from the LBMA analysts; no World Bank target is attributed to a ranked analyst.','fine'));
}
export function renderAssetScenarios(data,asset,target){
 target.append(n('div','2027 scenario summary','eyebrow'),n('h3','Bearish · Base · Bullish'));
 target.append(n('p','Only source-published scenarios appear here. Baseline forecasts from different benchmarks remain separate. No probability or invented price range is assigned.','fine'));
 const rows=[];for(const period of (PERIODS.slice(1).some(p=>forecastsFor(data,asset.id,p).length)?PERIODS:['annual'])){const groups=scenarioSummary(data,asset.id,period);if(!groups.length)rows.push([period==='annual'?'2027 annual':period,'Not available','Not available','Not available']);for(const g of groups){const label=n('div',`${period==='annual'?'2027 annual':period} · ${g.benchmark}`);label.append(n('small',`${g.basis} · USD / ${g.unit}`));rows.push([label,values(g.bear),values(g.base),values(g.bull)]);}}
 target.append(table(['Period / price basis','Bearish','Base','Bullish'],rows));
}
export function renderOverview(data,assets,target,period='annual'){
 target.replaceChildren();const rows=[];for(const asset of assets){const gs=scenarioSummary(data,asset.id,period);if(!gs.length){rows.push([asset.name,'—','No verified target','—']);continue;}for(const g of gs){const title=n('div',asset.name);title.append(n('small',`${g.benchmark} · ${g.basis} · USD / ${g.unit}`));rows.push([title,values(g.bear),values(g.base),values(g.bull)]);}}
 target.append(table(['Asset / price basis','Bearish','Base','Bullish'],rows));
}
