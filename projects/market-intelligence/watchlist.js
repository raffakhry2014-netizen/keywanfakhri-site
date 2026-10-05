import {renderResearch,renderMethodology} from './research-view.js';
let catalog, evidence, selected, category='All', activeAsset, chartAsset;
const el=id=>document.getElementById(id);
function render(){
 const term=el('search').value.trim().toLowerCase();
 const items=catalog.assets.filter(a=>(category==='All'||a.category===category)&&`${a.name} ${a.symbol}`.toLowerCase().includes(term));
 el('assets').replaceChildren();let last='';
 for(const a of items){
  if(a.category!==last){const label=document.createElement('h3');label.className='category-label';label.textContent=a.category;el('assets').append(label);last=a.category;}
  const b=document.createElement('button');b.className='asset';b.dataset.id=a.id;b.setAttribute('aria-pressed',String(a.id===selected));
  const title=document.createElement('strong');title.textContent=a.name;const subtitle=document.createElement('span');subtitle.textContent=evidence.coverage[a.id].status==='evidence_available'?(a.id==='brent'||a.id==='wti'||a.id==='gas'?'Five-year history · one institution':'Five-year ranking available'):'Historical ranking pending';b.append(title,subtitle);b.addEventListener('click',()=>select(a));el('assets').append(b);
 }
 el('count').textContent=`${items.length} assets shown`;
}
function select(a){
 selected=a.id;activeAsset=a;render();el('name').textContent=a.name;el('basis').textContent=`Chart reference: ${a.description}`;renderResearch(evidence,a,el('research'));
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
 const responses=await Promise.all([fetch('./watchlist.json'),fetch('./evidence.json')]);if(responses.some(r=>!r.ok))throw Error('evidence');[catalog,evidence]=await Promise.all(responses.map(r=>r.json()));
 const date=new Date(evidence.reviewed_at);el('reviewed').textContent=date.toISOString().replace('T',' · ').replace('.000Z',' UTC');renderMethodology(evidence,el('methodology'));
 el('market-details').addEventListener('toggle',()=>{if(el('market-details').open&&activeAsset)loadChart(activeAsset);});
 el('search').addEventListener('input',render);
 document.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.category;document.querySelectorAll('[data-category]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();}));
 select(catalog.assets[0]);
}catch{el('name').textContent='Watchlist unavailable';el('reviewed').textContent='Unavailable';el('count').textContent='Please reload to try again.';}
