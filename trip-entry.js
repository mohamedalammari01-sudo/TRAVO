const entryStyle=document.createElement('link');
entryStyle.rel='stylesheet';entryStyle.href='trip-entry.css';document.head.appendChild(entryStyle);
const smartStyle=document.createElement('link');
smartStyle.rel='stylesheet';smartStyle.href='trip-smart.css';document.head.appendChild(smartStyle);

const ENTRY={
  ar:{
    startStep:'البداية',hero:'خطط رحلتك داخل السعودية.<br>وخلّ TRAVO يرتب التفاصيل.',heroSub:'اختر وجهة سعودية واهتماماتك، ثم ابدأ جدولًا عمليًا يناسب وقتك وأسلوب رحلتك.',
    startTitle:'خطط مشوارك داخل السعودية',startSub:'اختر أسلوب التخطيط، ثم أدخل وجهتك السعودية وطريقة وصولك إن احتجت.',manualTitle:'أدخل تفاصيل الرحلة',manualSub:'الوجهة والتواريخ تكفي كبداية؛ السكن ووسيلة الوصول اختياريان.',
    ticketMethodTitle:'تذكرة طيران داخلية',ticketMethodSub:'اختياري: صوّر أو ارفع التذكرة الداخلية ليقرأ TRAVO تفاصيلها.',goalsSub:'اختر اهتماماتك، وTRAVO يبدأ لك بجدول يركز على الأنشطة والفعاليات والمواقع السعودية.'
  },
  en:{
    startStep:'Start',hero:'Plan your Saudi trip.<br>Let TRAVO handle the structure.',heroSub:'Choose a Saudi destination and your interests, then start a practical plan around your time and travel style.',
    startTitle:'Plan your Saudi outing',startSub:'Choose a planning style, then add your Saudi destination and travel method if needed.',manualTitle:'Enter trip details',manualSub:'Your destination and dates are enough to start; accommodation and travel method are optional.',
    ticketMethodTitle:'Domestic flight ticket',ticketMethodSub:'Optional: upload a domestic ticket for TRAVO to read the details.',goalsSub:'Choose your interests and TRAVO will start an itinerary focused on Saudi activities, events and places.'
  }
};

// The authentication and ticket capabilities remain in the codebase for a later release,
// but the public flow is now an open domestic-tourism planner.
if(typeof I!=='undefined'){
  Object.assign(I.ar,{
    tagline:'خطط رحلتك داخل السعودية',step1:'تذكرة داخلية',step2:'تفاصيل الرحلة',step3:'اهتماماتك',step4:'الجدول اليومي',privacy:'لا يلزم تسجيل أو حفظ بياناتك في هذه المرحلة',
    hero:'خطط رحلتك داخل السعودية.<br>وخلّ TRAVO يرتب التفاصيل.',heroSub:'اختر وجهة سعودية واهتماماتك، ثم ابدأ جدولًا عمليًا يناسب وقتك وأسلوب رحلتك.',
    ticketTitle:'تذكرة طيران داخلية (اختياري)',ticketSub:'إذا كانت رحلتك داخلية، يمكنك رفع التذكرة أو إدخال تفاصيل الرحلة يدويًا.',scan:'قراءة التذكرة بالذكاء الاصطناعي',
    detailsTitle:'تفاصيل رحلتك داخل السعودية',detailsSub:'اختر وجهتك السعودية والتواريخ؛ السكن ووسيلة الوصول اختياريان.',airportHelp:'اختر مدينة أو وجهة داخل السعودية.',
    goalsTitle:'وش تبي تعيش في رحلتك؟',goalsSub:'TRAVO يركز لك الجدول على الأنشطة والفعاليات والمواقع في الوجهة السعودية المختارة.',generate:'رتّب مشواري',itineraryTitle:'جدول مشوارك',itinerarySub:'بداية جدول عملية تناسب الأنشطة والمواقع التي اخترتها في السعودية.',myTrip:'مشواري',trends:'الفعاليات',plans:'',
    verifiedUnavailable:'لا توجد خيارات موثقة مضافة لهذه الوجبة في الوجهة الآن؛ ركّز على أنشطة ومواقع جدولك أو افتح «اكتشف».',genFail:'تعذر تشغيل الذكاء الاصطناعي الآن، لذلك أنشأنا بداية جدول محلية قابلة للتعديل.'
  });
  Object.assign(I.en,{
    tagline:'Plan your trip inside Saudi Arabia',step1:'Domestic ticket',step2:'Trip details',step3:'Your interests',step4:'Daily plan',privacy:'No sign-in or data saving is required at this stage',
    hero:'Plan your Saudi trip.<br>Let TRAVO organise the details.',heroSub:'Choose a Saudi destination and interests, then start a practical plan around your time and travel style.',
    ticketTitle:'Domestic flight ticket (optional)',ticketSub:'For a domestic flight, upload the ticket or enter trip details manually.',scan:'Read ticket with AI',
    detailsTitle:'Your Saudi trip details',detailsSub:'Choose a Saudi destination and dates; accommodation and travel method are optional.',airportHelp:'Choose a city or destination inside Saudi Arabia.',
    goalsTitle:'What do you want from your trip?',goalsSub:'TRAVO focuses the plan on activities, events and places in your chosen Saudi destination.',generate:'Plan my outing',itineraryTitle:'Your outing plan',itinerarySub:'A practical starting plan around the Saudi activities and places you selected.',myTrip:'My outing',trends:'Events',plans:'',
    verifiedUnavailable:'No verified meal options are listed for this destination yet; focus on the activities and places in your plan or open Discover.',genFail:'AI is unavailable right now, so we created an editable local starter plan.'
  });
}

