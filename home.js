const H={
  ar:{
    tagline:'دليلك للسياحة الداخلية السعودية',home:'الرئيسية',discover:'اكتشف',trip:'خطط رحلتك',ai:'مساعد السياحة',destinations:'وجهات',
    hero:'اكتشف السعودية<br>بطريقتك.',heroSub:'فعاليات، أنشطة ومواقع تستحق الزيارة في وجهات المملكة—من دون تسجيل في هذه المرحلة.',start:'استكشف وجهة سعودية ✦',openDiscover:'خطط مشوارك ✈',
    whatTitle:'وش تبي تسوي في السعودية؟',whatSub:'اختر الوجهة أو نوع التجربة، وابدأ الاستكشاف مباشرة.',sEvents:'فعاليات ومواسم',sEventsSub:'تابع ما يستحق الزيارة، مع روابط المصدر والحجز عند توفرها.',
    sActivities:'أنشطة وتجارب',sActivitiesSub:'مغامرات، طبيعة، ثقافة وتجارب تناسب أسلوب رحلتك.',sPlaces:'مواقع ومعالم',sPlacesSub:'أماكن تراثية وطبيعية ومدن تستحق أن تكون في جدولك.',
    sTrip:'خطط مشوارك',sTripSub:'اختر وجهتك السعودية واهتماماتك، وخذ بداية جدول تناسبك.',nearTitle:'وش يستاهل يكون حولك؟',nearSub:'اختر نوع التجربة، وTRAVO يساعدك في العثور على أماكن قريبة أثناء رحلتك داخل المملكة.',
    nearPh:'مثال: ممشى أو معلم تاريخي',locate:'استخدم موقعي',search:'اعرض الأقرب',landmark:'معلم سياحي',family:'نشاط عائلي',nature:'طبيعة وممشى',beach:'شاطئ',museum:'متحف',adventure:'مغامرات',food:'أكل محلي',coffee:'قهوة',
    nearState:'حدد موقعك ثم اختر تجربة أو مكانًا سياحيًا؛ TRAVO يعرض لك الخيارات القريبة.',located:'تم تحديد موقعك. اختر تجربة أو اكتب الشيء الذي تبحث عنه.',locFail:'تعذر أخذ موقعك. اسمح للموقع من المتصفح حتى نرتب الخيارات حولك.',needQuery:'اكتب نوع المكان أو التجربة أولًا.',searching:'TRAVO يبحث حولك ويرتب الخيارات القريبة…',noPlaces:'ما لقينا نتائج قريبة كفاية بهذا البحث. جرّب كلمة أبسط.',distance:'يبعد',reviews:'مراجعة',open:'مفتوح الآن',closed:'مغلق الآن',ratingSoon:'تظهر التقييمات بعد ربط محرك الأماكن الكامل.'
  },
  en:{
    tagline:'Your Saudi domestic tourism guide',home:'Home',discover:'Discover',trip:'Plan a trip',ai:'Tourism assistant',destinations:'Destinations',
    hero:'Discover Saudi<br>your way.',heroSub:'Events, activities and places worth visiting across the Kingdom—no sign-in required at this stage.',start:'Explore a Saudi destination ✦',openDiscover:'Plan your outing ✈',
    whatTitle:'What do you want to do in Saudi?',whatSub:'Choose a destination or experience, then start exploring right away.',sEvents:'Events & seasons',sEventsSub:'Follow what is worth visiting, with source and booking links when available.',
    sActivities:'Activities & experiences',sActivitiesSub:'Adventure, nature, culture and experiences for your trip style.',sPlaces:'Places & landmarks',sPlacesSub:'Heritage sites, nature and destinations worth adding to your plan.',
    sTrip:'Plan your outing',sTripSub:'Choose a Saudi destination and interests, then get a useful trip starting point.',nearTitle:'What is worth visiting near you?',nearSub:'Choose an experience type and TRAVO helps find nearby options during your Saudi trip.',
    nearPh:'Example: promenade or heritage landmark',locate:'Use my location',search:'Show nearby',landmark:'Landmark',family:'Family activity',nature:'Nature & walk',beach:'Beach',museum:'Museum',adventure:'Adventure',food:'Local food',coffee:'Coffee',
    nearState:'Share your location, then choose a tourism experience or place; TRAVO shows nearby options.',located:'Location received. Choose an experience or type what you are looking for.',locFail:'We could not access your location. Allow browser location so TRAVO can rank nearby options.',needQuery:'Enter a place or experience type first.',searching:'TRAVO is finding nearby options…',noPlaces:'We could not find enough nearby results. Try a simpler search term.',distance:'away',reviews:'reviews',open:'Open now',closed:'Closed now',ratingSoon:'Ratings will appear after the places engine is connected.'
  }
};

let homeLang=localStorage.getItem('travo-lang')||'ar';
let coords=null;
const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
const t=k=>H[homeLang][k]||k;

