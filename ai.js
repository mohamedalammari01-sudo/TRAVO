const A={
  ar:{
    tagline:'مساعدك للسياحة الداخلية السعودية',home:'الرئيسية',trip:'خطط رحلتك',discover:'اكتشف',destinations:'وجهات',
    title:'اسأل عن وجهتك.<br>وخلّني أرتبها معك.',sub:'فعاليات، أنشطة، مواقع، أحياء، مواسم ومسارات داخل السعودية. TRAVO يبحث عند الحاجة ويعطيك جوابًا عمليًا.',
    cityLabel:'المدينة أو الوجهة — اختياري',cityPh:'مثال: الرياض أو العلا',checking:'جاري فحص الاتصال…',connected:'TRAVO AI متصل • معلومات سياحية سعودية',offline:'الاتصال متعثر حاليًا — بنحاول مرة ثانية عند الإرسال',
    hello:'أهلًا 👋 قل لي عن وجهتك أو نوع التجربة التي تبيها داخل السعودية، وأنا أساعدك ترتبها.',messagePh:'اسأل عن فعالية، نشاط أو وجهة سعودية…',send:'إرسال',thinking:'TRAVO يرتب لك الإجابة…',error:'صار تعثر مؤقت. جرّب نفس الرسالة مرة ثانية.',
    trust:'إذا كان السؤال يحتاج معلومة حديثة مثل الفعاليات أو أوقات الزيارة، TRAVO يبحث أولًا ويشاركك المصادر المتاحة.',sources:'مصادر استخدمها TRAVO'
  },
  en:{
    tagline:'Your Saudi domestic tourism assistant',home:'Home',trip:'Plan a trip',discover:'Discover',destinations:'Destinations',
    title:'Ask about your destination.<br>Let me plan it with you.',sub:'Events, activities, places, districts, seasons and routes across Saudi Arabia. TRAVO researches when needed and gives practical guidance.',
    cityLabel:'City or destination — optional',cityPh:'Example: Riyadh or AlUla',checking:'Checking connection…',connected:'TRAVO AI connected • Saudi tourism guidance',offline:'Connection is unstable — we will retry when you send',
    hello:'Hi 👋 Tell me about your Saudi destination or experience, and I will help organise it.',messagePh:'Ask about a Saudi event, activity or destination…',send:'Send',thinking:'TRAVO is planning the answer…',error:'There was a temporary issue. Send the same message again.',
    trust:'When you need current information such as events or opening details, TRAVO searches first and shares available sources.',sources:'Sources used by TRAVO'
  }
};

let lang=localStorage.getItem('travo-lang')||'ar';
let history=[];
const $=selector=>document.querySelector(selector),$$=selector=>[...document.querySelectorAll(selector)];
const t=key=>A[lang][key]||key;

function apply(){
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  localStorage.setItem('travo-lang',lang);
  $$('[data-a]').forEach(element=>{const value=t(element.dataset.a);if(value)element.innerHTML=value});
  $$('[data-a-ph]').forEach(element=>element.placeholder=t(element.dataset.aPh));
  $('#aiLang').textContent=lang==='ar'?'EN':'عربي';
}

function bubble(text,type='assistant',sources=[]){
  const item=document.createElement('div');
  item.className='chat-bubble '+(type==='user'?'user':type==='error'?'error':'assistant');
  item.innerHTML=`<b>${type==='user'?(lang==='ar'?'أنت':'You'):'TRAVO AI'}</b><span></span>`;
  item.querySelector('span').textContent=text;
  if(type==='assistant'&&Array.isArray(sources)&&sources.length){
    const wrap=document.createElement('div');wrap.className='ai-sources';
    const title=document.createElement('small');title.textContent=t('sources');wrap.appendChild(title);
    sources.slice(0,4).forEach(source=>{
      if(!source?.url)return;
      const link=document.createElement('a');link.href=source.url;link.target='_blank';link.rel='noopener';link.textContent=source.title||new URL(source.url).hostname;wrap.appendChild(link);
    });
    item.appendChild(wrap);
  }
  $('#aiConversation').appendChild(item);
  item.scrollIntoView({behavior:'smooth',block:'end'});
  return item;
}

function saveHistory(){try{localStorage.setItem('travo-saudi-ai-history',JSON.stringify(history.slice(-20)))}catch{}}
function loadHistory(){
  try{
    const saved=JSON.parse(localStorage.getItem('travo-saudi-ai-history')||'[]');
    if(Array.isArray(saved)){history=saved.filter(item=>item&&['user','assistant'].includes(item.role)&&typeof item.content==='string').slice(-20);history.forEach(item=>bubble(item.content,item.role==='user'?'user':'assistant'))}
  }catch{history=[]}
}

async function check(){
  const status=$('#aiStatus');
  try{
    const response=await fetch('/api/ai',{cache:'no-store'}),result=await response.json();
    if(!result.ready)throw new Error();
    status.classList.add('ready');status.querySelector('span').textContent=t('connected');
  }catch{status.classList.remove('ready');status.querySelector('span').textContent=t('offline')}
}

async function askServer(message){
  const payload={action:'chat',message,language:lang,city:$('#aiCity').value.trim(),history:history.slice(-16)};
  const response=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  const result=await response.json();
  if(!response.ok)throw new Error(result.message||result.error||'AI_ERROR');
  return result;
}

async function send(){
  const input=$('#aiMessage'),message=input.value.trim();
  if(!message)return;
  bubble(message,'user');input.value='';$('#aiSubmit').disabled=true;
  const pending=bubble(t('thinking'));
  history.push({role:'user',content:message});saveHistory();
  try{
    let result;
    try{result=await askServer(message)}catch{await new Promise(resolve=>setTimeout(resolve,650));result=await askServer(message)}
    pending.remove();
    const answer=result.answer||t('error');
    bubble(answer,'assistant',result.sources||[]);
    history.push({role:'assistant',content:answer});saveHistory();check();
  }catch{pending.remove();bubble(t('error'),'error')}
  finally{$('#aiSubmit').disabled=false;input.focus()}
}

$('#aiLang').onclick=()=>{lang=lang==='ar'?'en':'ar';apply();check()};
$('#aiSubmit').onclick=send;
$('#aiMessage').addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();send()}});
$$('.quick-prompts button').forEach(button=>button.onclick=()=>{$('#aiMessage').value=button.dataset.p;$('#aiMessage').focus()});
apply();loadHistory();check();
