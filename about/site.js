(()=>{
 const allowed=['de','en','fa','ar','tr','it','fr','ko','zh','ja','es','sq'];
 const url=new URL(location.href),lang=document.documentElement.lang;
 // Reuse the existing site preference; store it only after an explicit selection.
 if(!url.searchParams.has('lang')){try{const saved=localStorage.getItem('keyone-language');if(allowed.includes(saved)&&saved!==lang){url.searchParams.set('lang',saved);location.replace(url.pathname+url.search+url.hash);return}}catch{}}
 const select=document.getElementById('about-language');
 document.getElementById('about-language-apply').hidden=true;
 select.addEventListener('change',()=>{const next=select.value;if(!allowed.includes(next))return;try{localStorage.setItem('keyone-language',next)}catch{}url.searchParams.set('lang',next);location.assign(url.pathname+url.search+url.hash)});
 // Keep translated labels inside the original diagram geometry.
 function fit(){document.querySelectorAll('svg text').forEach(t=>{t.removeAttribute('textLength');t.removeAttribute('lengthAdjust');const svg=t.closest('svg'),x=Number(t.getAttribute('x'));let width=0;if(svg.closest('.diagram'))width=({36:120,336:130,556:140,416:140,800:88,625:190})[x]||0;else if(svg.id==='flowsvg')width=x===500?174:x===780?260:0;else if(svg.closest('.arch-sec'))width=210;if(width&&t.getComputedTextLength()>width){t.setAttribute('textLength',String(width));t.setAttribute('lengthAdjust','spacingAndGlyphs')}})}
 if(document.fonts)document.fonts.ready.then(fit);else fit();
})();
