import {renderResearch,renderMethodology} from './research-view.js';
import {rankForecasters} from './research-engine.js';
import {renderCoverage} from './coverage-view.js';
import {forecastsFor} from './outlook-engine.js';
import {renderOutlook,renderAssetScenarios,renderOverview,formatValue} from './outlook-view.js';
let catalog, evidence, outlook, selected, category='All', activeAsset, chartAsset;
const el=id=>document.getElementById(id);
function render(){
 const term=el('search').value.trim().toLowerCase();
 const items=catalog.assets.filter(a=>(category==='All'||a.category===category)&&`${a.name} ${a.symbol}`.toLowerCase().includes(term));
 el('assets').replaceChildren();
 for(const a of items){
  const b=document.createElement('button');b.className='asset '+a.category.toLowerCase();b.dataset.id=a.id;b.setAttribute('aria-haspopup','dialog');b.setAttribute('aria-label',`Open ${a.name} research`);
  const top=document.createElement('div');top.className='tile-top';const mark=document.createElement('span');mark.className='asset-mark';mark.textContent=a.id.toUpperCase();const categoryLabel=document.createElement('small');categoryLabel.textContent=a.category;top.append(mark,categoryLabel);
  const title=document.createElement('strong');title.textContent=a.name;
  const annual=forecastsFor(outlook,a.id);const lead=annual.find(r=>r.provider==='U.S. EIA')||annual[0];
  const value=document.createElement('div');value.className='tile-value';value.textContent=lead?formatValue(lead.value):'Awaiting research';
  const note=document.createElement('span');note.className='tile-note';note.textContent=lead?`2027 ${lead.basis} · ${lead.provider} · USD / ${lead.unit}`:'No verified 2027 target imported';
  const foot=document.createElement('div');foot.className='tile-foot';const status=document.createElement('small');status.textContent=annual.length?`${annual.length} annual source${annual.length>1?'s':''}`:'Coverage pending';const arrow=document.createElement('span');arrow.textContent='↗';foot.append(status,arrow);
  const ranks=rankForecasters(evidence,a.id,new Date(evidence.reviewed_at));status.textContent=ranks.ranked.length>1?`${ranks.ranked.length}/10 ranked analysts`:ranks.ranked.length===1?'1 evaluated institution':'History incomplete';b.append(top,title,foot);b.addEventListener('click',()=>select(a));el('assets').append(b);
 }
 if(!items.length){const empty=document.createElement('p');empty.className='empty';empty.textContent='No assets match. Try another name or category.';el('assets').append(empty);}
 el('count').textContent=`${items.length} assets shown`;
}
function select(a){
 selected=a.id;activeAsset=a;renderCoverage(evidence,outlook,a,el('coverage'));document.querySelector('.history').open=true;el('name').textContent=a.name;el('basis').textContent=`Chart reference: ${a.description}`;el('detail-category').textContent=a.category+' / '+a.id.toUpperCase();renderResearch(evidence,a,el('research'));el('outlook').replaceChildren();renderOutlook(outlook,a,el('outlook'));el('scenarios').replaceChildren();renderAssetScenarios(outlook,a,el('scenarios'));el('asset-dialog').showModal();el('asset-dialog').scrollTop=0;
 el('chart').replaceChildren();chartAsset=null;
 if(el('market-details').open)loadChart(a);
}
function loadChart(a){
 if(chartAsset===a.id)return;chartAsset=a.id;
 const url=`https://www.tradingview.com/symbols/${a.symbol.replace(':','-')}/`;
 el('source').href=url;
 const container=document.createElement('div');container.className='tradingview-widget-container';
 const widget=document.createElement('div');widget.className='tradingview-widget-container__widget';
 const credit=document.createElement('div');credit.className='tradingview-widget-copyright';
 const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener nofollow';link.textContent=`${a.name} chart`;
 credit.append(link,document.createTextNode(' by TradingView'));
 const script=document.createElement('script');script.type='text/javascript';script.async=true;script.src='https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
 script.textContent=JSON.stringify({autosize:true,symbol:a.symbol,interval:'D',timezone:'exchange',theme:'dark',style:'3',locale:'en',allow_symbol_change:false,save_image:false,calendar:false,support_host:'https://www.tradingview.com'});
 script.addEventListener('error',()=>{widget.textContent='The provider chart could not load. Please use the source link above.';});
 container.append(widget,credit,script);el('chart').replaceChildren(container);
}
try{
 const responses=await Promise.all([fetch('./watchlist.json'),fetch('./evidence.json'),fetch('./outlook-2027.json')]);if(responses.some(r=>!r.ok))throw Error('evidence');[catalog,evidence,outlook]=await Promise.all(responses.map(r=>r.json()));
 const date=new Date(evidence.reviewed_at);el('reviewed').textContent=date.toISOString().replace('T',' · ').replace('.000Z',' UTC');renderMethodology(evidence,el('methodology'));const outlookLink=document.createElement('a');outlookLink.href='./outlook-2027.json';outlookLink.textContent='Download the 2027 source snapshot';el('methodology').append(outlookLink);
 el('market-details').addEventListener('toggle',()=>{if(el('market-details').open&&activeAsset)loadChart(activeAsset);});
 el('search').addEventListener('input',render);
 document.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.category;document.querySelectorAll('[data-category]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();}));
 render();el('outlook-reviewed').textContent=new Date(outlook.reviewed_at).toISOString().replace('T',' · ').replace('.000Z',' UTC');renderOverview(outlook,catalog.assets,el('overview'));el('overview-period').addEventListener('change',()=>renderOverview(outlook,catalog.assets,el('overview'),el('overview-period').value));el('close-detail').addEventListener('click',()=>el('asset-dialog').close());el('asset-dialog').addEventListener('close',()=>{el('chart').replaceChildren();chartAsset=null;el('market-details').open=false;});el('asset-dialog').addEventListener('click',event=>{if(event.target===el('asset-dialog')){const rect=el('asset-dialog').getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)el('asset-dialog').close();}});
}catch{el('name').textContent='Watchlist unavailable';el('reviewed').textContent='Unavailable';el('count').textContent='Please reload to try again.';}
