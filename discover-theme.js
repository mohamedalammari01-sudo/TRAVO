(()=>{
 function key(){return localStorage.getItem('travo-city')||'riyadh'}
 function apply(){
  const k=key();
  window.TRAVO_APPLY_DESTINATION_THEME?.(k,{target:'discover'});
  const sources=document.querySelector('.source-section');
  if(sources)sources.style.display='none';
 }
 function mergeCity(target,incoming){
  const map=new Map((target||[]).map(x=>[x.id,x]));
  (incoming||[]).forEach(x=>map.set(x.id,x));
  return [...map.values()];
 }
 async function loadUtd(){
  try{
   const r=await fetch('/data/utd-events.json',{cache:'no-store'});if(!r.ok)return;
   const utd=await r.json();
   if(typeof trends!=='undefined'){
    trends.cities=trends.cities||{};
    Object.entries(utd.cities||{}).forEach(([k,list])=>{trends.cities[k]=mergeCity(trends.cities[k],list)});
    const a=new Date(trends.updatedAt||0),b=new Date(utd.updatedAt||0);if(b>a)trends.updatedAt=utd.updatedAt;
    if(typeof render==='function')render();
   }
  }catch{}
 }
 const cityTitle=document.getElementById('cityTitle');
 if(cityTitle)new MutationObserver(()=>setTimeout(apply,0)).observe(cityTitle,{childList:true,subtree:true,characterData:true});
 document.getElementById('changeCityBtn')?.addEventListener('click',()=>setTimeout(apply,20));
 document.getElementById('discoverCity')?.addEventListener('keydown',e=>{if(e.key==='Enter')setTimeout(apply,20)});
 setTimeout(apply,0);setTimeout(loadUtd,0);
})();
