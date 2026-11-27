import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {comparisonStatus,forecasterPeriods,annual2026} from '../projects/market-intelligence/forecast-layout.js';
const load=n=>JSON.parse(fs.readFileSync(new URL('../projects/market-intelligence/'+n,import.meta.url)));
const outlook=load('outlook-2027.json'),evidence=load('evidence.json');
test('ranking comparison requires three available forecasters',()=>{assert.equal(comparisonStatus(2),'insufficient');assert.equal(comparisonStatus(3),'comparable');});
test('layout follows each source, not quarterly coverage of another source',()=>{assert.deepEqual(forecasterPeriods(outlook,'brent','worldbank'),['2026','annual']);assert.equal(forecasterPeriods(outlook,'brent','eia').length,6);assert.deepEqual(forecasterPeriods(outlook,'gold','worldbank'),['2026','annual']);});
test('2026 annual targets preserve source and forecaster identity',()=>{assert.equal(annual2026(evidence,'gold','worldbank','World Bank')[0].value,4700);assert.equal(annual2026(evidence,'brent','eia','U.S. EIA')[0].value,91.01);assert.deepEqual(annual2026(evidence,'gold','unknown','Unknown'),[]);});
