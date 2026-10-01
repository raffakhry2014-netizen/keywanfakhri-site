// Presentation-only adapter. The original data, formulas and dashboard script are unmodified.
const languages={de:'Deutsch',en:'English',fa:'فارسی',ar:'العربية',tr:'Türkçe',it:'Italiano',fr:'Français',ko:'한국어',zh:'中文',ja:'日本語',es:'Español',sq:'Shqip'};
let stored;try{stored=localStorage.getItem('keyone-language')}catch{}
const requested=new URL(location.href).searchParams.get('lang')||stored||'de';
const lang=Object.hasOwn(languages,requested)?requested:'de';
const {strings,copy}=await fetch(`/projects/logistics/${lang}.json`).then(r=>{if(!r.ok)throw Error('Translation unavailable');return r.json()});
try{localStorage.setItem('keyone-language',lang)}catch{}
document.documentElement.lang=lang;
document.documentElement.dir=['fa','ar'].includes(lang)?'rtl':'ltr';
document.title=copy[0]+' — KeyOne';
const banner=document.createElement('header');banner.className='demo-context';banner.dataset.localised='true';
const back=document.createElement('a');back.href='/?lang='+lang+'#projects';back.textContent=copy[2];
const intro=document.createElement('div');const title=document.createElement('strong');title.textContent=copy[0];const description=document.createElement('p');description.textContent=copy[1];intro.append(title,description);
const label=document.createElement('label');label.textContent=copy[3]+' ';const select=document.createElement('select');select.setAttribute('aria-label',copy[3]);
for(const [code,name] of Object.entries(languages)){const opt=document.createElement('option');opt.value=code;opt.textContent=name;opt.selected=code===lang;select.append(opt)}label.append(select);banner.append(back,intro,label);document.body.prepend(banner);
select.addEventListener('change',()=>{try{localStorage.setItem('keyone-language',select.value)}catch{}const url=new URL(location.href);url.searchParams.set('lang',select.value);location.assign(url.href)});
const months=['Sep 25','Okt 25','Nov 25','Dez 25','Jan 26','Feb 26','Mrz 26','Apr 26','Mai 26','Jun 26','Jul 26','Aug 26'];
for(let i=0;i<12;i++){const date=new Date(Date.UTC(2025,8+i,1));const value=new Intl.DateTimeFormat(lang,{month:'short',year:'2-digit',calendar:'gregory',timeZone:'UTC'}).format(date);strings[months[i]]=value;strings[months[i].toUpperCase()]=value}
const norm=s=>s.replace(/\s+/g,' ').trim();
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const keys=Object.keys(strings).sort((a,b)=>b.length-a.length);
const pattern=new RegExp('(?<![\\p{L}])(?:'+keys.map(escape).join('|')+')(?![\\p{L}])','gu');
function translate(s){const n=norm(s);const value=Object.hasOwn(strings,n)?strings[n]:n.replace(pattern,m=>strings[m]);return (/^\s/.test(s)?' ':'')+value+(/\s$/.test(s)?' ':'');}
const originals=new WeakMap();const attrOriginals=new WeakMap();
function textNode(n){const old=originals.get(n);const source=old&&n.nodeValue===old.output?old.source:n.nodeValue;if(!source.trim())return;const output=translate(source);if(n.nodeValue!==output)n.nodeValue=output;originals.set(n,{source,output})}
const observer=new MutationObserver(()=>apply());
function apply(){observer.disconnect();const walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(n){return n.parentElement?.closest('script,style,.demo-context')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});let n;while((n=walk.nextNode()))textNode(n);
 for(const el of document.querySelectorAll('[title],[aria-label]')){if(el.closest('.demo-context'))continue;let old=attrOriginals.get(el)||{};for(const a of ['title','aria-label']){if(!el.hasAttribute(a))continue;const value=el.getAttribute(a),source=old[a]?.output===value?old[a].source:value,output=translate(source);if(output!==value)el.setAttribute(a,output);old[a]={source,output}}attrOriginals.set(el,old)}
 observer.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['title','aria-label']});}
apply();
