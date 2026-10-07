let lang=localStorage.getItem('travo-lang')||'ar';
let catalog={cities:{},updatedAt:null};
const params=new URLSearchParams(location.search);
const allowedViews=['events','concerts','activities','places','historical'];
let view=allowedViews.includes(params.get('view'))?params.get('view'):'events';
let city=params.get('city')||localStorage.getItem('travo-city')||'riyadh';
let directoryRegion='all';

const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];
const dictionary={
  ar:{
    home:'الرئيسية',discover:'اكتشف',trip:'خطط رحلتك',ai:'مساعد TRAVO',aiShort:'المساعد',destinations:'وجهات',brand:'اكتشف السعودية',
    prompt:'اختر وش تبغى تكتشف.',lead:'فعاليات ومواسم وأنشطة ومواقع وأماكن تاريخية تستحق الزيارة داخل المملكة فقط.',cityPlaceholder:'اختر مدينة أو وجهة سعودية',choose:'اختيار الوجهة',
    question:'وش ودك تشوف في {city}؟',categorySub:'رتّب استكشافك على حسب التجربة التي تهمك.',events:'فعاليات ومواسم',eventsSub:'ماذا تتابع قبل زيارة وجهتك',concerts:'حفلات مباشرة',concertsSub:'موعد ومكان وسعر التذكرة',activities:'أنشطة وتجارب',activitiesSub:'أفكار عملية ليومك',places:'مواقع ومعالم',placesSub:'أماكن طبيعية وتراثية تستحق الزيارة',historical:'أماكن تاريخية',historicalSub:'مواقع موثقة وقصص من تاريخ المملكة',
    viewEvents:['EVENTS & SEASONS','الفعاليات والمواسم','اقرأ الفكرة بسرعة ثم افتح المصدر الرسمي للتحقق من التفاصيل والحجز.'],
    viewConcerts:['LIVE CONCERTS','حفلات الرياض المباشرة','بطاقات من المصدر الرسمي تشمل الصورة والموعد والمكان والسعر الظاهر وقت التحديث. أكّد التوفر والسعر عند فتح الحجز.'],
    viewActivities:['ACTIVITIES','الأنشطة والتجارب','أفكار عملية لتعيش الوجهة، مع مصدر رسمي أو رابط موقع يساعدك في التخطيط.'],
    viewPlaces:['PLACES & LANDMARKS','المواقع والمعالم','أماكن تستحق أن تكون في جدولك؛ استخدم رابط الخريطة لتخطيط المسار.'],
    viewHistorical:['HISTORICAL PLACES','الأماكن التاريخية','مواقع تاريخية موثقة مع المصدر والخريطة؛ تحقّق من ساعات الزيارة ومتطلبات الدخول قبل التوجه.'],
    source:'المصدر',location:'الموقع',openSource:'فتح المصدر',openMap:'فتح الخريطة',bookNow:'الحجز والتفاصيل',updated:'دليل مراجع: ',emptyTitle:'ما أضفنا محتوى لهذه الوجهة بعد.',emptyText:'اختر وجهة سعودية أخرى أو عُد لاحقًا.',domestic:'دليل السياحة الداخلية',area:'المنطقة',price:'السعر',date:'الموعد',time:'الوقت',duration:'المدة',availability:'التوفر',
    directoryKicker:'دليل وجهات السعودية',directoryTitle:'استكشف السعودية حسب المنطقة',directorySub:'مدن ومحافظات وقرى ومواقع يقصدها الزوار للرحلات القصيرة والطويلة داخل المملكة.',allRegions:'كل المناطق',destinationCount:'{count} وجهة',openGuide:'فتح الدليل'
  },
  en:{
    home:'Home',discover:'Discover',trip:'Plan a trip',ai:'TRAVO Assistant',aiShort:'Assistant',destinations:'Destinations',brand:'Discover Saudi',
    prompt:'Choose what you want to explore.',lead:'Events, activities, places and historical sites worth visiting—inside Saudi Arabia only.',cityPlaceholder:'Choose a Saudi city or destination',choose:'Choose destination',
    question:'What do you want to explore in {city}?',categorySub:'Organise your discovery by the experience that interests you.',events:'Events & seasons',eventsSub:'What to check before your visit',concerts:'Live concerts',concertsSub:'Ticket price, venue and timing',activities:'Activities & experiences',activitiesSub:'Practical ideas for your day',places:'Places & landmarks',placesSub:'Natural and heritage places worth visiting',historical:'Historical places',historicalSub:'Verified sites and stories from Saudi history',
    viewEvents:['EVENTS & SEASONS','Events & seasons','Read the idea quickly, then use the official source to confirm details and booking.'],
    viewConcerts:['LIVE CONCERTS','Live concerts in Riyadh','Cards use the official listing image, date, venue and displayed ticket price. Confirm availability and price on the booking page.'],
    viewActivities:['ACTIVITIES','Activities & experiences','Practical ways to experience the destination, with an official source or map link for planning.'],
    viewPlaces:['PLACES & LANDMARKS','Places & landmarks','Places worth adding to your itinerary; use the map link to plan your route.'],
    viewHistorical:['HISTORICAL PLACES','Historical places','Verified historical sites with a source and map; confirm opening hours and access requirements before visiting.'],
    source:'Source',location:'Location',openSource:'Open source',openMap:'Open map',bookNow:'Book & details',updated:'Reviewed guide: ',emptyTitle:'We have not added content for this destination yet.',emptyText:'Choose another Saudi destination or return later.',domestic:'Domestic tourism guide',area:'Area',price:'Price',date:'Date',time:'Time',duration:'Duration',availability:'Availability',
    directoryKicker:'SAUDI DESTINATION DIRECTORY',directoryTitle:'Explore Saudi by region',directorySub:'Cities, governorates, villages and landmarks that visitors choose for short and longer trips across Saudi Arabia.',allRegions:'All regions',destinationCount:'{count} destinations',openGuide:'Open guide'
  }
};