function applyHomeLang(){
  document.documentElement.lang=homeLang;
  document.documentElement.dir=homeLang==='ar'?'rtl':'ltr';
  localStorage.setItem('travo-lang',homeLang);
  qa('[data-h]').forEach(el=>{const value=H[homeLang][el.dataset.h];if(value)el.innerHTML=value});
  qa('[data-h-ph]').forEach(el=>{const value=H[homeLang][el.dataset.hPh];if(value)el.placeholder=value});
  q('#homeLang').textContent=homeLang==='ar'?'EN':'عربي';
}

q('#homeLang').onclick=()=>{homeLang=homeLang==='ar'?'en':'ar';applyHomeLang()};
qa('#nearChips button').forEach(btn=>btn.onclick=()=>{
  q('#nearQuery').value=homeLang==='ar'?btn.dataset.q:btn.querySelector('span')?.textContent||btn.dataset.q;
  q('#nearQuery').focus();
});

function getLocation(){
  return new Promise((resolve,reject)=>{
    if(!navigator.geolocation){reject(new Error('NO_GEO'));return}
    navigator.geolocation.getCurrentPosition(pos=>{
      coords={lat:pos.coords.latitude,lng:pos.coords.longitude};
      q('#nearState').textContent=t('located');
      q('#nearState').classList.add('ready');
      resolve(coords);
    },()=>{
      q('#nearState').textContent=t('locFail');
      q('#nearState').classList.remove('ready');
      reject(new Error('DENIED'));
    },{enableHighAccuracy:false,timeout:9000,maximumAge:180000});
  });
}

q('#locateBtn').onclick=async()=>{
  q('#nearState').textContent=homeLang==='ar'?'جارٍ تحديد موقعك…':'Getting your location…';
  try{await getLocation()}catch{}
};

function placeCard(place){
  const rating=place.rating!=null?`<span class="near-rating">★ ${Number(place.rating).toFixed(1)}${place.reviews!=null?` <small>(${Number(place.reviews).toLocaleString()} ${t('reviews')})</small>`:''}</span>`:'<span class="near-rating muted-rating">☆ —</span>';
  const status=place.openNow===true?`<span class="open-now">● ${t('open')}</span>`:place.openNow===false?`<span class="closed-now">● ${t('closed')}</span>`:'';
  const distance=place.distanceKm!=null?`${Number(place.distanceKm).toFixed(1)} km ${t('distance')}`:'';
  return `<article class="near-place-card"><div class="near-place-top"><div><span class="near-type">${place.type||''}</span><h3>${place.name||''}</h3></div>${rating}</div><p>${place.address||''}</p><div class="near-place-foot"><span>📍 ${distance}</span>${status}</div></article>`;
}

async function searchNearby(){
  const term=q('#nearQuery').value.trim();
  if(!term){q('#nearState').textContent=t('needQuery');q('#nearQuery').focus();return}
  if(!coords){
    q('#nearState').textContent=homeLang==='ar'?'نحتاج موقعك أولًا…':'We need your location first…';
    try{await getLocation()}catch{return}
  }
  q('#nearState').textContent=t('searching');q('#nearResults').innerHTML='';q('#nearProvider').textContent='';
  try{
    const response=await fetch('/api/nearby',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lat:coords.lat,lng:coords.lng,query:term,language:homeLang,radius:6000})});
    const result=await response.json();
    if(!response.ok)throw new Error();
    const places=Array.isArray(result.places)?result.places:[];
    q('#nearResults').innerHTML=places.map(placeCard).join('');
    q('#nearState').textContent=places.length?(homeLang==='ar'?`عرضنا لك أقرب ${places.length} خيارات حسب موقعك.`:`Showing the nearest ${places.length} options around you.`):t('noPlaces');
    q('#nearProvider').textContent=result.provider==='Google Places'?'Powered by Google':(result.ratingsAvailable===false?t('ratingSoon'):'' );
  }catch{q('#nearState').textContent=t('noPlaces')}
}

q('#nearSearchBtn').onclick=searchNearby;
q('#nearQuery').addEventListener('keydown',event=>{if(event.key==='Enter')searchNearby()});

function startSaudiVisuals(){
  const gallery=(window.TRAVO_SAUDI_GALLERY||[]).filter(item=>item.image);
  const first=q('#saudiHeroA'),second=q('#saudiHeroB');
  if(!gallery.length||!first||!second)return;
  let index=0,front=first,back=second;
  front.style.backgroundImage=`url('${gallery[0].image}')`;
  front.classList.add('active');back.classList.remove('active');
  const rotate=()=>{
    index=(index+1)%gallery.length;
    back.style.backgroundImage=`url('${gallery[index].image}')`;
    requestAnimationFrame(()=>{back.classList.add('active');front.classList.remove('active');const old=front;front=back;back=old});
  };
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)setInterval(rotate,8500);
}

window.TRAVO_RESET_BRAND_THEME?.();
applyHomeLang();
startSaudiVisuals();
