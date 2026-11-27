export const languages={en:'English',de:'Deutsch',fa:'فارسی',ar:'العربية',tr:'Türkçe',it:'Italiano',fr:'Français',ko:'한국어',zh:'中文（简体）',ja:'日本語',es:'Español',sq:'Shqip'};
const requested=new URL(location.href).searchParams.get('lang');
export const language=Object.hasOwn(languages,requested)?requested:'en';
const response=await fetch(`./locales/${language}.json`);
if(!response.ok)throw Error('Language resource unavailable');
const dictionary=await response.json();
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const keys=Object.keys(dictionary).sort((a,b)=>b.length-a.length);
const pattern=new RegExp(`(?<![\\p{L}])(?:${keys.map(escape).join('|')})(?![\\p{L}])`,'giu');
const lower=new Map(keys.map(k=>[k.toLowerCase(),dictionary[k]]));
export function translate(text){
 if(language==='en')return text;
 if(Object.hasOwn(dictionary,text.trim()))return text.replace(text.trim(),dictionary[text.trim()]);
 return text.replace(pattern,key=>lower.get(key.toLowerCase())||key);
}
document.documentElement.lang=language;document.documentElement.dir=['fa','ar'].includes(language)?'rtl':'ltr';
document.title=`KeyOne · ${translate('Market intelligence')} · 2027`;
const select=document.getElementById('language-select');
for(const [code,label] of Object.entries(languages)){const option=document.createElement('option');option.value=code;option.textContent=label;select.append(option);}select.value=language;
select.addEventListener('change',()=>{const url=new URL(location.href);url.searchParams.set('lang',select.value);location.assign(url.href);});
const saved=new WeakMap();
function localize(root){
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
 while(node=walker.nextNode()){
  const parent=node.parentElement;if(!parent||parent.closest('script,style,#language-select,[data-original],#chart,.asset-mark'))continue;
  const previous=saved.get(node);const original=previous&&node.nodeValue===previous.translated?previous.original:node.nodeValue;
  const translated=translate(original);saved.set(node,{original,translated});if(node.nodeValue!==translated)node.nodeValue=translated;
 }
 for(const element of root.querySelectorAll?.('[aria-label],[placeholder]')||[]){for(const attribute of ['aria-label','placeholder']){if(!element.hasAttribute(attribute))continue;const value=element.getAttribute(attribute);const key='original'+attribute.replace('-','');if(!element.dataset[key])element.dataset[key]=value;element.setAttribute(attribute,translate(element.dataset[key]));}}
}
localize(document.body);
let pending=false;
new MutationObserver(()=>{if(pending)return;pending=true;queueMicrotask(()=>{pending=false;localize(document.body);});}).observe(document.body,{subtree:true,childList:true,characterData:true});
document.querySelector('.brand').href='/?lang='+language;
