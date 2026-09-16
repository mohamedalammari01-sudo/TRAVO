(()=>{
 const style=document.createElement('link');style.rel='stylesheet';style.href='trip-apps.css';document.head.appendChild(style);
 const $=s=>document.querySelector(s);
 const lang=()=>localStorage.getItem('travo-lang')||'ar';
 const generic={booking:['Booking.com','Agoda'],sim:['Airalo'],events:['Eventbrite']};
 const DATA={
  riyadh:{transport:['Careem','Uber'],food:['HungerStation','Jahez'],booking:['Almosafer','Booking.com'],public:['Riyadh Bus / Darb'],sim:['mystc','Mobily'],events:['webook']},
  jeddah:{transport:['Careem','Uber'],food:['HungerStation','Jahez'],booking:['Almosafer','Booking.com'],public:['Haramain Train','SAPTCO'],sim:['mystc','Mobily'],events:['webook']},
  alula:{transport:['Careem','Uber'],food:['Jahez'],booking:['Experience AlUla','Booking.com'],public:['Experience AlUla'],sim:['mystc','Mobily'],events:['Experience AlUla','webook']},
  dubai:{transport:['Careem','Uber'],food:['talabat','Deliveroo'],booking:['Booking.com','Visit Dubai'],public:['RTA Dubai'],sim:['e& UAE','Airalo'],events:['Dubai Calendar']},
  abudhabi:{transport:['Careem','Uber'],food:['talabat','Deliveroo'],booking:['Booking.com','Experience Abu Dhabi'],public:['Darb'],sim:['e& UAE','Airalo'],events:['Experience Abu Dhabi']},
  doha:{transport:['Karwa Taxi','Uber'],food:['Snoonu','talabat'],booking:['Booking.com'],public:['Qatar Rail'],sim:['Ooredoo Qatar','Airalo'],events:['Visit Qatar']},
  istanbul:{transport:['BiTaksi','Uber'],food:['Yemeksepeti','Getir'],booking:['Booking.com'],public:['Istanbulkart','Moovit'],sim:['Turkcell','Airalo'],events:['Biletix','GoTürkiye']},
  cairo:{transport:['Uber','Careem'],food:['talabat'],booking:['Booking.com'],public:['Moovit'],sim:['Vodafone Egypt','Orange Egypt'],events:['TicketsMarche','Experience Egypt']},
  london:{transport:['Uber','Bolt'],food:['OpenTable','Deliveroo'],booking:['Booking.com'],public:['TfL Go','Citymapper'],sim:['Airalo'],events:['TodayTix','Visit London']},
  paris:{transport:['G7','Uber'],food:['TheFork'],booking:['Booking.com'],public:['Bonjour RATP','Citymapper'],sim:['Orange Travel','Airalo'],events:['Paris je t’aime']},
  rome:{transport:['FREE NOW','Uber'],food:['TheFork'],booking:['Booking.com'],public:['Moovit','Trenitalia'],sim:['Airalo'],events:['TicketOne','Turismo Roma']},
  milan:{transport:['FREE NOW','Uber'],food:['TheFork'],booking:['Booking.com'],public:['ATM Milano','Trenitalia'],sim:['Airalo'],events:['TicketOne','YesMilano']},
  barcelona:{transport:['Cabify','Uber'],food:['TheFork'],booking:['Booking.com'],public:['TMB App'],sim:['Airalo'],events:['Fever','Barcelona Turisme']},
  madrid:{transport:['Cabify','Uber'],food:['TheFork'],booking:['Booking.com'],public:['EMT Madrid'],sim:['Airalo'],events:['Fever','Madrid Tourism']},
  amsterdam:{transport:['Uber','Bolt'],food:['TheFork'],booking:['Booking.com'],public:['9292','NS'],sim:['Airalo'],events:['I amsterdam']},
  zurich:{transport:['Uber'],food:['TheFork'],booking:['Booking.com'],public:['SBB Mobile'],sim:['Airalo'],events:['Zürich Tourism']},
  vienna:{transport:['Uber','Bolt'],food:['Quandoo'],booking:['Booking.com'],public:['WienMobil','ÖBB'],sim:['Airalo'],events:['Wien.info']},
  prague:{transport:['Bolt','Uber'],food:['Wolt'],booking:['Booking.com'],public:['PID Lítačka'],sim:['Airalo'],events:['GoOut','Prague City Tourism']},
  athens:{transport:['FREE NOW','Uber'],food:['efood'],booking:['Booking.com'],public:['OASA Telematics'],sim:['Airalo'],events:['This is Athens']},
  tokyo:{transport:['GO Taxi'],food:['Tabelog'],booking:['Booking.com','Klook'],public:['Japan Travel by NAVITIME'],sim:['Ubigi','Airalo'],events:['GO TOKYO']},
  bangkok:{transport:['Grab'],food:['LINE MAN','GrabFood'],booking:['Agoda'],public:['ViaBus'],sim:['AIS','Airalo'],events:['Tourism Thailand']},
  singapore:{transport:['Grab'],food:['Chope','GrabFood'],booking:['Agoda','Booking.com'],public:['MyTransport.SG'],sim:['Singtel hi!App','Airalo'],events:['Visit Singapore']},
  kualalumpur:{transport:['Grab'],food:['Foodpanda','GrabFood'],booking:['Agoda'],public:['MyRapid PULSE'],sim:['Airalo'],events:['Malaysia Travel']},
  bali:{transport:['Grab','Gojek'],food:['GoFood','GrabFood'],booking:['Traveloka','Agoda'],public:['Grab','Gojek'],sim:['MyTelkomsel','Airalo'],events:['Indonesia Travel']},
  newyork:{transport:['Uber','Lyft'],food:['Resy','OpenTable'],booking:['Booking.com'],public:['MTA'],sim:['Airalo'],events:['TodayTix','Eventbrite']}
 };
 const meta={
  transport:['🚕','التنقل','Getting around','للتكاسي والتنقل داخل المدينة','Taxi and city rides'],
  food:['🍽','المطاعم','Food & dining','للبحث والحجز أو طلب الطعام','Find, book or order food'],
  booking:['🏨','الحجوزات','Bookings','للفنادق والأنشطة والحجوزات','Hotels, activities and reservations'],
  public:['🚇','النقل العام','Public transport','للمترو والباص والقطارات','Metro, bus and rail'],
  sim:['📶','الشرائح والإنترنت','SIM & data','للشريحة أو eSIM والإنترنت','SIM, eSIM and mobile data'],
  events:['🎟','الفعاليات','Events','للتذاكر والفعاليات الحالية','Events and tickets']
 };
 function keyFromValue(v){return window.TRAVO_FIND_CITY?.(v)?.cityKey||null}
 function destinationKey(){try{const d=JSON.parse(localStorage.getItem('travo-trip-draft')||'{}');return d?.payload?.destinationKey||keyFromValue($('#destination')?.value)||null}catch{return keyFromValue($('#destination')?.value)}}
 function applyTheme(key){if(!key)return;const t=window.TRAVO_APPLY_DESTINATION_THEME?.(key);if(!t)return;let chip=$('.destination-chip');if(!chip){chip=document.createElement('span');chip.className='destination-chip';$('.trip-hero-copy')?.appendChild(chip)}const a=(window.TRAVO_AIRPORTS||[]).find(x=>x.cityKey===key);chip.textContent=`${t.flag} ${lang()==='ar'?(a?.cityAr||'')+' • '+t.countryAr:(a?.cityEn||'')+' • '+t.countryEn}`}
 function renderApps(){const itinerary=$('#fullItinerary');if(!itinerary||!itinerary.innerHTML.trim())return;const key=destinationKey();if(!key)return;applyTheme(key);let section=$('#travelAppsSection');if(!section){section=document.createElement('section');section.id='travelAppsSection';section.className='travel-apps-section';itinerary.insertAdjacentElement('afterend',section)}const a=(window.TRAVO_AIRPORTS||[]).find(x=>x.cityKey===key),cityName=lang()==='ar'?(a?.cityAr||key):(a?.cityEn||key);const items=DATA[key]||generic;section.innerHTML=`<div class="travel-apps-head"><div><p class="eyebrow">TRAVEL TOOLKIT</p><h3>${lang()==='ar'?`التطبيقات اللي تحتاجها في ${cityName}`:`Apps you may need in ${cityName}`}</h3><p>${lang()==='ar'?'قسم سريع بعد خطتك عشان تكون أدوات الرحلة كلها قدامك.':'A quick toolkit after your itinerary so the essentials stay together.'}</p></div></div><div class="travel-app-grid">${Object.keys(meta).map(k=>{const m=meta[k],apps=items[k]||generic[k]||[];return `<article class="travel-app-card"><div class="travel-app-card-top"><div><b>${lang()==='ar'?m[1]:m[2]}</b><small>${lang()==='ar'?m[3]:m[4]}</small></div><span>${m[0]}</span></div><div class="apps">${apps.map(x=>`<i>${x}</i>`).join('')}</div></article>`}).join('')}</div>`}
 const old=window.applyDestinationTheme;window.applyDestinationTheme=function(raw){const key=keyFromValue(raw)||raw;const t=window.TRAVO_APPLY_DESTINATION_THEME?.(key);if(!t&&typeof old==='function')return old(raw);applyTheme(key);return t};
 $('#destination')?.addEventListener('change',e=>applyTheme(keyFromValue(e.target.value)));$('#destination')?.addEventListener('input',e=>{const k=keyFromValue(e.target.value);if(k)applyTheme(k)});
 const observer=new MutationObserver(()=>renderApps());const it=$('#fullItinerary');if(it)observer.observe(it,{childList:true,subtree:true});
 applyTheme(destinationKey()||'riyadh');renderApps();
})();
