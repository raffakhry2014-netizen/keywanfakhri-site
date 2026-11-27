import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {rankForecasters} from '../projects/market-intelligence/research-engine.js';
const data=JSON.parse(readFileSync(new URL('../projects/market-intelligence/evidence.json',import.meta.url),'utf8'));
const now=new Date('2026-10-05T15:00:00Z');
const clone=()=>structuredClone(data);
test('EIA is evaluated as one institution, with fixed January vintages and independent annual actuals',()=>{
 for(const id of ['brent','wti','gas']){const r=rankForecasters(data,id,now);assert.equal(r.eligible,1);assert.equal(r.ranked[0].id,'eia');assert.ok(r.ranked[0].history.every(x=>x.source_url.includes('/archives/jan')));assert.ok(r.ranked[0].history.every(x=>x.actual_source.includes('/dnav/')));assert.equal(r.ranked[0].latest.issued_by,'2026-09-09');}
 const wti=rankForecasters(data,'wti',now).ranked[0];assert.equal(wti.history[0].actual,68.13);assert.equal(wti.history[0].forecast,49.70);
});
test('imported primary-source panel has 10 gold, 9 silver and 8 platinum eligible analysts',()=>{
 for(const [id,count] of [['gold',10],['silver',9],['platinum',8]]){
  const r=rankForecasters(data,id,now);assert.equal(r.eligible,count);assert.equal(r.ranked.length,count);
  for(const person of r.ranked){assert.equal(person.history.length,5);if(person.latest){assert.equal(person.latest.target_year,2026);assert.ok(person.latest.source_url.startsWith('https://www.lbma.org.uk/'));}}
 }
});
test('Ross Norman gold error matches independently fixed published outcomes',()=>{
 const r=rankForecasters(data,'gold',now).ranked[0];assert.equal(r.forecaster,'Ross Norman');assert.ok(Math.abs(r.error-9.430045307469149)<1e-9);
});
test('missing year, duplicate forecast and incompatible price basis cannot receive a rank',()=>{
 for(const change of [d=>d.records.splice(d.records.findIndex(r=>r.forecaster_id==='rossnorman'&&r.asset_id==='gold'&&r.target_year===2021),1),d=>d.records.push({...d.records.find(r=>r.forecaster_id==='rossnorman'&&r.asset_id==='gold'&&r.target_year===2021)}),d=>{d.records.find(r=>r.forecaster_id==='rossnorman'&&r.asset_id==='gold'&&r.target_year===2021).basis='year end';}]){
  const d=clone();change(d);assert.ok(!rankForecasters(d,'gold',now).ranked.some(r=>r.id==='rossnorman'));
 }
});
test('invalid actual, missing evidence, future date and wrong currency reject the affected analyst',()=>{
 for(const [field,value] of [['actual',0],['actual',null],['actual_source',null],['source_url',null],['date_source',null],['issued_by','2027-01-01'],['issued_by','2021-12-30'],['currency','EUR'],['unit','kilogram']]){
  const d=clone();d.records.find(r=>r.forecaster_id==='rossnorman'&&r.asset_id==='gold'&&r.target_year===2021)[field]=value;assert.ok(!rankForecasters(d,'gold',now).ranked.some(r=>r.id==='rossnorman'));
 }
});
test('2026 pending values cannot change historical rankings',()=>{
 const d=clone();d.records.filter(r=>r.target_year===2026).forEach(r=>{r.forecast*=10;r.actual=1;});
 assert.deepEqual(rankForecasters(d,'gold',now).ranked.map(r=>r.error),rankForecasters(data,'gold',now).ranked.map(r=>r.error));
});
test('all remaining 22 assets report no fabricated five-year ranks',()=>{
 for(const id of Object.keys(data.coverage).filter(id=>!['gold','silver','platinum','brent','wti','gas'].includes(id)))assert.equal(rankForecasters(data,id,now).ranked.length,0);
});
test('uncompleted evaluation window and invalid weights are rejected',()=>{
 assert.throws(()=>rankForecasters(data,'gold',new Date('2025-10-05')));const d=clone();d.weights[2021]=0;assert.throws(()=>rankForecasters(d,'gold',now));
});
test('all factual evidence IDs are unique; 2026 actuals are unfilled; context is never scored',()=>{
 assert.equal(new Set(data.records.map(r=>r.id)).size,data.records.length);
 assert.ok(data.records.filter(r=>r.target_year===2026).every(r=>r.status==='pending'&&r.actual===null));
 assert.equal(data.context_forecasts.length,12);assert.equal(data.context_forecasts.find(r=>r.asset_id==='copper').unit,'metric ton');
});
