import {rankForecasters} from './research-engine.js';
import {PERIODS,forecastsFor} from './outlook-engine.js';
export function renderCoverage(evidence,outlook,asset,target){
 target.replaceChildren();
 const result=rankForecasters(evidence,asset.id,new Date(evidence.reviewed_at));
 const box=document.createElement('section');box.className='coverage-box';
 const title=document.createElement('h3');title.textContent='Research completeness';box.append(title);
 const grid=document.createElement('div');grid.className='coverage-grid';
 const quarters=PERIODS.slice(1).filter(p=>forecastsFor(outlook,asset.id,p).length).length;
 grid.textContent=`Comparable analysts: ${result.ranked.length>1?result.ranked.length:0}/10 · Evaluated institutions: ${result.ranked.length===1?1:0} · 2027 quarters: ${quarters}/4`;box.append(grid);
 const note=document.createElement('p');note.textContent=result.ranked.length>1?'Rankings compare only the imported five-year panel, not every analyst worldwide.':'Ten comparable five-year analyst records have not been established for this asset. An institution or news publisher is not ten independent analysts.';box.append(note);
 const linked=document.createElement('section');linked.className='forecaster-outlook';const h=document.createElement('h3');h.textContent='2027 outlook of evaluated forecasters';linked.append(h);
 if(!result.ranked.length){const p=document.createElement('p');p.className='fine';p.textContent='No validated historical ranking exists to link to a 2027 forecast. Separately published forecasts appear below without an accuracy rank.';linked.append(p);}
 else{const wrap=document.createElement('div');wrap.className='table-scroll';const table=document.createElement('table');const head=document.createElement('thead');const hr=document.createElement('tr');for(const label of ['Forecaster','2021–2025 error','2027 annual','Q1','Q2','Q3','Q4']){const th=document.createElement('th');th.textContent=label;hr.append(th);}head.append(hr);table.append(head);const body=document.createElement('tbody');for(const r of result.ranked){const tr=document.createElement('tr');for(const text of [r.forecaster,`${r.error.toFixed(2)}% · 5 observations`]){const td=document.createElement('td');td.textContent=text;tr.append(td);}for(const period of PERIODS){const td=document.createElement('td');const records=forecastsFor(outlook,asset.id,period).filter(x=>x.forecaster_id===r.id);if(!records.length)td.textContent='Not published / imported';for(const record of records){const a=document.createElement('a');a.textContent=`$${new Intl.NumberFormat('en-US').format(record.value)} · ${record.basis}`;a.href=record.source_url;a.target='_blank';a.rel='noopener';td.append(a);const small=document.createElement('small');small.textContent=record.issued_at;td.append(small);}tr.append(td);}body.append(tr);}table.append(body);wrap.append(table);linked.append(wrap);}
 target.append(box,linked);
}
