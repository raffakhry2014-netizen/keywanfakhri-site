import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {forecastsFor,scenarioSummary,PERIODS} from '../projects/market-intelligence/outlook-engine.js';
const data=JSON.parse(readFileSync(new URL('../projects/market-intelligence/outlook-2027.json',import.meta.url),'utf8'));
test('published EIA quarterly targets preserve the source columns and annual value',()=>{
 assert.deepEqual(PERIODS.map(p=>forecastsFor(data,'wti',p)[0].value),[69.74,80.90,73,66.03,59.94]);
 assert.deepEqual(PERIODS.map(p=>forecastsFor(data,'gas',p).find(r=>r.provider==='U.S. EIA').value),[3.28,3.59,2.76,3.16,3.59]);
});
test('missing quarters are not interpolated from World Bank annual averages',()=>{
 assert.equal(forecastsFor(data,'gold')[0].value,4300);for(const p of PERIODS.slice(1))assert.equal(forecastsFor(data,'gold',p).length,0);
 assert.equal(forecastsFor(data,'spy').length,0);assert.equal(forecastsFor(data,'btc')[0].value,250000);assert.equal(forecastsFor(data,'btc')[0].basis,'by year-end target');
});
test('source baselines are never renamed bearish or bullish; benchmark definitions stay separate',()=>{
 const s=scenarioSummary(data,'brent');assert.equal(s.length,2);assert.ok(s.every(g=>g.bear.length===0&&g.bull.length===0&&g.base.length===1));
});
test('an annual average cannot appear as a quarterly forecast or an unknown scenario',()=>{
 const d=structuredClone(data);const gold=d.records.find(r=>r.asset_id==='gold');gold.period='Q1';assert.equal(forecastsFor(d,'gold','Q1').length,0);gold.period='annual';gold.scenario='guaranteed';assert.equal(forecastsFor(d,'gold').length,0);
});
test('future, unlinked, invalid, wrong year and ambiguous duplicate values cannot be displayed',()=>{
 for(const [field,value] of [['issued_at','2028-01-01'],['source_url',null],['value',-1],['value',null],['year',2026],['currency','USDT'],['basis','unknown']]){
  const d=structuredClone(data);d.records.find(r=>r.asset_id==='gold')[field]=value;assert.equal(forecastsFor(d,'gold').length,0);
 }
 const d=structuredClone(data);d.records.push({...d.records.find(r=>r.asset_id==='gold')});assert.equal(forecastsFor(d,'gold').length,0);
});
test('dataset has unique linked records for nine yearly assets and exactly three quarterly assets',()=>{
 assert.equal(new Set(data.records.map(r=>r.id)).size,data.records.length);assert.equal(new Set(data.records.filter(r=>r.period==='annual').map(r=>r.asset_id)).size,9);assert.equal(data.records.filter(r=>r.period!=='annual').length,12);
});