const t=key=>dictionary[lang][key]||key;
const destination=(key=city)=>window.TRAVO_AIRPORTS?.find(item=>item.cityKey===key);
const cityName=(key=city)=>{const item=destination(key);return lang==='ar'?(item?.cityAr||key):(item?.cityEn||key)};
const mapUrl=query=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

function fillCities(){
  $('#discoverCities').innerHTML=(window.TRAVO_AIRPORTS||[])
    .filter(item=>catalog.cities?.[item.cityKey])
    .sort((a,b)=>(lang==='ar'?a.cityAr:a.cityEn).localeCompare(lang==='ar'?b.cityAr:b.cityEn,lang==='ar'?'ar':'en'))
    .map(item=>`<option value="${lang==='ar'?item.cityAr:item.cityEn}">${lang==='ar'?item.cityEn:item.cityAr}</option>`)
    .join('');
}

function directoryDestinations(){
  return (window.TRAVO_AIRPORTS||[])
    .filter(item=>catalog.cities?.[item.cityKey]&&item.isSaudiDestination!==false)
    .sort((a,b)=>(lang==='ar'?a.cityAr:a.cityEn).localeCompare(lang==='ar'?b.cityAr:b.cityEn,lang==='ar'?'ar':'en'));
}

function renderDestinationDirectory(){
  const filters=$('#regionFilters'),results=$('#destinationDirectoryResults');
  if(!filters||!results)return;
  const all=directoryDestinations();
  const regions=(window.TRAVO_SAUDI_REGIONS||[]).filter(region=>all.some(item=>item.regionKey===region.key));
  if(directoryRegion!=='all'&&!regions.some(region=>region.key===directoryRegion))directoryRegion='all';
  const selected=directoryRegion==='all'?all:all.filter(item=>item.regionKey===directoryRegion);
  $('#directoryKicker').textContent=t('directoryKicker');
  $('#directoryTitle').textContent=t('directoryTitle');
  $('#directorySub').textContent=t('directorySub');
  $('#destinationCount').textContent=t('destinationCount').replace('{count}',new Intl.NumberFormat(lang==='ar'?'ar-SA':'en').format(all.length));
  const filterList=[{key:'all',nameAr:t('allRegions'),nameEn:t('allRegions'),icon:'✦'},...regions];
  filters.innerHTML=filterList.map(region=>{
    const name=lang==='ar'?(region.nameAr||region.nameEn):(region.nameEn||region.nameAr);
    const count=region.key==='all'?all.length:all.filter(item=>item.regionKey===region.key).length;
    return `<button type="button" class="region-filter${directoryRegion===region.key?' active':''}" data-region="${escapeHtml(region.key)}"><span>${escapeHtml(region.icon||'📍')}</span>${escapeHtml(name)} <small>${count}</small></button>`;
  }).join('');
  results.innerHTML=selected.map(item=>{
    const name=lang==='ar'?(item.cityAr||item.cityEn):(item.cityEn||item.cityAr);
    const region=lang==='ar'?(item.regionAr||item.regionEn):(item.regionEn||item.regionAr);
    const type=lang==='ar'?(item.typeAr||'وجهة'):(item.typeEn||'Destination');
    const summary=lang==='ar'?(item.summaryAr||item.highlightsAr):(item.summaryEn||item.highlightsEn);
    const highlights=lang==='ar'?(item.highlightsAr||''):(item.highlightsEn||'');
    const href=`discover.html?city=${encodeURIComponent(item.cityKey)}&view=places`;
    return `<a class="destination-directory-card" href="${href}"><div class="destination-directory-meta"><span>${escapeHtml(region||'السعودية')}</span><b>${escapeHtml(type)}</b></div><h3>${escapeHtml(name)}</h3><p>${escapeHtml(summary||'')}</p>${highlights?`<small>✦ ${escapeHtml(highlights)}</small>`:''}<span class="destination-directory-open">${escapeHtml(t('openGuide'))} ←</span></a>`;
  }).join('');
}

