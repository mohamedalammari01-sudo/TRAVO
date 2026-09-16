(()=>{
 function key(){return localStorage.getItem('travo-city')||'riyadh'}
 function apply(){
  const k=key();
  window.TRAVO_APPLY_DESTINATION_THEME?.(k,{target:'discover'});
  const sources=document.querySelector('.source-section');
  if(sources)sources.style.display='none';
 }
 const cityTitle=document.getElementById('cityTitle');
 if(cityTitle)new MutationObserver(()=>setTimeout(apply,0)).observe(cityTitle,{childList:true,subtree:true,characterData:true});
 document.getElementById('changeCityBtn')?.addEventListener('click',()=>setTimeout(apply,20));
 document.getElementById('discoverCity')?.addEventListener('keydown',e=>{if(e.key==='Enter')setTimeout(apply,20)});
 setTimeout(apply,0);
})();
