(()=>{
  const style=document.createElement('link');style.rel='stylesheet';style.href='trip-apps.css';document.head.appendChild(style);
  const $=selector=>document.querySelector(selector);
  const lang=()=>localStorage.getItem('travo-lang')||'ar';
  const generic={transport:['Google Maps','Careem'],food:['HungerStation','Jahez'],booking:['Almosafer','Booking.com'],public:['SAPTCO'],sim:['mystc','Mobily'],events:['webook','روح السعودية']};
  const DATA={
    riyadh:{transport:['Careem','Uber','Google Maps'],food:['HungerStation','Jahez'],booking:['Almosafer','Booking.com'],public:['Darb','Riyadh Bus'],sim:['mystc','Mobily'],events:['webook','روح السعودية']},
    jeddah:{transport:['Careem','Uber','Google Maps'],food:['HungerStation','Jahez'],booking:['Almosafer','Booking.com'],public:['Haramain Train','SAPTCO'],sim:['mystc','Mobily'],events:['webook','روح السعودية']},
    alula:{transport:['Google Maps','Careem'],food:['Jahez','HungerStation'],booking:['Experience AlUla','Booking.com'],public:['Experience AlUla'],sim:['mystc','Mobily'],events:['Experience AlUla','روح السعودية']},
    taif:{transport:['Google Maps','Careem'],food:['HungerStation','Jahez'],booking:['Almosafer','Booking.com'],public:['SAPTCO'],sim:['mystc','Mobily'],events:['webook','روح السعودية']},
    abha:{transport:['Google Maps','Careem'],food:['HungerStation','Jahez'],booking:['Almosafer','Booking.com'],public:['SAPTCO'],sim:['mystc','Mobily'],events:['webook','روح السعودية']},
    khobar:{transport:['Careem','Uber','Google Maps'],food:['HungerStation','Jahez'],booking:['Almosafer','Booking.com'],public:['SAPTCO'],sim:['mystc','Mobily'],events:['webook','روح السعودية']},
    dammam:{transport:['Careem','Uber','Google Maps'],food:['HungerStation','Jahez'],booking:['Almosafer','Booking.com'],public:['SAPTCO'],sim:['mystc','Mobily'],events:['webook','روح السعودية']},
    diriyah:{transport:['Careem','Uber','Google Maps'],food:['HungerStation','Jahez'],booking:['Diriyah','Booking.com'],public:['Darb','Riyadh Bus'],sim:['mystc','Mobily'],events:['Diriyah','روح السعودية']},
    hail:{transport:['Google Maps','Careem'],food:['HungerStation','Jahez'],booking:['Almosafer','Booking.com'],public:['SAPTCO'],sim:['mystc','Mobily'],events:['webook','روح السعودية']},
    tabuk:{transport:['Google Maps','Careem'],food:['HungerStation','Jahez'],booking:['Almosafer','Booking.com'],public:['SAPTCO'],sim:['mystc','Mobily'],events:['webook','روح السعودية']},
    umluj:{transport:['Google Maps','Careem'],food:['HungerStation','Jahez'],booking:['Almosafer','Booking.com'],public:['SAPTCO'],sim:['mystc','Mobily'],events:['webook','روح السعودية']}
  };
  const meta={
    transport:{icon:'🚕',labelAr:'التنقّل',labelEn:'Getting around',titleAr:'تاكسي وتنقّل داخل المدينة',titleEn:'Taxis and city rides',descAr:'للوصول للمواقع وتنظيم مشاوير اليوم.',descEn:'For getting to each stop and keeping the day moving.'},
    food:{icon:'🍽',labelAr:'الأكل',labelEn:'Food & dining',titleAr:'مطاعم وطلب طعام',titleEn:'Food, bookings and delivery',descAr:'للبحث عن الأكل أو طلبه حسب خطتك.',descEn:'Find, reserve or order food around your plan.'},
    booking:{icon:'🏨',labelAr:'الحجوزات',labelEn:'Bookings',titleAr:'فنادق وأنشطة وحجوزات',titleEn:'Hotels, activities and bookings',descAr:'لحجز السكن أو تجربة تحتاج تأكيدًا.',descEn:'Reserve a stay or an experience that needs confirmation.'},
    public:{icon:'🚇',labelAr:'النقل العام',labelEn:'Public transport',titleAr:'قطارات وباصات',titleEn:'Trains and buses',descAr:'للمسارات الطويلة والتنقل بين المدن.',descEn:'For longer routes and travel between cities.'},
    sim:{icon:'📶',labelAr:'الإنترنت',labelEn:'Connectivity',titleAr:'شريحة وبيانات',titleEn:'SIM and mobile data',descAr:'لتبقى متصلًا طوال الرحلة.',descEn:'Stay connected throughout the trip.'},
    events:{icon:'🎟',labelAr:'الفعاليات',labelEn:'Events',titleAr:'تذاكر ومواسم',titleEn:'Tickets and seasons',descAr:'لمعرفة الفعاليات التي تناسب تاريخك.',descEn:'Check what aligns with your trip dates.'}
  };
  function keyFromValue(value){return window.TRAVO_FIND_CITY?.(value)?.cityKey||null}
  function destinationKey(){try{const draft=JSON.parse(localStorage.getItem('travo-trip-draft')||'{}');return draft?.payload?.destinationKey||keyFromValue($('#destination')?.value)||null}catch{return keyFromValue($('#destination')?.value)}}
  function applyTheme(key){if(!key)return;const theme=window.TRAVO_APPLY_DESTINATION_THEME?.(key);if(!theme)return;let chip=$('.destination-chip');if(!chip){chip=document.createElement('span');chip.className='destination-chip';$('.trip-hero-copy')?.appendChild(chip)}const airport=(window.TRAVO_AIRPORTS||[]).find(item=>item.cityKey===key);chip.textContent=`${theme.flag} ${lang()==='ar'?(airport?.cityAr||'')+' • '+theme.countryAr:(airport?.cityEn||'')+' • '+theme.countryEn}`}
  function appCard(key,apps){const item=meta[key],arabic=lang()==='ar';return `<article class="travel-app-card"><div class="travel-app-icon" aria-hidden="true">${item.icon}</div><div class="travel-app-copy"><span class="travel-app-label">${arabic?item.labelAr:item.labelEn}</span><h4>${arabic?item.titleAr:item.titleEn}</h4><p>${arabic?item.descAr:item.descEn}</p></div><div class="app-chip-row">${apps.map(app=>`<span>${app}</span>`).join('')}</div></article>`}
  function renderApps(){const itinerary=$('#fullItinerary');if(!itinerary||!itinerary.innerHTML.trim())return;const key=destinationKey();if(!key)return;applyTheme(key);let section=$('#travelAppsSection');if(!section){section=document.createElement('section');section.id='travelAppsSection';section.className='travel-apps-section';itinerary.insertAdjacentElement('afterend',section)}const airport=(window.TRAVO_AIRPORTS||[]).find(item=>item.cityKey===key),cityName=lang()==='ar'?(airport?.cityAr||key):(airport?.cityEn||key),items=DATA[key]||generic;section.innerHTML=`<div class="travel-apps-head"><div><p class="eyebrow">TRAVEL TOOLKIT</p><h3>${lang()==='ar'?`أدوات رحلتك في ${cityName}`:`Your trip tools in ${cityName}`}</h3><p>${lang()==='ar'?'كل ما تحتاجه للحجز والتنقّل والطعام والفعاليات في مكان واضح واحد.':'Everything for bookings, getting around, food and events in one clear place.'}</p></div></div><div class="travel-app-grid">${Object.keys(meta).map(key=>appCard(key,items[key]||generic[key]||[])).join('')}</div>`}
  const previous=window.applyDestinationTheme;window.applyDestinationTheme=function(raw){const key=keyFromValue(raw)||raw;const theme=window.TRAVO_APPLY_DESTINATION_THEME?.(key);if(!theme&&typeof previous==='function')return previous(raw);applyTheme(key);return theme};
  $('#destination')?.addEventListener('change',event=>applyTheme(keyFromValue(event.target.value)));$('#destination')?.addEventListener('input',event=>{const key=keyFromValue(event.target.value);if(key)applyTheme(key)});
  const observer=new MutationObserver(()=>renderApps());const itinerary=$('#fullItinerary');if(itinerary)observer.observe(itinerary,{childList:true,subtree:true});
  applyTheme(destinationKey()||'riyadh');renderApps();
})();