function updatedLabel(){
  if(!catalog.updatedAt)return t('domestic');
  try{return t('updated')+new Intl.DateTimeFormat(lang==='ar'?'ar-SA':'en-GB',{dateStyle:'medium'}).format(new Date(catalog.updatedAt))}catch{return t('updated')+catalog.updatedAt}
}

function viewCopy(){
  if(view==='concerts')return dictionary[lang].viewConcerts;
  if(view==='activities')return dictionary[lang].viewActivities;
  if(view==='places')return dictionary[lang].viewPlaces;
  if(view==='historical')return dictionary[lang].viewHistorical;
  return dictionary[lang].viewEvents;
}

function itemIcon(){return view==='events'?'🎟':view==='concerts'?'🎶':view==='activities'?'⚡':view==='historical'?'🏛️':'📍'}

function guideCard(item){
  const title=lang==='ar'?(item.titleAr||item.titleEn):(item.titleEn||item.titleAr);
  const summary=lang==='ar'?(item.summaryAr||item.summaryEn):(item.summaryEn||item.summaryAr);
  const area=lang==='ar'?(item.areaAr||item.areaEn):(item.areaEn||item.areaAr);
  const price=lang==='ar'?(item.priceTextAr||item.priceTextEn):(item.priceTextEn||item.priceTextAr);
  const date=lang==='ar'?(item.dateAr||item.dateEn):(item.dateEn||item.dateAr);
  const time=lang==='ar'?(item.timeAr||item.timeEn):(item.timeEn||item.timeAr);
  const duration=lang==='ar'?(item.durationAr||item.durationEn):(item.durationEn||item.durationAr);
  const notice=(lang==='ar'?(item.noticeAr||item.noticeEn):(item.noticeEn||item.noticeAr))||(price?(lang==='ar'?'السعر والتوفر بحسب المصدر وقت التحديث؛ أكّدهما عند الحجز.':'Price and availability are shown as reviewed; confirm both when booking.'):'');
  const source=item.sourceUrl&&item.sourceUrl!==item.bookingUrl?`<a class="ghost mini-action" target="_blank" rel="noopener noreferrer" href="${escapeHtml(item.sourceUrl)}">${t('openSource')} ↗</a>`:'';
  const booking=item.bookingUrl?`<a class="primary mini-action" target="_blank" rel="noopener noreferrer" href="${escapeHtml(item.bookingUrl)}">${t('bookNow')} ↗</a>`:'';
  const map=item.mapQuery?`<a class="ghost mini-action" target="_blank" rel="noopener" href="${mapUrl(item.mapQuery)}">📍 ${t('openMap')}</a>`:'';
  const facts=[
    [t('location'),`📍 ${area||cityName()}`],
    price?[t('price'),price]:null,
    date?[t('date'),date]:null,
    time?[t('time'),time]:null,
    duration?[t('duration'),duration]:null
  ].filter(Boolean);
  const badge=lang==='ar'?(item.badgeAr||item.badgeEn):(item.badgeEn||item.badgeAr);
  const cover=item.imageUrl?`<div class="live-cover guide-cover"><img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(title)}" loading="lazy" referrerpolicy="no-referrer"><span class="live-status">${escapeHtml(badge||item.sourceName||'TRAVO')}</span></div>`:`<div class="guide-symbol" aria-hidden="true">${itemIcon()}</div>`;
  return `<article class="live-card guide-card">${cover}<div class="live-body"><div class="live-meta"><span>${escapeHtml(t('area'))}</span><span>${escapeHtml(item.sourceName||'TRAVO')}</span></div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(summary)}</p>${facts.length?`<div class="event-facts fact-list">${facts.map(([label,value])=>`<div><small>${escapeHtml(label)}</small><b>${escapeHtml(value)}</b></div>`).join('')}</div>`:''}${notice?`<p class="availability-note"><b>${escapeHtml(t('availability'))}: </b>${escapeHtml(notice)}</p>`:''}<div class="card-actions">${booking}${map}${source}</div></div></article>`;
}

