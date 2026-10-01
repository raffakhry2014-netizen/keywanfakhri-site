
(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Punkte im Hero: unregelmäßig im Ist-Zustand, gleichmäßig im Soll-Zustand */
  var NS='http://www.w3.org/2000/svg', g=document.getElementById('dots');
  function dot(path,dur,begin,color,r){
    var c=document.createElementNS(NS,'circle'); c.setAttribute('r',r); c.setAttribute('fill',color);
    if(reduce){ var p=document.getElementById(path), L=p.getTotalLength(), pt=p.getPointAtLength(L*parseFloat(begin)/parseFloat(dur));
      c.setAttribute('cx',pt.x); c.setAttribute('cy',pt.y); g.appendChild(c); return; }
    var m=document.createElementNS(NS,'animateMotion'); m.setAttribute('dur',dur); m.setAttribute('begin','-'+begin); m.setAttribute('repeatCount','indefinite');
    var mp=document.createElementNS(NS,'mpath'); mp.setAttribute('href','#'+path); m.appendChild(mp); c.appendChild(m); g.appendChild(c);
  }
  ['0s','0.7s','2.2s','2.6s','4.5s','5.1s','6.3s'].forEach(function(b){dot('chaos','7s',b,'var(--muted)',4)});
  ['0s','0.7s','1.4s','2.1s','2.8s'].forEach(function(b){dot('order','3.5s',b,'var(--turq)',5)});
  if(reduce){ var s=document.getElementById('scan'); s.querySelector('animate').remove(); }

  /* Regelkreis: Block und Karte gemeinsam hervorheben */
  function link(k,on){ document.querySelectorAll('[data-k="'+k+'"]').forEach(function(e){e.classList.toggle('hl',on)}); }
  document.querySelectorAll('[data-k]').forEach(function(e){
    var k=e.getAttribute('data-k');
    e.addEventListener('mouseenter',function(){link(k,true)}); e.addEventListener('mouseleave',function(){link(k,false)});
  });

  /* Prozessleiste: aktives Blatt und Fortschritt */
  var links=[].slice.call(document.querySelectorAll('.rail a')), secs=links.map(function(a){return document.querySelector(a.getAttribute('href'))});
  var fill=document.getElementById('fill'), pct=document.getElementById('pct'), ol=document.querySelector('.rail ol');
  function update(){
    var mid=window.innerHeight*0.35, active=0;
    secs.forEach(function(s,i){ if(s.getBoundingClientRect().top<mid) active=i; });
    links.forEach(function(a,i){ a.classList.toggle('on',i===active); a.classList.toggle('done',i<active); });
    var first=secs[0].getBoundingClientRect().top+window.scrollY, last=secs[secs.length-1].getBoundingClientRect().bottom+window.scrollY-window.innerHeight;
    var p=Math.max(0,Math.min(1,(window.scrollY-first+mid)/(last-first+mid)));
    if(window.scrollY+window.innerHeight>=document.documentElement.scrollHeight-4) p=1;
    pct.textContent=Math.round(p*100)+' %';
    var a0=links[0].querySelector('.n'), aN=links[links.length-1].querySelector('.n');
    var span=aN.getBoundingClientRect().top-a0.getBoundingClientRect().top;
    fill.style.height=(span*p)+'px';
    var cur=links[active]; if(ol.scrollWidth>ol.clientWidth){ ol.scrollLeft=cur.parentElement.offsetLeft-16; }
  }
  window.addEventListener('scroll',update,{passive:true}); window.addEventListener('resize',update); update();
})();