function entryLang(){return localStorage.getItem('travo-lang')||'ar'}
function applyEntryCopy(){
  const current=entryLang();
  document.querySelectorAll('[data-entry-i]').forEach(element=>{
    const value=ENTRY[current]?.[element.dataset.entryI];
    if(value)element.innerHTML=value;
  });
}
function resolveDestinationKey(raw){
  const selected=window.TRAVO_FIND_CITY?.(raw||'');
  if(selected)return selected.cityKey;
  const query=String(raw||'').trim().toLowerCase();
  return Object.keys(window.TRAVO_DESTINATION_THEMES||{}).find(key=>query.includes(key))||null;
}
function setSaudiStartVisual(){
  window.TRAVO_RESET_BRAND_THEME?.();
  const image=window.TRAVO_SAUDI_GALLERY?.[3]?.image||window.TRAVO_DEFAULT_SAUDI_IMAGE;
  if(image)document.documentElement.style.setProperty('--trip-hero',`url('${image}')`);
}
applyDestinationTheme=function(raw){
  const key=resolveDestinationKey(raw);
  if(!key){setSaudiStartVisual();return}
  window.TRAVO_APPLY_DESTINATION_THEME?.(key,{target:'trip'});
  localStorage.setItem('travo-trip-theme',key);
};
function watchDestination(){
  const input=document.getElementById('destination');
  if(!input)return;
  let timer;
  const update=()=>{
    clearTimeout(timer);
    timer=setTimeout(()=>{const key=resolveDestinationKey(input.value);if(key)applyDestinationTheme(key)},180);
  };
  input.addEventListener('input',update);
  input.addEventListener('change',update);
}

document.getElementById('startManualBtn')?.addEventListener('click',()=>{showStep(2)});
document.getElementById('startTicketBtn')?.addEventListener('click',()=>{showStep(1)});
document.getElementById('tripLang')?.addEventListener('click',()=>setTimeout(applyEntryCopy,0));
const generateButton=document.getElementById('generateTripBtn');
const generateTrip=generateButton?.onclick;
if(generateButton&&generateTrip){
  generateButton.onclick=async function(event){
    const destination=document.getElementById('destination');
    const selected=window.TRAVO_FIND_CITY?.(destination?.value||'');
    if(!selected){
      showStep(2);
      if(destination){destination.focus();destination.setCustomValidity(entryLang()==='ar'?'اختر وجهة داخل السعودية من القائمة.':'Choose a Saudi destination from the list.');destination.reportValidity();destination.setCustomValidity('')}
      return;
    }
    return generateTrip.call(this,event);
  };
}
setSaudiStartVisual();
if(typeof applyLang==='function')applyLang();
applyEntryCopy();watchDestination();
if(!localStorage.getItem('travo-trip-draft'))showStep(0);
const smartTripScript=document.createElement('script');
smartTripScript.src='trip-smart.js';
smartTripScript.onload=()=>{
  try{const draft=JSON.parse(localStorage.getItem('travo-trip-draft')||'null');if(draft?.itinerary&&draft?.payload&&typeof renderItinerary==='function')renderItinerary(draft.itinerary,draft.payload,false)}catch{}
};
document.body.appendChild(smartTripScript);
