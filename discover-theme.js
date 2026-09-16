(()=>{
 const saudiCities=new Set(['riyadh','jeddah','alula']);
 function key(){return localStorage.getItem('travo-city')||'riyadh'}
 function apply(){const k=key();window.TRAVO_APPLY_DESTINATION_THEME?.(k,{target:'discover'});const sources=document.querySelector('.source-section');if(sources)sources.style.display='none';if(saudiCities.has(k)){document.querySelectorAll('.live-cover').forEach(el=>{const bg=el.style.backgroundImage||'';if(!bg||bg.includes('unsplash.com'))el.style.backgroundImage=`url('${window.TRAVO_DEFAULT_SAUDI_IMAGE}')`})}}
 const results=document.getElementById('discoverResults');if(results)new MutationObserver(()=>setTimeout(apply,0)).observe(results,{childList:true,subtree:true});
 const cityTitle=document.getElementById('cityTitle');if(cityTitle)new MutationObserver(()=>setTimeout(apply,0)).observe(cityTitle,{childList:true,subtree:true,characterData:true});
 document.getElementById('changeCityBtn')?.addEventListener('click',()=>setTimeout(apply,20));document.getElementById('discoverCity')?.addEventListener('keydown',e=>{if(e.key==='Enter')setTimeout(apply,20)});
 setTimeout(apply,0);
})();
