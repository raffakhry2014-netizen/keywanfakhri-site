import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const codes=['en','de','fa','ar','tr','it','fr','ko','zh','ja','es','sq'];
const load=code=>JSON.parse(fs.readFileSync(new URL(`../projects/market-intelligence/locales/${code}.json`,import.meta.url)));
test('all eleven site translations have complete matching keys',()=>{const en=load('en');for(const code of codes){const d=load(code);assert.deepEqual(Object.keys(d).sort(),Object.keys(en).sort(),code);for(const [key,value] of Object.entries(d))assert.ok(typeof value==='string'&&value.trim(),`${code}: ${key}`);}});
test('translations preserve methodological counts and financial data in files',()=>{for(const code of codes){const d=load(code);assert.ok(d['2026 annual average'].includes('2026'));assert.ok(d['2027 annual average'].includes('2027'));assert.ok(d['Q1 2027'].includes('2027'));}const module=fs.readFileSync(new URL('../projects/market-intelligence/i18n.js',import.meta.url),'utf8');assert.ok(module.includes("['fa','ar'].includes(language)"));assert.ok(module.includes('[data-original]'));});
