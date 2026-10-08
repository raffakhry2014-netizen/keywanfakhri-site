window.cafeDemoLink=function(cls){var L={de:"Café-Demo",en:"Café demo",fa:"دموی کافه",ar:"عرض المقهى",tr:"Kafe demosu",it:"Demo caffè",fr:"Démo café",ko:"카페 데모",zh:"咖啡馆演示",ja:"カフェデモ",es:"Demo de cafetería",sq:"Demo kafeneje"};var l=(typeof lang!=="undefined"&&L[lang])?lang:"de";var st=cls.indexOf('secondary')>-1?' style="display:inline-flex;align-items:center;min-height:44px;padding:0 18px;border:1.5px solid currentColor;border-radius:10px;text-decoration:none;font-weight:700"':'';return '<a class="'+cls+'"'+st+' href="/gastlyo/caffe/?lang='+l+'" target="_blank" rel="noopener">'+L[l]+' ↗</a>';};
function renderPortfolio(){
 const p=portfolio[lang],rc=restaurantCopy[lang];
 document.querySelectorAll('[data-contact-link],a[href="#contact"],a[href="/#contact"]').forEach(a=>{a.dataset.contactLink='';a.href='/contact/?lang='+lang});
 document.querySelectorAll('[data-about-link],.site-nav a[href="/#about"]').forEach(a=>{a.dataset.aboutLink='';a.href='/about/?lang='+lang});
 document.querySelectorAll('[data-about-link],.site-nav a[href="/#about"]').forEach(a=>a.href="/about/?lang="+lang);
 document.querySelectorAll('[data-p]').forEach(el=>el.textContent=p[el.dataset.p]||'');
 document.title='KeyOne — Keywan Fakhri | '+p.projectsNav;
 document.querySelector('meta[name="description"]').content=p.heroText;
 document.getElementById('footer-note').textContent=p.location;
 if(document.body.dataset.page==='contact'){document.title=p.contactNav+' — KeyOne';document.querySelector('meta[name="description"]').content=p.contactNav+' · Keywan Fakhri · Konstanz';return;}
 if(document.body.dataset.page==='restaurant'){document.title=rc[0]+' — KeyOne';document.getElementById('headline').textContent=rc[0];document.getElementById('subhead').textContent=rc[1];document.querySelector('meta[name=description]').content=rc[1];return;}
 document.getElementById('custom-title').textContent=rc[6];document.getElementById('custom-body').textContent=rc[7];
 const lt=document.querySelector('[data-p=labTitle]');if(lt)lt.textContent=rc[8];const li=document.querySelector('[data-p=labIntro]');if(li)li.textContent=rc[9];const pi=document.querySelector('[data-p=projectsIntro]');if(pi)pi.textContent='';
 for(const area of ['projects','lab']){
  const host=document.getElementById(area==='projects'?'project-grid':'lab-grid');if(!host)continue;
  host.innerHTML=projectRegistry.filter(x=>area==='projects'?visibleProjects().includes(x):x.area==='lab'||x.status!=='available').map(project=>{
   const c=project.id==='gastlyo'?[rc[0],rc[1],rc[1]]:projectCopy[lang][project.copy];
   if(project.id==='gastlyo')return `<article class="project-card"><div class="project-top"><span class="project-kind">HOSPITALITY</span></div><div class="project-mark restaurant-mark" aria-hidden="true">SMART<br>RESTAURANT</div><h3>${esc(c[0])}</h3><p>${esc(c[1])}</p><div class="project-links"><a class="project-detail" href="/projects/restaurant/?lang=${lang}">${esc(p.details)} ↗</a></div></article>`;
   if(area==='projects'&&document.body.dataset.page==='home')return kbCard(project,c,p);
   return `<article class="project-card ${project.id==='gastlyo'?'featured-project':''}"><div class="project-top"><span class="status ${project.status}">${esc(p[project.status])}</span><span class="project-kind">${project.id==='logistics'?'KPI':project.type==='finance'&&!project.demo?'RESEARCH':project.type==='hospitality'?'HOSPITALITY':'LAB'}</span></div><div class="project-mark" aria-hidden="true">${project.id==='gastlyo'?'Gastlyo':project.id==='10x'?'10<span>×</span>':project.id==='logistics'?'LOG / KPI':project.id==='6m'?'6<span>M</span>':project.id==='tester'?'01 / TEST':project.id==='economic-assistant'?'02 / DE':esc(c[0].slice(0,16))}</div><h3>${esc(c[0])}</h3><p>${esc(c[1])}</p><div class="project-links"><a href="#project/${project.id}" class="project-detail">${esc(p.details)} <span aria-hidden="true">↗</span></a>${project.demo?`<a class="demo-link" href="${esc(['10x','logistics','6m','prozessatlas','gastlyo'].includes(project.id)?project.demo+'?lang='+lang:project.demo)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(p.external)}">${esc(p.demo)} ↗</a>`:''}${project.id==='gastlyo'?cafeDemoLink('demo-link'):''}</div></article>`;
  }).join('');
 }
 renderAreaBar();
 if(typeof renderShowcase==='function')renderShowcase();
}
function fillProject(id){
 const project=projectRegistry.find(x=>x.id===id);
 if(!project)return false;
 const p=portfolio[lang],c=projectCopy[lang][project.copy];
 box.innerHTML=`<span class="pill">${esc(p[project.status])}</span><h2 id="dialog-title">${esc(c[0])}</h2><p class="dialog-lead">${esc(c[1])}</p><p>${esc(c[2])}</p>${project.type==='finance'&&!project.demo?`<h3>${esc(p.coming)}</h3><p class="note">${esc(p.members)}</p>`:''}${project.demo?`<a class="primary inline-link" href="${esc(['10x','logistics','6m','prozessatlas','gastlyo'].includes(project.id)?project.demo+'?lang='+lang:project.demo)}" target="_blank" rel="noopener noreferrer">${esc(p.demo)} ↗</a>${project.id==='gastlyo'?cafeDemoLink('secondary inline-link'):''}${project.type==='hospitality'?`<a class="secondary inline-link" href="#hospitality" data-close-dialog>${esc(p.servicesNav)}</a>`:''}`:`<p class="note">${esc(p.nodemo)}</p><a class="primary inline-link" href="#contact" data-close-dialog>${esc(p.discuss)}</a>`}`;
 dialog.setAttribute('aria-labelledby','dialog-title');return true;
}
function routeProject(){
 if(location.hash==='#contact'||location.hash==='#about'){location.replace('/'+location.hash.slice(1)+'/?lang='+lang);return;}
 if(location.hash==='#project/gastlyo'||location.hash==='#hospitality'){location.replace('/projects/restaurant/?lang='+lang);return;}
 const m=location.hash.match(/^#project\/([a-z0-9-]+)$/);
 if(m&&projectRegistry.some(p=>p.id===m[1])){view='project:'+m[1];fillProject(m[1]);if(!dialog.open)dialog.showModal();}
 else if(dialog.open&&typeof view==='string'&&view.startsWith('project:'))dialog.close();
}
window.addEventListener('hashchange',routeProject);
let portfolioInitialized=false;
function initPortfolio(){if(portfolioInitialized)return;portfolioInitialized=true;
 routeProject();
 box.addEventListener('click',e=>{if(e.target.closest('[data-close-dialog]'))dialog.close();});
 dialog.addEventListener('close',()=>{if(location.hash.startsWith('#project/'))history.replaceState(null,'','#projects');});
}
window.addEventListener('DOMContentLoaded',()=>{if(typeof dialog!=='undefined')initPortfolio()});

/* Bereichs-Leiste der Startseite */
let currentArea=(()=>{const a=new URLSearchParams(location.search).get('bereich');return ['eng','gastro','fin'].includes(a)?a:'eng'})();
function renderAreaBar(){
 const bar=document.getElementById('area-tabs');if(!bar||typeof areaCopy==='undefined')return;
 const ac=areaCopy[lang]||areaCopy.de;
 const live=projectRegistry.filter(x=>x.area==='projects'&&x.status==='available');
 const count=a=>a==='gastro'?(document.querySelectorAll('#cards .service').length||8):live.filter(x=>projectAreaOf(x)===a).length;
 bar.setAttribute('aria-label',ac.label);
 bar.innerHTML=AREA_ORDER.map((a,i)=>`<button type="button" role="tab" class="area-tab" id="area-tab-${a}" data-area="${a}" aria-selected="${a===currentArea}" aria-controls="${a==='gastro'?'area-panel-gastro':'area-panel-list'}" tabindex="${a===currentArea?0:-1}">${esc(ac.tabs[i])}<span class="n">(${count(a)})</span></button>`).join('');
 document.getElementById('area-intro').textContent=ac.intro[AREA_ORDER.indexOf(currentArea)];
 const list=document.getElementById('area-panel-list'),gastro=document.getElementById('area-panel-gastro');
 list.hidden=currentArea==='gastro';gastro.hidden=currentArea!=='gastro';
 list.setAttribute('aria-labelledby','area-tab-'+(currentArea==='gastro'?'eng':currentArea));
}
function selectArea(a,focus){
 if(!AREA_ORDER.includes(a))return;currentArea=a;
 try{const u=new URL(location.href);if(a==='eng')u.searchParams.delete('bereich');else u.searchParams.set('bereich',a);history.replaceState(null,'',u.pathname+u.search+location.hash)}catch(e){}
 renderPortfolio();
 if(focus)document.getElementById('area-tab-'+a)?.focus();
}
document.addEventListener('click',e=>{const b=e.target.closest('.area-tab');if(b)selectArea(b.dataset.area,false)});
document.addEventListener('keydown',e=>{const b=e.target.closest&&e.target.closest('.area-tab');if(!b)return;
 const rtl=document.documentElement.dir==='rtl';let i=AREA_ORDER.indexOf(b.dataset.area);
 if(e.key==='ArrowRight')i+=rtl?-1:1;else if(e.key==='ArrowLeft')i+=rtl?1:-1;else if(e.key==='Home')i=0;else if(e.key==='End')i=AREA_ORDER.length-1;else return;
 e.preventDefault();selectArea(AREA_ORDER[(i+AREA_ORDER.length)%AREA_ORDER.length],true);});
function visibleProjects(){return projectRegistry.filter(x=>x.area==='projects'&&x.status==='available'&&(typeof projectAreaOf!=='function'||(currentArea!=='gastro'&&projectAreaOf(x)===currentArea)));}
/* Kartenstil „Kopfband“ für die Projektkarten der Startseite */
const KB_ICON={logistics:'M4 20h16M7 16v-5M12 16V7M17 16v-8',prozessatlas:'M5 5h4v4H5zM15 3h4v4h-4zM15 15h4v4h-4zM9 7h3v10h3M12 5h3',lagerplaner:'M3 21V8l9-5 9 5v13M7 21v-7h10v7M7 17.5h10','10x':'M3 20h18M4 16l5-5 4 3 7-8M15 6h5v5','6m':'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM16 16l5 5M8 11h6M11 8v6'};
const KB_LABEL={logistics:'KPI · DASHBOARD',prozessatlas:'BPM · ATLAS',lagerplaner:'WMS · 2D/3D','10x':'10X · DEMO','6m':'6M · SCREENING'};
function kbCard(project,c,p){
 const demo=project.demo?esc(['10x','logistics','6m','prozessatlas','gastlyo'].includes(project.id)?project.demo+'?lang='+lang:project.demo):'';
 return `<article class="project-card kb-card"><div class="kb-band"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${KB_ICON[project.id]||'M4 4h16v16H4z'}"/></svg><span class="kb-label" dir="ltr">${esc(KB_LABEL[project.id]||project.id.toUpperCase())}</span></div><div class="kb-body"><h3>${esc(c[0])}</h3><p>${esc(c[1])}</p><div class="kb-actions"><a class="kb-btn" href="#project/${project.id}">${esc(p.details)}</a>${demo?`<a class="kb-btn kb-primary" href="${demo}" target="_blank" rel="noopener noreferrer" aria-label="${esc(p.external)}">${esc(p.demo)} ↗</a>`:''}${project.id==='gastlyo'?cafeDemoLink('kb-btn'):''}</div></div></article>`;
}
