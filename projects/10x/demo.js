import {renderIndicators} from './indicators.js';
import {score,CEIL,LAYERS,NUMS} from './model.js';
const root='/projects/10x/', $=id=>document.getElementById(id);
let lang='de',dict={},rows=[],localeRun=0;
try{lang=localStorage.getItem('keyone-language')||'de'}catch{}
const requested=new URLSearchParams(location.search).get('lang');if(requested)lang=requested==='zh-Hans'?'zh':requested;
if(!languageOptions.some(([k])=>k===lang))lang='en';
function node(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n}
function showNumber(v){return v===null||v===undefined?dict.missing:new Intl.NumberFormat(lang,{maximumFractionDigits:1}).format(v)}
for(const [code,label] of languageOptions){const o=node('option',label);o.value=code;$('language-select').append(o)}
function render(){
 document.querySelectorAll('[data-t]').forEach(n=>n.textContent=dict[n.dataset.t]||'');
 document.title=dict.title+' | KeyOne';$('layers').replaceChildren();
 for(const l of LAYERS){const n=node('div',dict[l.key],'layer');n.append(node('b',l.max+' / 100'));$('layers').append(n)}
 renderIndicators(dict,node,rows,showNumber);
 $('cards').replaceChildren();
 rows.forEach((d,i)=>{const r=score(d),c=node('article',undefined,'card');c.append(node('span',d.ticker,'id'),node('h3',dict.company+' '+String.fromCharCode(65+i)),node('p',dict['scenario'+String.fromCharCode(65+i)],'scenario'));
 c.append(node('div',({go:'● ',watch:'◆ ',stop:'▲ '}[r.band])+dict[{go:'pass',watch:'review',stop:'fail'}[r.band]],'status '+r.band));
 const metrics=node('div',undefined,'metrics');for(const [label,value] of [['quality',r.total],['ceiling',r.ceilX===null?dict.missing:showNumber(r.ceilX)+'×'],['unknown',r.unknown.length]]){const m=node('div',undefined,'metric');m.append(node('span',dict[label]),node('b',typeof value==='number'?showNumber(value):value));metrics.append(m)}c.append(metrics);
 for(const l of LAYERS){const p=node('div',undefined,'part'),track=node('div',undefined,'track'),fill=node('div',undefined,'fill');p.append(node('span',dict[l.key]),node('bdi',showNumber(r.parts[l.key])+' / '+l.max));fill.style.width=Math.max(0,Math.min(100,r.parts[l.key]/l.max*100))+'%';track.append(fill);p.append(track);c.append(p)}
 $('cards').append(c);
 });
 for(const k of ['share','margin','multiple'])$(k+'-out').textContent=showNumber(CEIL[k])+(k==='multiple'?'×':'%');
}
async function setLanguage(code){const run=++localeRun;const res=await fetch(root+'i18n/'+code+'.json');if(!res.ok)throw Error('Language unavailable');const data=await res.json();if(run!==localeRun)return;dict=data;lang=code;document.documentElement.lang=lang==='zh'?'zh-Hans':lang;document.documentElement.dir=['fa','ar'].includes(lang)?'rtl':'ltr';$('language-select').value=lang;try{localStorage.setItem('keyone-language',lang)}catch{}render()}
function error(){const e=$('error');e.hidden=false;e.textContent='The demo could not load. Please reload. / بارگذاری انجام نشد؛ صفحه را دوباره باز کنید.'}
$('language-select').addEventListener('change',e=>setLanguage(e.target.value).catch(error));
for(const k of ['share','margin','multiple'])$(k).addEventListener('input',()=>{CEIL[k]=Number($(k).value);render()});
$('reset').onclick=()=>{Object.assign(CEIL,{share:40,margin:12,multiple:25});for(const k of ['share','margin','multiple'])$(k).value=CEIL[k];render()};
let theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';try{theme=localStorage.getItem('keyone-10x-theme')||theme}catch{}document.documentElement.dataset.theme=theme;
$('theme').onclick=()=>{theme=theme==='dark'?'light':'dark';document.documentElement.dataset.theme=theme;try{localStorage.setItem('keyone-10x-theme',theme)}catch{}};
try{const res=await fetch(root+'data/candidates.json');if(!res.ok)throw Error();rows=await res.json();await setLanguage(lang)}catch{error()}
