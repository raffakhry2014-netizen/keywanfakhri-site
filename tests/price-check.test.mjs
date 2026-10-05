import test from 'node:test';
import assert from 'node:assert/strict';
import {alphaQuote,compareQuotes} from '../functions/lib/price-check.js';
import {onRequestPost} from '../functions/api/market-intelligence.js';
const now=Date.parse('2026-10-05T12:00:00Z');
const a={status:'ok',price:100,currency:'USD',timestamp:'2026-10-05T12:00:00Z',unit:'share',basis:'spot',instrument:'TEST@NASDAQ',asset_type:'Stock'};
test('threshold, denominator and configurable commodity threshold',()=>{
  assert.equal(compareQuotes(a,{...a,price:101},{},now).status,'verified');
  assert.equal(compareQuotes(a,{...a,price:101.01},{},now).status,'warning');
  assert.equal(compareQuotes(a,{...a,price:102},{PRICE_CHECK_THRESHOLD_PCT:'2'},now).difference_pct,2);
  assert.equal(compareQuotes({...a,asset_type:'Commodity'},{...a,price:101.5},{},now).status,'verified');
});
test('invalid prices, missing/stale times, skew and mismatched instruments never verify',()=>{
  for(const change of [{price:0},{price:null},{price:' '},{timestamp:null},{timestamp:'2026-10-04T12:00:00Z'},{timestamp:'2026-10-05T11:40:00Z'},{instrument:'ADR'},{currency:'EUR'},{basis:'monthly benchmark'},{status:'unavailable'}]){
    assert.equal(compareQuotes(a,{...a,...change},{},now).status,'warning');
  }
  assert.equal(compareQuotes(a,{...a,unit:'metric ton'},{},now).difference_pct,null);
});
test('daily close timestamps retain date precision and require same trading date',()=>{
  const q={...a,basis:'daily close',timestamp:'2026-10-02'};
  assert.equal(compareQuotes(q,q,{},now).status,'verified');
  assert.equal(compareQuotes(q,{...q,timestamp:'2026-10-01'},{},now).status,'warning');
});
test('upstream quota/error messages do not expose secrets',async()=>{
  const old=globalThis.fetch;
  try{
    globalThis.fetch=async()=>Response.json({Information:'secret-key-in-url'});
    const q=await alphaQuote({key:'gold'},{ALPHA_VANTAGE_API_KEY:'test-only-key'});
    assert.equal(q.status,'unavailable');
    assert.ok(!JSON.stringify(q).includes('secret-key-in-url'));
  }finally{globalThis.fetch=old;}
});
test('missing preview secrets retain commodity thresholds and source warning',async()=>{
  for(const asset of ['Gold','Bitcoin','ASML','Copper']){
    const r=await onRequestPost({request:new Request('https://preview.test/api/market-intelligence',{method:'POST',body:JSON.stringify({asset,quoteOnly:true})}),env:{}});
    const d=await r.json();
    assert.equal(d.market.price_check.status,'warning');
    assert.equal(d.market.price_check.threshold_pct,['Gold','Copper'].includes(asset)?1.5:1);
    assert.equal(d.market.price_check.provider_a.timestamp,null);
  }
});
test('restriction diagnostics are fixed messages and never echo provider secrets',async()=>{
  const old=globalThis.fetch;
  try {
    for(const [notice,expected] of [['Invalid API key private-secret','invalid'],['Our rate limit is 25 requests per day private-secret','quota reached'],['This is a premium endpoint private-secret','subscription'],['The demo API key private-secret','demo key']]) {
      globalThis.fetch=async()=>Response.json({Information:notice});
      const q=await alphaQuote({key:'gold'},{ALPHA_VANTAGE_API_KEY:'test-only-key'});
      assert.ok(q.message.includes(expected));
      assert.ok(!q.message.includes('private-secret'));
    }
  } finally {globalThis.fetch=old;}
});
test('four asset paths preserve primary price, timestamps, currency and warning semantics',async()=>{
  const old=globalThis.fetch;
  try{
    for(const asset of ['Gold','Bitcoin','ASML','Copper']){
      globalThis.fetch=async input=>{
        const u=new URL(input);
        if(u.hostname==='api.twelvedata.com'){
          if(u.pathname==='/currency_conversion') return Response.json({rate:0.9});
          return Response.json({close:100,currency:asset==='Bitcoin'?'EUR':'USD',symbol:u.searchParams.get('symbol'),timestamp:Date.now()/1000,exchange:asset==='ASML'?'NASDAQ':'aggregate',is_market_open:true});
        }
        const fn=u.searchParams.get('function');
        if(fn==='GOLD_SILVER_SPOT') return Response.json({price:100,timestamp:new Date().toISOString()});
        if(fn==='COPPER') return Response.json({unit:'USD per metric ton',data:[{date:'2026-09-01',value:9000}]});
        if(fn==='GLOBAL_QUOTE') return Response.json({'Global Quote':{'01. symbol':'ASML','05. price':'100','07. latest trading day':'2026-10-02'}});
        return Response.json({'Realtime Currency Exchange Rate':{'1. From_Currency Code':'BTC','3. To_Currency Code':'EUR','5. Exchange Rate':'100','6. Last Refreshed':new Date().toISOString(),'7. Time Zone':'UTC'}});
      };
      const response=await onRequestPost({request:new Request('https://preview.test/api/market-intelligence',{method:'POST',body:JSON.stringify({asset,quoteOnly:true})}),env:{TWELVE_DATA_API_KEY:'test-only-td',ALPHA_VANTAGE_API_KEY:'test-only-av'}});
      const d=await response.json();
      assert.equal(response.status,200);
      assert.equal(d.market.source_price,100);
      assert.equal(d.market.price_check.provider_b.status,'ok');
      assert.equal(d.market.price_check.status,['ASML','Copper'].includes(asset)?'warning':'verified');
      if(asset==='Copper') assert.equal(d.market.price_check.difference_pct,null);
      assert.ok(!JSON.stringify(d).includes('test-only-'));
    }
  }finally{globalThis.fetch=old;}
});
