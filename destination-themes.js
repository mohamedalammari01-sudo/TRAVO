window.TRAVO_SAUDI_GALLERY=[
  {key:'riyadh',labelAr:'الرياض',labelEn:'Riyadh',image:'https://images.unsplash.com/photo-1674822858255-fcc093a1ef43?auto=format&fit=crop&w=1800&q=88',sourceName:'Unsplash',sourceUrl:'https://unsplash.com/'},
  {key:'jeddah',labelAr:'جدة',labelEn:'Jeddah',image:'https://book.txsaudi.com/Images2/eXchange/3cd49b18-7500-4f31-881a-06cccb9d842a.jpg',sourceName:'Visit Saudi',sourceUrl:'https://www.visitsaudi.com/'},
  {key:'alula',labelAr:'العلا',labelEn:'AlUla',image:'https://images.unsplash.com/photo-1738006996209-40401cbd3664?auto=format&fit=crop&w=1800&q=88',sourceName:'Unsplash',sourceUrl:'https://unsplash.com/'},
  {key:'saudi-nature',labelAr:'طبيعة السعودية',labelEn:'Saudi nature',image:'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1800&q=88',sourceName:'Unsplash',sourceUrl:'https://unsplash.com/'}
];

/*
  Every image in this list is tied to the named destination. Do not put a
  regional image here: an unknown destination should use its own colour cover
  while its photo is being located, never a photo of another city.
*/
window.TRAVO_DESTINATION_MEDIA={
  riyadh:window.TRAVO_SAUDI_GALLERY[0],
  jeddah:window.TRAVO_SAUDI_GALLERY[1],
  alula:window.TRAVO_SAUDI_GALLERY[2],
  taif:{image:'https://book.txsaudi.com/Images2/eXchange/bdfa37d7-6802-402b-be17-5745220c44ca.jpg',sourceName:'Visit Saudi',sourceUrl:'https://www.visitsaudi.com/ar/taif'},
  'al-ahsa':{image:'https://www.visitsaudi.com/content/dam/wvs/stories/qaysariah-souq.jpg',sourceName:'Visit Saudi',sourceUrl:'https://www.visitsaudi.com/ar/see-do/destinations/al-ahsa'},
  diriyah:{image:'https://static.hiamag.com/tv/%D9%85%D9%86%D9%89-%D8%A7%D9%84%D8%B7%D8%B1%D9%8A%D9%81.jpg',sourceName:'الطريف، الدرعية',sourceUrl:'https://www.hiamag.com/video/%D8%AA%D8%B1%D9%81%D9%8A%D9%87-%D9%88%D9%81%D9%86%D9%88%D9%86/1615821-%D9%86%D9%85%D9%88%D8%B0%D8%AC-%D8%B1%D8%A7%D8%A6%D8%B9-%D9%85%D9%86-%D8%B4%D8%A7%D8%A8%D8%A7%D8%AA-%D8%A7%D9%84%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9-%D9%85%D9%86%D9%89-%D8%A7%D9%84%D8%B7%D8%B1%D9%8A%D9%81-%D8%AD%D8%AF%D8%AB%D8%AA%D9%86%D8%A7-%D8%B9%D9%86-%D8%A3%D9%87%D9%85%D9%8A%D8%A9-%D8%A7%D9%84%D8%AF%D8%B1%D8%B9%D9%8A%D8%A9-%D8%A7%D9%84%D8%AA%D8%A7%D8%B1%D9%8A%D8%AE%D9%8A%D8%A9'},
  hofuf:{image:'https://www.alwatan.com.sa/uploads/images/2022/01/01/759873.JPG',sourceName:'وسط الهفوف التاريخي',sourceUrl:'https://www.alwatan.com.sa/article/1096696'},
  qatif:{image:'https://www.alriyadh.com/media/article/2024/04/03/img/6635360468.jpg',sourceName:'القطيف',sourceUrl:'https://www.alriyadh.com/2068594'},
  tarout:{image:'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/d6/98/b6/overview-of-market-and.jpg?h=1400&s=1&w=1400',sourceName:'قلعة تاروت',sourceUrl:'https://www.tripadvisor.com/Attraction_Review-g14980406-d10538936-Reviews-Tarout_Castle-Al_Qatif_Eastern_Province.html'}
};

