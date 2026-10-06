(function(){
  function normArea(value){return String(value||'').toLowerCase().replace(/[–—-]/g,' ').replace(/[^\p{L}\p{N}\s]/gu,' ').replace(/\s+/g,' ').trim()}
  function areaAffinity(venueArea,dayArea){const a=normArea(venueArea),b=normArea(dayArea);if(!a||!b)return 0;if(a===b||a.includes(b)||b.includes(a))return 100;const aw=new Set(a.split(' ').filter(x=>x.length>2)),bw=b.split(' ').filter(x=>x.length>2);return bw.filter(x=>aw.has(x)).length*28}
  function smartScore(venue,style,dayArea){const rating=Number(venue.rating||0),reviews=Number(venue.reviews||0);let score=rating*18+Math.log10(reviews+1)*6+areaAffinity(venue.area,dayArea);if((style==='nearby'||style==='dynamic')&&typeof distanceKm==='function'){const distance=distanceKm(venue,userCoords);if(distance!==null)score+=Math.max(-40,130-distance*12)}return score}

  pickVenueOptions=function(list,dayIndex,style,dayArea){if(!Array.isArray(list)||!list.length)return[];const ranked=[...list].sort((a,b)=>smartScore(b,style,dayArea)-smartScore(a,style));if(ranked.length<=3)return ranked;const bestArea=ranked.filter(venue=>areaAffinity(venue.area,dayArea)>0);if(bestArea.length>=3)return bestArea.slice(0,3);const lead=bestArea.slice(0,2);for(const venue of ranked){if(lead.length>=3)break;if(!lead.includes(venue))lead.push(venue)}return lead.slice(0,3)};

  function timeToMinutes(value,fallback){const match=/^(\d{1,2}):(\d{2})$/.exec(String(value||''));if(!match)return fallback;return Number(match[1])*60+Number(match[2])}
  function formatTime(minutes){const normalized=((minutes%1440)+1440)%1440;return `${String(Math.floor(normalized/60)).padStart(2,'0')}:${String(normalized%60).padStart(2,'0')}`}
  function at(start,portion){return formatTime(start+Math.round(portion))}
  function dayTimes(payload){const wake=timeToMinutes(payload.wakeTime,payload.pace==='packed'?420:payload.pace==='relaxed'?540:480);let sleep=timeToMinutes(payload.sleepTime,1440);if(sleep<=wake)sleep+=1440;const span=Math.max(720,sleep-wake);return {wake:formatTime(wake),breakfast:at(wake,span*.07),morning:at(wake,span*.19),lunch:at(wake,span*.38),afternoon:at(wake,span*.53),coffee:at(wake,span*.66),dinner:at(wake,span*.78),evening:at(wake,span*.88),hotelReturn:at(wake,span*.95),sleep:formatTime(sleep)}}
  function addMinutes(value,minutes){return formatTime(timeToMinutes(value,480)+minutes)}
  function isArrivalDay(payload,index){return index===0&&Boolean(payload.arrivalTime)}
  function isDepartureDay(payload,index,total){return index===total-1&&Boolean(payload.returnTime)}
  function timesForDay(payload,index,total){const times=dayTimes(payload);if(isArrivalDay(payload,index)){const arrival=payload.arrivalTime;return {...times,arrival,afternoon:addMinutes(arrival,105),coffee:addMinutes(arrival,215),dinner:addMinutes(arrival,345),evening:addMinutes(arrival,465),hotelReturn:addMinutes(arrival,570)}}if(isDepartureDay(payload,index,total)){const prep=addMinutes(payload.returnTime,-150);return {...times,departurePrep:prep}}return times}

  function slot(icon,label,time,text,kind=''){if(!text)return'';return `<div class="activity-slot timeline-slot ${kind}"><div class="timeline-time">${time||'•'}</div><div class="timeline-card"><b>${icon} ${label}</b><span>${text}</span></div></div>`}
  function stayText(payload){return payload.hotel?(lang==='ar'?`ابدأ بهدوء من ${payload.hotel} وجهّز احتياجك لليوم قبل الخروج.`:`Start calmly from ${payload.hotel} and get ready before heading out.`):(lang==='ar'?'ابدأ بهدوء، جهّز احتياجك وخط سيرك قبل أول محطة.':'Start calmly, prepare what you need and review the route before the first stop.')}
  function arrivalText(payload){return payload.hotel?(lang==='ar'?`توجّه إلى ${payload.hotel}، خذ وقتًا للاستقرار ثم ابدأ محطة خفيفة قريبة.`:`Head to ${payload.hotel}, settle in, then begin with one light nearby stop.`):(lang==='ar'?'استلم السكن وخذ وقتًا قصيرًا للاستقرار قبل أول محطة خفيفة.':'Check in, settle in, then start with one light nearby stop.')}
  function returnText(payload){return payload.hotel?(lang==='ar'?`ارجع إلى ${payload.hotel} وخذ وقتًا للراحة وتجهيز اليوم التالي.`:`Return to ${payload.hotel}, recharge and prepare for tomorrow.`):(lang==='ar'?'ارجع لمكان السكن، راجع صورك وخطتك وخذ وقتًا للراحة.':'Return to your stay, review your day and recharge.')}

  mealBlock=function(titleKey,meal,dayIndex,payload,day,time){const city=guideData.cities?.[payload.destinationKey];const list=city?.[meal]||[];const options=pickVenueOptions(list,dayIndex,payload.planStyle,day?.area||'');const cluster=day?.area?`<small class="cluster-hint">${lang==='ar'?'قريب من':'Near'} ${day.area}</small>`:'';if(!options.length)return `<section class="meal-block unavailable timeline-meal"><div class="timeline-time">${time||'•'}</div><div class="meal-content"><div class="meal-title"><div><b>${tr(titleKey)}</b>${cluster}</div></div><p>${tr('verifiedUnavailable')}</p></div></section>`;return `<section class="meal-block timeline-meal"><div class="timeline-time">${time||'•'}</div><div class="meal-content"><div class="meal-title"><div><b>${tr(titleKey)}</b>${cluster}</div><span>${payload.planStyle==='nearby'?'📍':payload.planStyle==='dynamic'?'✦':'🔥'}</span></div><div class="venue-options">${options.map(venue=>venueOption(venue,dayIndex+1,meal)).join('')}</div></div></section>`};

  function placeTypesFor(interests){const types=new Set();for(const interest of interests||[]){if(['culture','photography','shopping','luxury','nightlife'].includes(interest))types.add('places');if(['culture','adventure','wellness','photography','beach','nature','nightlife','luxury'].includes(interest))types.add('activities');if(['culture','nightlife','luxury'].includes(interest))types.add('concerts')}return [...types]}
  function mapUrl(place){const query=place.mapQuery||[lang==='ar'?place.titleAr:place.titleEn,lang==='ar'?place.areaAr:place.areaEn].filter(Boolean).join(' ');return query?`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`:''}
  function personalizedPlaces(payload,day,index){const city=discoveryData?.cities?.[payload.destinationKey];if(!city)return'';const types=placeTypesFor(payload.interests);let pool=types.flatMap(type=>(city[type]||[]).map(place=>({...place,_type:type})));if(!pool.length)pool=[...(city.places||[]),...(city.activities||[])].map(place=>({...place,_type:'places'}));const seen=new Set();pool=pool.filter(place=>{const key=place.titleAr||place.titleEn;if(!key||seen.has(key))return false;seen.add(key);return true}).sort((a,b)=>areaAffinity((lang==='ar'?b.areaAr:b.areaEn)||'',day?.area||'')-areaAffinity((lang==='ar'?a.areaAr:a.areaEn)||'',day?.area||''));if(!pool.length)return'';const offset=(index*2)%pool.length;const selected=Array.from({length:Math.min(2,pool.length)},(_,position)=>pool[(offset+position)%pool.length]);return `<section class="personal-places"><div class="personal-places-head"><div><b>${tr('personalizedPlaces')}</b><small>${(payload.interests||[]).map(interest=>tr(interest)).join(' • ')}</small></div><span>◎</span></div><div class="personal-place-grid">${selected.map(place=>{const title=lang==='ar'?place.titleAr:place.titleEn,summary=lang==='ar'?place.summaryAr:place.summaryEn,area=lang==='ar'?place.areaAr:place.areaEn,href=mapUrl(place);return `<article class="personal-place"><div><b>${title}</b><small>${area||''}</small></div><p>${summary||''}</p><div class="personal-place-links">${href?`<a href="${href}" target="_blank" rel="noopener">${tr('openMap')} ↗</a>`:''}${place.sourceUrl?`<a href="${place.sourceUrl}" target="_blank" rel="noopener">${tr('placeSource')} ↗</a>`:''}</div></article>`}).join('')}</div></section>`}

  renderItinerary=function(data,payload,save=true){const days=data.days||[];$('#tripSummary').textContent=data.summary||tr('itinerarySub');const overview=[payload.destination,payload.hotel||null,payload.tripType,payload.pace,payload.budget,...(payload.interests||[]).map(interest=>tr(interest)),planModeText(payload.planStyle)].filter(Boolean);$('#tripOverview').innerHTML=overview.map(item=>`<span class="overview-pill">${item}</span>`).join('');$('#fullItinerary').innerHTML=days.map((day,index)=>{const times=timesForDay(payload,index,days.length),arrival=isArrivalDay(payload,index),departure=isDepartureDay(payload,index,days.length);const start=arrival?slot('✈',tr('arrivalStart'),times.arrival,arrivalText(payload),'arrival-slot'):slot('☀',tr('wakeUp'),times.wake,stayText(payload),'start-slot');const breakfast=!arrival?mealBlock('breakfast','breakfast',index,payload,day,times.breakfast):'';const morning=!arrival?`${slot('☀',tr('morning'),times.morning,day.morning)}${personalizedPlaces(payload,day,index)}`:'';const lunch=departure&&timeToMinutes(payload.returnTime,1440)<=timeToMinutes(times.lunch,780)?'':mealBlock('lunch','lunch',index,payload,day,times.lunch);const afternoon=!departure?slot('◐',tr('afternoon'),times.afternoon,day.afternoon):'';const placesAfterAfternoon='';const coffee=!departure?mealBlock('coffee','coffee',index,payload,day,times.coffee):'';const dinner=!departure?mealBlock('dinner','dinner',index,payload,day,times.dinner):'';const evening=!departure?slot('☾',tr('evening'),times.evening,day.evening):'';const finish=departure?slot('✈',tr('departurePrep'),times.departurePrep,lang==='ar'?`جهّز المغادرة ووصل للمطار قبل ${payload.returnTime}.`:`Prepare to leave and arrive at the airport before ${payload.returnTime}.`,'departure-slot'):`${slot('⌂',tr('hotelReturn'),times.hotelReturn,returnText(payload),'return-slot')}${slot('☾',tr('sleepRoutine'),times.sleep,lang==='ar'?'نوم وراحة حتى يبدأ يوم جديد بطاقة أفضل.':'Sleep and recharge for the next day.','sleep-slot')}`;return `<article class="trip-day"><div class="trip-day-head"><div><b>${tr('day')} ${day.day||index+1}${day.title?' • '+day.title:''}</b><small>${day.date||''}</small></div>${day.area?`<span class="day-cluster">◎ ${day.area}</span>`:''}</div>${day.routeNote?`<div class="route-note"><b>${lang==='ar'?'منطق اليوم':'Today’s route'}</b><span>${day.routeNote}</span></div>`:''}<div class="day-timeline">${start}${breakfast}${morning}${lunch}${afternoon}${placesAfterAfternoon}${coffee}${dinner}${evening}${finish}</div>${day.note?`<div class="inline-note">${day.note}</div>`:''}</article>`}).join('');if(save)localStorage.setItem('travo-trip-draft',JSON.stringify({payload,itinerary:data,selectedVenues}));showStep(4);applyDestinationTheme((payload.destinationKey||payload.destination||'').toLowerCase())};
  personalizedPlaces=function(payload,day,index){
    const city=discoveryData?.cities?.[payload.destinationKey];
    if(!city)return'';
    const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
    const types=placeTypesFor(payload.interests);
    let pool=types.flatMap(type=>(city[type]||[]).map(place=>({...place,_type:type})));
    if(!pool.length)pool=[...(city.places||[]),...(city.activities||[]),...(city.concerts||[])].map(place=>({...place,_type:'guide'}));
    const interests=new Set(payload.interests||[]);
    const tagged=pool.filter(place=>!Array.isArray(place.tags)||!place.tags.length||place.tags.some(tag=>interests.has(tag)));
    if(tagged.length)pool=tagged;
    const seen=new Set();
    pool=pool.filter(place=>{
      const key=place.titleAr||place.titleEn;
      if(!key||seen.has(key))return false;
      seen.add(key);
      return true;
    }).sort((a,b)=>areaAffinity((lang==='ar'?b.areaAr:b.areaEn)||'',day?.area||'')-areaAffinity((lang==='ar'?a.areaAr:a.areaEn)||'',day?.area||''));
    if(!pool.length)return'';
    const offset=(index*2)%pool.length;
    const selected=Array.from({length:Math.min(2,pool.length)},(_,position)=>pool[(offset+position)%pool.length]);
    const interestLabel=(payload.interests||[]).map(interest=>tr(interest)).join(' • ');
    const cards=selected.map(place=>{
      const title=lang==='ar'?(place.titleAr||place.titleEn):(place.titleEn||place.titleAr);
      const summary=lang==='ar'?(place.summaryAr||place.summaryEn):(place.summaryEn||place.summaryAr);
      const area=lang==='ar'?(place.areaAr||place.areaEn):(place.areaEn||place.areaAr);
      const price=lang==='ar'?(place.priceTextAr||place.priceTextEn):(place.priceTextEn||place.priceTextAr);
      const duration=lang==='ar'?(place.durationAr||place.durationEn):(place.durationEn||place.durationAr);
      const date=lang==='ar'?(place.dateAr||place.dateEn):(place.dateEn||place.dateAr);
      const booking=place.bookingUrl||'';
      const source=place.sourceUrl&&place.sourceUrl!==booking?place.sourceUrl:'';
      const href=mapUrl(place);
      const meta=[price,duration||date].filter(Boolean).map(value=>'<span>'+escape(value)+'</span>').join('');
      const actions=[
        booking?'<a href="'+escape(booking)+'" target="_blank" rel="noopener noreferrer">'+(lang==='ar'?'الحجز':'Book')+' ↗</a>':'',
        href?'<a href="'+escape(href)+'" target="_blank" rel="noopener noreferrer">'+escape(tr('openMap'))+' ↗</a>':'',
        source?'<a href="'+escape(source)+'" target="_blank" rel="noopener noreferrer">'+escape(tr('placeSource'))+' ↗</a>':''
      ].join('');
      return '<article class="personal-place"><div><b>'+escape(title)+'</b><small>'+escape(area)+'</small></div>'+(meta?'<div class="personal-place-meta">'+meta+'</div>':'')+'<p>'+escape(summary)+'</p>'+(actions?'<div class="personal-place-links">'+actions+'</div>':'')+'</article>';
    }).join('');
    return '<section class="personal-places"><div class="personal-places-head"><div><b>'+escape(tr('personalizedPlaces'))+'</b><small>'+escape(interestLabel)+'</small></div><span>◎</span></div><div class="personal-place-grid">'+cards+'</div></section>';
  };
})();