function setActiveCategory(){
  $$('#categoryGrid button').forEach(button=>button.classList.toggle('active',button.dataset.view===view));
}

function render(){
  const [kicker,title,description]=viewCopy();
  $('#brandLabel').textContent=t('brand');
  $('#cityTitle').textContent=cityName();
  $('#discoverPrompt').textContent=t('prompt');
  $('#discoverLead').textContent=t('lead');
  $('#discoverCity').placeholder=t('cityPlaceholder');
  $('#changeCityBtn').textContent=t('choose');
  $('#categoryQuestion').textContent=t('question').replace('{city}',cityName());
  $('#categorySub').textContent=t('categorySub');
  $('#updatedLabel').textContent=updatedLabel();
  $('#dataFreshness').textContent=t('domestic');
  $('#viewKicker').textContent=kicker;
  $('#viewTitle').textContent=title;
  $('#viewDescription').textContent=description;
  const items=catalog.cities?.[city]?.[view]||[];
  $('#discoverResults').innerHTML=items.map(guideCard).join('');
  $('#emptyState').classList.toggle('hidden',Boolean(items.length));
  $('#emptyTitle').textContent=t('emptyTitle');
  $('#emptyText').textContent=t('emptyText');
  setActiveCategory();
}

function updateStaticText(){
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  localStorage.setItem('travo-lang',lang);
  $$('[data-d]').forEach(element=>{const copy=t(element.dataset.d);if(copy)element.textContent=copy});
  $('#discoverLang').textContent=lang==='ar'?'EN':'عربي';
  fillCities();
  render();
  renderDestinationDirectory();
}

function setCity(key){
  const selected=destination(key);
  city=selected&&catalog.cities?.[selected.cityKey]?selected.cityKey:'riyadh';
  localStorage.setItem('travo-city',city);
  const item=destination(city);
  $('#discoverCity').value=item?(lang==='ar'?item.cityAr:item.cityEn):'';
  const url=new URL(location.href);url.searchParams.set('city',city);url.searchParams.set('view',view);history.replaceState({},'',url);
  window.TRAVO_APPLY_DESTINATION_THEME?.(city,{target:'discover'});
  render();
}

$('#discoverLang').onclick=()=>{lang=lang==='ar'?'en':'ar';updateStaticText();setCity(city)};
$('#changeCityBtn').onclick=()=>{const selected=window.TRAVO_FIND_CITY?.($('#discoverCity').value);if(selected&&catalog.cities?.[selected.cityKey])setCity(selected.cityKey)};
$('#discoverCity').addEventListener('keydown',event=>{if(event.key==='Enter')$('#changeCityBtn').click()});
$('#regionFilters').onclick=event=>{
  const button=event.target.closest('[data-region]');
  if(!button)return;
  directoryRegion=button.dataset.region||'all';
  renderDestinationDirectory();
};
$$('#categoryGrid button').forEach(button=>button.onclick=()=>{
  view=button.dataset.view;
  const url=new URL(location.href);url.searchParams.set('view',view);history.replaceState({},'',url);
  render();
  $('#discoverResults').scrollIntoView({behavior:'smooth',block:'start'});
});

fetch('/data/saudi-discovery.json',{cache:'no-store'})
  .then(response=>response.ok?response.json():Promise.reject(new Error('CATALOG_UNAVAILABLE')))
  .then(data=>{
    catalog=window.TRAVO_ENSURE_SAUDI_CATALOG?.(data||{cities:{}})||data||{cities:{}};
    const requested=window.TRAVO_FIND_CITY?.(city);
    city=requested&&catalog.cities?.[requested.cityKey]?requested.cityKey:(catalog.cities?.[city]?city:'riyadh');
    updateStaticText();
    setCity(city);
  })
  .catch(()=>{
    catalog=window.TRAVO_ENSURE_SAUDI_CATALOG?.({cities:{}})||{cities:{}};
    updateStaticText();
  });