window.TRAVO_DESTINATION_THEMES={
  riyadh:{countryAr:'السعودية',countryEn:'Saudi Arabia',flag:'🇸🇦',c1:'#8b5cf6',c2:'#c4b5fd'},
  jeddah:{countryAr:'السعودية',countryEn:'Saudi Arabia',flag:'🇸🇦',c1:'#0ea5a8',c2:'#7dd3fc'},
  alula:{countryAr:'السعودية',countryEn:'Saudi Arabia',flag:'🇸🇦',c1:'#9a5a39',c2:'#f2bf7e'},
  taif:{countryAr:'السعودية',countryEn:'Saudi Arabia',flag:'🇸🇦',c1:'#7c3c9d',c2:'#f0abfc'},
  abha:{countryAr:'السعودية',countryEn:'Saudi Arabia',flag:'🇸🇦',c1:'#0f766e',c2:'#67e8c9'},
  khobar:{countryAr:'السعودية',countryEn:'Saudi Arabia',flag:'🇸🇦',c1:'#1d4ed8',c2:'#67e8f9'},
  dammam:{countryAr:'السعودية',countryEn:'Saudi Arabia',flag:'🇸🇦',c1:'#1d4ed8',c2:'#67e8f9'},
  diriyah:{countryAr:'السعودية',countryEn:'Saudi Arabia',flag:'🇸🇦',c1:'#8a5a2b',c2:'#e8be83'},
  hail:{countryAr:'السعودية',countryEn:'Saudi Arabia',flag:'🇸🇦',c1:'#b45309',c2:'#fbbf24'},
  tabuk:{countryAr:'السعودية',countryEn:'Saudi Arabia',flag:'🇸🇦',c1:'#047857',c2:'#6ee7b7'},
  umluj:{countryAr:'السعودية',countryEn:'Saudi Arabia',flag:'🇸🇦',c1:'#0369a1',c2:'#67e8f9'}
};

/* Regional themes only control colour. Images must always be destination-specific. */
window.TRAVO_REGION_THEMES={
  riyadh:{c1:'#8b5cf6',c2:'#c4b5fd'},
  makkah:{c1:'#0ea5a8',c2:'#7dd3fc'},
  madinah:{c1:'#9a5a39',c2:'#f2bf7e'},
  eastern:{c1:'#1d4ed8',c2:'#67e8f9'},
  asir:{c1:'#0f766e',c2:'#67e8c9'},
  'al-baha':{c1:'#15803d',c2:'#a3e635'},
  jazan:{c1:'#047857',c2:'#6ee7b7'},
  tabuk:{c1:'#0369a1',c2:'#67e8f9'},
  hail:{c1:'#b45309',c2:'#fbbf24'},
  qassim:{c1:'#a16207',c2:'#fde68a'},
  'northern-borders':{c1:'#475569',c2:'#cbd5e1'},
  'al-jouf':{c1:'#4d7c0f',c2:'#bef264'},
  najran:{c1:'#9f1239',c2:'#fda4af'}
};

const mediaFor=cityKey=>window.TRAVO_DESTINATION_MEDIA?.[cityKey]||null;
const cssImage=media=>media?.image?`url('${String(media.image).replaceAll("'","%27")}')`:null;
const safeStorage={get(key){try{return JSON.parse(sessionStorage.getItem(key)||'null')}catch{return null}},set(key,value){try{sessionStorage.setItem(key,JSON.stringify(value))}catch{}}};
const compact=value=>String(value||'').toLocaleLowerCase().replace(/[\s\-_'’`،,.()]/g,'').replace(/[اأإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي');
const firstHighlight=(item,lang)=>String(lang==='ar'?item?.highlightsAr:item?.highlightsEn||'').split(lang==='ar'?'،':',')[0]?.trim();

function destinationFor(cityKey){return (window.TRAVO_AIRPORTS||[]).find(item=>item.cityKey===cityKey)}
function photoSearchTerms(item){
  return [item?.cityAr,item?.cityEn,firstHighlight(item,'ar'),firstHighlight(item,'en')]
    .map(compact).filter(term=>term.length>2);
}
function isDestinationFile(page,item){
  const label=compact(`${page.title||''} ${page.imageinfo?.[0]?.extmetadata?.ImageDescription?.value||''}`);
  return photoSearchTerms(item).some(term=>label.includes(term));
}
function destinationPhotoScore(page,item){
  const title=String(page.title||'');
  let score=photoSearchTerms(item).filter(term=>compact(title).includes(term)).length*25;
  if(/hotel|resort|logo|flag|map|airport|school|stadium|mall/i.test(title))score-=80;
  if(/mountain|road|sunset|view|valley|beach|island|oasis|castle|heritage|old town|village|desert|cave|waterfall|coast|forest|rock/i.test(title))score+=35;
  return score;
}
function commonsPageUrl(title){
  return `https://commons.wikimedia.org/wiki/${encodeURIComponent(String(title||'').replaceAll(' ','_'))}`;
}

/*
  Smaller towns and villages are resolved on demand from Wikimedia Commons.
  The filter accepts only a file whose title/description contains the selected
  place or one of its own landmarks. If none is found we deliberately keep
  the destination colour cover rather than display another city's photograph.
*/
window.TRAVO_GET_DESTINATION_PHOTO=async function(cityKey){
  const fixed=mediaFor(cityKey);
  if(fixed)return fixed;
  const item=destinationFor(cityKey);
  if(!item)return null;
  const cached=safeStorage.get(`travo:destination-photo:v2:${cityKey}`);
  if(cached?.image)return cached;
  const query=[item.cityEn||item.cityAr,'Saudi Arabia'].filter(Boolean).join(' ');
  const endpoint=new URL('https://commons.wikimedia.org/w/api.php');
  endpoint.search=new URLSearchParams({
    action:'query',format:'json',formatversion:'2',generator:'search',gsrsearch:query,
    gsrnamespace:'6',gsrlimit:'12',prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'1800',origin:'*'
  }).toString();
  try{
    const response=await fetch(endpoint,{headers:{Accept:'application/json'}});
    if(!response.ok)return null;
    const pages=(await response.json())?.query?.pages||[];
    const page=pages
      .filter(candidate=>candidate?.imageinfo?.[0]?.thumburl&&isDestinationFile(candidate,item))
      .sort((a,b)=>destinationPhotoScore(b,item)-destinationPhotoScore(a,item))[0];
    if(!page)return null;
    const photo={
      image:page.imageinfo[0].thumburl,
      sourceName:'Wikimedia Commons',
      sourceUrl:commonsPageUrl(page.title)
    };
    safeStorage.set(`travo:destination-photo:v2:${cityKey}`,photo);
    return photo;
  }catch{return null}
};

window.TRAVO_APPLY_DESTINATION_IMAGE=function(cityKey,media,opts={}){
  const direct=window.TRAVO_DESTINATION_THEMES?.[cityKey];
  const destination=destinationFor(cityKey);
  const regional=destination&&window.TRAVO_REGION_THEMES?.[destination.regionKey];
  const theme=direct||(regional?{countryAr:'السعودية',countryEn:'Saudi Arabia',flag:'🇸🇦',...regional}:null);
  if(!theme)return null;
  const root=document.documentElement;
  const visual=cssImage(media)||`linear-gradient(135deg,${theme.c1},${theme.c2})`;
  if(opts.target==='discover')root.style.setProperty('--discover-image',visual);
  else root.style.setProperty('--trip-hero',visual);
  return {...theme,...(media||{})};
};

window.TRAVO_RESET_BRAND_THEME=function(){
  const root=document.documentElement;
  root.style.setProperty('--p','#8b5cf6');
  root.style.setProperty('--p2','#c084fc');
};

window.TRAVO_APPLY_DESTINATION_THEME=function(cityKey,opts={}){
  const direct=window.TRAVO_DESTINATION_THEMES?.[cityKey];
  const destination=destinationFor(cityKey);
  const regional=destination&&window.TRAVO_REGION_THEMES?.[destination.regionKey];
  const theme=direct||(regional?{countryAr:'السعودية',countryEn:'Saudi Arabia',flag:'🇸🇦',...regional}:null);
  if(!theme)return null;
  const root=document.documentElement;
  root.style.setProperty('--p',theme.c1);
  root.style.setProperty('--p2',theme.c2);
  return window.TRAVO_APPLY_DESTINATION_IMAGE(cityKey,mediaFor(cityKey),opts);
};

(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .home-hero-overlay{background:linear-gradient(90deg,rgba(20,11,38,.96) 0%,rgba(74,40,112,.62) 48%,rgba(139,92,246,.18) 100%)!important}
    html[dir=rtl] .home-hero-overlay{background:linear-gradient(270deg,rgba(20,11,38,.96) 0%,rgba(74,40,112,.62) 48%,rgba(139,92,246,.18) 100%)!important}
    .discover-overlay{background:linear-gradient(90deg,rgba(20,11,38,.94),rgba(100,62,150,.30))!important}
    .trip-hero-shade{background:linear-gradient(90deg,rgba(20,11,38,.94),rgba(100,62,150,.20))!important}
  `;
  document.head.appendChild(style);
})();

window.TRAVO_RESET_BRAND_THEME();
