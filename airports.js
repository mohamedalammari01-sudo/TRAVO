// Kept under the original name because the trip planner uses this shared destination list.
// Every entry is a Saudi domestic destination; non-Saudi routes are intentionally excluded.
window.TRAVO_AIRPORTS=[
  {cityKey:'riyadh',cityAr:'الرياض',cityEn:'Riyadh',countryAr:'السعودية',countryEn:'Saudi Arabia',code:'RUH',airportAr:'الرياض',airportEn:'Riyadh'},
  {cityKey:'jeddah',cityAr:'جدة',cityEn:'Jeddah',countryAr:'السعودية',countryEn:'Saudi Arabia',code:'JED',airportAr:'جدة',airportEn:'Jeddah'},
  {cityKey:'alula',cityAr:'العلا',cityEn:'AlUla',countryAr:'السعودية',countryEn:'Saudi Arabia',code:'ULH',airportAr:'العلا',airportEn:'AlUla'},
  {cityKey:'taif',cityAr:'الطائف',cityEn:'Taif',countryAr:'السعودية',countryEn:'Saudi Arabia',code:'TIF',airportAr:'الطائف',airportEn:'Taif'},
  {cityKey:'abha',cityAr:'أبها',cityEn:'Abha',countryAr:'السعودية',countryEn:'Saudi Arabia',code:'AHB',airportAr:'أبها',airportEn:'Abha'},
  {cityKey:'khobar',cityAr:'الخبر',cityEn:'Al Khobar',countryAr:'السعودية',countryEn:'Saudi Arabia',code:'DMM',airportAr:'الخبر والمنطقة الشرقية',airportEn:'Al Khobar & Eastern Province'},
  {cityKey:'dammam',cityAr:'الدمام',cityEn:'Dammam',countryAr:'السعودية',countryEn:'Saudi Arabia',code:'DMM',airportAr:'الدمام',airportEn:'Dammam'},
  {cityKey:'diriyah',cityAr:'الدرعية',cityEn:'Diriyah',countryAr:'السعودية',countryEn:'Saudi Arabia',code:'RUH',airportAr:'الدرعية',airportEn:'Diriyah'},
  {cityKey:'hail',cityAr:'حائل',cityEn:'Hail',countryAr:'السعودية',countryEn:'Saudi Arabia',code:'HAS',airportAr:'حائل',airportEn:'Hail'},
  {cityKey:'tabuk',cityAr:'تبوك',cityEn:'Tabuk',countryAr:'السعودية',countryEn:'Saudi Arabia',code:'TUU',airportAr:'تبوك',airportEn:'Tabuk'},
  {cityKey:'umluj',cityAr:'أملج',cityEn:'Umluj',countryAr:'السعودية',countryEn:'Saudi Arabia',code:'TUU',airportAr:'أملج',airportEn:'Umluj'}
];

window.TRAVO_FIND_CITY=function(value){
  const query=(value||'').trim().toLowerCase();
  if(!query)return null;
  return window.TRAVO_AIRPORTS.find(destination=>[
    destination.cityKey,destination.cityAr,destination.cityEn,destination.code,destination.airportAr,destination.airportEn
  ].some(item=>(item||'').toLowerCase().includes(query)||query.includes((item||'').toLowerCase())))||null;
};

// Saudi destination directory. The legacy variable name remains so the planner and
// existing pages can use the extended city / governorate / village list unchanged.
(function(){
  const d=(cityKey,cityAr,cityEn,regionKey,regionAr,regionEn,typeAr,typeEn,code,summaryAr,summaryEn,highlightsAr,highlightsEn,tags,aliases=[])=>({
    cityKey,cityAr,cityEn,regionKey,regionAr,regionEn,typeAr,typeEn,code,
    countryAr:'السعودية',countryEn:'Saudi Arabia',airportAr:code?`أقرب مطار: ${code}`:'وجهة برية',airportEn:code?`Nearest airport: ${code}`:'Road destination',
    summaryAr,summaryEn,highlightsAr,highlightsEn,tags,aliases,mapQuery:`${cityAr}, Saudi Arabia`,isSaudiDestination:true
  });
  window.TRAVO_BUILD_SAUDI_DESTINATION=d;
  window.TRAVO_SAUDI_REGIONS=[
    {key:'riyadh',nameAr:'منطقة الرياض',nameEn:'Riyadh Region',icon:'🏙️'},
    {key:'makkah',nameAr:'منطقة مكة المكرمة',nameEn:'Makkah Region',icon:'🕋'},
    {key:'madinah',nameAr:'منطقة المدينة المنورة',nameEn:'Madinah Region',icon:'🕌'},
    {key:'eastern',nameAr:'المنطقة الشرقية',nameEn:'Eastern Province',icon:'🌊'},
    {key:'asir',nameAr:'منطقة عسير',nameEn:'Aseer Region',icon:'⛰️'},
    {key:'al-baha',nameAr:'منطقة الباحة',nameEn:'Al Baha Region',icon:'🌿'},
    {key:'jazan',nameAr:'منطقة جازان',nameEn:'Jazan Region',icon:'🏝️'},
    {key:'tabuk',nameAr:'منطقة تبوك',nameEn:'Tabuk Region',icon:'🏜️'},
    {key:'hail',nameAr:'منطقة حائل',nameEn:'Hail Region',icon:'🪨'},
    {key:'qassim',nameAr:'منطقة القصيم',nameEn:'Qassim Region',icon:'🌴'},
    {key:'northern-borders',nameAr:'منطقة الحدود الشمالية',nameEn:'Northern Borders Region',icon:'🧭'},
    {key:'al-jouf',nameAr:'منطقة الجوف',nameEn:'Al Jouf Region',icon:'🏛️'},
    {key:'najran',nameAr:'منطقة نجران',nameEn:'Najran Region',icon:'🏺'}
  ];
  const core={
    riyadh:{regionKey:'riyadh',regionAr:'منطقة الرياض',regionEn:'Riyadh Region',typeAr:'مدينة',typeEn:'City',summaryAr:'العاصمة النابضة بالثقافة والفعاليات والمطاعم والمتاحف والتجارب الحضرية.',summaryEn:'Saudi Arabia’s capital for culture, events, dining, museums and urban experiences.',highlightsAr:'حي الطريف، بوليفارد سيتي، المتحف الوطني، حافة العالم',highlightsEn:'At-Turaif, Boulevard City, National Museum, Edge of the World',tags:['culture','shopping','nightlife','luxury','food'],mapQuery:'Riyadh Saudi Arabia'},
    jeddah:{regionKey:'makkah',regionAr:'منطقة مكة المكرمة',regionEn:'Makkah Region',typeAr:'مدينة',typeEn:'City',summaryAr:'مدينة ساحلية تجمع البحر والبلد التاريخية والفنون والمطاعم والفعاليات.',summaryEn:'A coastal city combining the sea, historic Al-Balad, arts, dining and events.',highlightsAr:'جدة التاريخية، الكورنيش، حي جميل، جزيرة بياضة',highlightsEn:'Historic Jeddah, Corniche, Hayy Jameel, Bayadah Island',tags:['beach','culture','food','shopping','nightlife'],mapQuery:'Jeddah Saudi Arabia'},
    alula:{regionKey:'madinah',regionAr:'منطقة المدينة المنورة',regionEn:'Madinah Region',typeAr:'محافظة',typeEn:'Governorate',summaryAr:'وجهة عالمية للتاريخ والطبيعة والفنون بين الحِجر والبلدة القديمة والتكوينات الصخرية.',summaryEn:'A global history, nature and arts destination around Hegra, Old Town and rock formations.',highlightsAr:'الحِجر، جبل الفيل، البلدة القديمة، وادي عِشار',highlightsEn:'Hegra, Elephant Rock, Old Town, Ashar Valley',tags:['culture','nature','photography','luxury','adventure'],mapQuery:'AlUla Saudi Arabia'},
    taif:{regionKey:'makkah',regionAr:'منطقة مكة المكرمة',regionEn:'Makkah Region',typeAr:'مدينة',typeEn:'City',summaryAr:'مدينة جبلية معروفة بالورد والأجواء اللطيفة والمزارع والمنتزهات.',summaryEn:'A mountain city known for roses, mild weather, farms and parks.',highlightsAr:'الهدا، الشفا، سوق عكاظ، مزارع الورد',highlightsEn:'Al Hada, Al Shafa, Souq Okaz, rose farms',tags:['nature','culture','food','family','photography'],mapQuery:'Taif Saudi Arabia'},
    abha:{regionKey:'asir',regionAr:'منطقة عسير',regionEn:'Aseer Region',typeAr:'مدينة',typeEn:'City',summaryAr:'عاصمة جبلية صيفية للضباب والطبيعة والفنون والمطاعم المحلية.',summaryEn:'A summer mountain capital for mist, nature, arts and local dining.',highlightsAr:'السودة، شارع الفن، بحيرة سد أبها، المفتاحة',highlightsEn:'Al Soudah, Art Street, Abha Dam Lake, Al Muftaha',tags:['nature','culture','food','photography','family'],mapQuery:'Abha Saudi Arabia'},
    khobar:{regionKey:'eastern',regionAr:'المنطقة الشرقية',regionEn:'Eastern Province',typeAr:'مدينة',typeEn:'City',summaryAr:'وجهة بحرية عصرية للممشى والكافيهات والمطاعم وإطلالات الخليج.',summaryEn:'A modern Gulf escape for promenades, cafés, dining and sea views.',highlightsAr:'كورنيش الخبر، باي فرونت، شارع الأمير تركي',highlightsEn:'Khobar Corniche, Bayfront, Prince Turki Street',tags:['beach','food','shopping','nightlife','luxury'],mapQuery:'Al Khobar Saudi Arabia'},
    dammam:{regionKey:'eastern',regionAr:'المنطقة الشرقية',regionEn:'Eastern Province',typeAr:'مدينة',typeEn:'City',summaryAr:'مدينة ساحلية رئيسية للواجهات والحدائق والمطاعم والانطلاق إلى مدن الشرقية.',summaryEn:'A main coastal city for waterfronts, parks, dining and access to the Eastern Province.',highlightsAr:'كورنيش الدمام، جزيرة المرجان، الواجهة',highlightsEn:'Dammam Corniche, Marjan Island, waterfront',tags:['beach','family','food','shopping'],mapQuery:'Dammam Saudi Arabia'},
    diriyah:{regionKey:'riyadh',regionAr:'منطقة الرياض',regionEn:'Riyadh Region',typeAr:'مدينة تاريخية',typeEn:'Historic city',summaryAr:'وجهة للتراث النجدي والمطاعم الراقية والممرات القريبة من وادي حنيفة.',summaryEn:'A Najdi heritage destination with refined dining and walkways near Wadi Hanifah.',highlightsAr:'حي الطريف، البجيري، جاكس، وادي حنيفة',highlightsEn:'At-Turaif, Bujairi, JAX District, Wadi Hanifah',tags:['culture','food','photography','luxury'],mapQuery:'Diriyah Saudi Arabia'},
    hail:{regionKey:'hail',regionAr:'منطقة حائل',regionEn:'Hail Region',typeAr:'مدينة',typeEn:'City',summaryAr:'مدينة بين جبال أجا وسلمى، تجمع المتاحف والأسواق والرحلات الصحراوية.',summaryEn:'A city between Aja and Salma mountains with museums, markets and desert trips.',highlightsAr:'قلعة أعيرف، جبل أجا، الأسواق',highlightsEn:'Aarif Fort, Aja Mountains, markets',tags:['culture','nature','food','photography'],mapQuery:'Hail Saudi Arabia'},
    tabuk:{regionKey:'tabuk',regionAr:'منطقة تبوك',regionEn:'Tabuk Region',typeAr:'مدينة',typeEn:'City',summaryAr:'مدينة شمالية تنطلق منها رحلات البحر والتاريخ والصحارى والجبال.',summaryEn:'A northern city and base for sea, history, desert and mountain trips.',highlightsAr:'قلعة تبوك، محطة الحجاز، الأسواق',highlightsEn:'Tabuk Castle, Hejaz Railway Station, markets',tags:['culture','food','family'],mapQuery:'Tabuk Saudi Arabia'},
    umluj:{regionKey:'tabuk',regionAr:'منطقة تبوك',regionEn:'Tabuk Region',typeAr:'محافظة ساحلية',typeEn:'Coastal governorate',summaryAr:'وجهة بحرية للون الماء الفيروزي والشواطئ والجزر والرحلات البحرية.',summaryEn:'A turquoise-water destination for beaches, islands and boat trips.',highlightsAr:'الشواطئ، الجزر، الغوص، وجهة البحر الأحمر',highlightsEn:'Beaches, islands, diving, Red Sea destination',tags:['beach','adventure','nature','photography','luxury'],mapQuery:'Umluj Saudi Arabia'}
  };
  window.TRAVO_AIRPORTS=window.TRAVO_AIRPORTS.map(item=>({...item,...(core[item.cityKey]||{}),isSaudiDestination:true,aliases:[]}));
})();

(function(){
  const d=window.TRAVO_BUILD_SAUDI_DESTINATION;
  window.TRAVO_AIRPORTS.push(
    // الرياض
    d('al-kharj','الخرج','Al Kharj','riyadh','منطقة الرياض','Riyadh Region','محافظة','Governorate','RUH','محافظة قريبة من الرياض مناسبة للمزارع والعيون والزيارات الهادئة خارج المدينة.','A Riyadh getaway for farms, springs and relaxed excursions beyond the city.','عيون الخرج، المزارع، وادي نساح','Al Kharj springs, farms, Wadi Nissah',['nature','food','family']),
    d('al-majmaah','المجمعة','Al Majmaah','riyadh','منطقة الرياض','Riyadh Region','محافظة','Governorate','RUH','وجهة تراثية في سدير تجمع الأسواق القديمة والعمارة النجدية والمزارع الموسمية.','A Sudair heritage destination with old markets, Najdi architecture and seasonal farms.','حوطة سدير، الأسواق القديمة، المزارع','Hawtat Sudair, old markets, farms',['culture','photography','food']),
    d('al-ghat','الغاط','Al Ghat','riyadh','منطقة الرياض','Riyadh Region','محافظة','Governorate','RUH','بلدة تاريخية هادئة تشتهر بالبيوت الطينية والمزارع وقربها من وادي مرخ.','A quiet historic town known for mud-brick homes, farms and Wadi Markh.','البلدة التراثية، وادي مرخ، المزارع','Heritage town, Wadi Markh, farms',['culture','nature','photography']),
    d('ushaiqer','أشيقر','Ushaiger','riyadh','منطقة الرياض','Riyadh Region','قرية تراثية','Heritage village','RUH','قرية نجدية شهيرة لرحلات اليوم الواحد بين الأزقة الطينية والبيوت التاريخية.','A famed Najdi village for day trips through mud-brick lanes and historic homes.','قرية أشيقر التراثية، المتحف، المزارع','Ushaiger Heritage Village, museum, farms',['culture','photography','family'],['Ushiger','Ushaiger Heritage Village']),
    d('shaqra','شقراء','Shaqra','riyadh','منطقة الرياض','Riyadh Region','محافظة','Governorate','RUH','مدينة تراثية في الوشم مناسبة لمن يحب الأسواق القديمة والطابع النجدي.','A heritage town in Al Washm for old markets and classic Najdi character.','البلدة القديمة، سوق شقراء، القصور الطينية','Old town, Shaqra market, mud-brick palaces',['culture','photography','food']),
    d('thadiq','ثادق','Thadiq','riyadh','منطقة الرياض','Riyadh Region','محافظة','Governorate','RUH','رحلة ريفية قريبة من الرياض مع مزارع ونخيل وأجواء نجدية هادئة.','A nearby rural Riyadh trip with farms, date palms and quiet Najdi ambience.','المزارع، النخيل، البلدة القديمة','Farms, date palms, old town',['nature','food','family']),
    d('al-zulfi','الزلفي','Al Zulfi','riyadh','منطقة الرياض','Riyadh Region','محافظة','Governorate','RUH','وجهة لجبال طويق والنفود والرحلات البرية والتمشية الشتوية.','A destination for Tuwaiq escarpments, dunes, road trips and winter walks.','نفود الثويرات، جبال طويق، المنتزهات','Thuwayrat dunes, Tuwaiq mountains, parks',['nature','adventure','photography']),
    d('huraymila','حريملاء','Huraymila','riyadh','منطقة الرياض','Riyadh Region','محافظة','Governorate','RUH','محافظة قريبة لمحبي الوديان والرحلات البرية والزيارات القصيرة.','A nearby governorate for valleys, road trips and short outdoor visits.','وادي حنيفة، الوديان، المخيمات الشتوية','Wadi Hanifah, valleys, winter camps',['nature','adventure','family']),
    d('edge-of-the-world','حافة العالم','Edge of the World','riyadh','منطقة الرياض','Riyadh Region','موقع طبيعي','Natural site','RUH','إطلالة جرفية شهيرة غرب الرياض، مناسبة للمشي الخفيف والتصوير مع تجهيزات السلامة.','A famous escarpment west of Riyadh for light hikes and photography; plan safely.','جبل فهرين، الإطلالات، الغروب','Jebel Fihrayn, viewpoints, sunset',['nature','adventure','photography']),
    d('rawdat-khuraim','روضة خريم','Rawdat Khuraim','riyadh','منطقة الرياض','Riyadh Region','موقع طبيعي','Natural site','RUH','روضة موسمية شمال شرق الرياض يقصدها الناس بعد الأمطار للنزهات والطبيعة.','A seasonal meadow northeast of Riyadh, popular after rain for picnics and nature.','الربيع، المخيمات، المساحات الخضراء','Spring blooms, camps, green spaces',['nature','family','photography']),

    // مكة المكرمة
    d('makkah','مكة المكرمة','Makkah','makkah','منطقة مكة المكرمة','Makkah Region','مدينة','City','JED','وجهة دينية رئيسية مع مواقع تاريخية وتجارب ضيافة وخدمات للزوار طوال العام.','A primary spiritual destination with historic sites and year-round visitor services.','المسجد الحرام، جبل النور، معرض عمارة الحرمين','Grand Mosque, Jabal Al Nour, Haram Architecture Exhibition',['culture','wellness','family'],['Mecca','Makkah Al Mukarramah']),
    d('al-hada','الهدا','Al Hada','makkah','منطقة مكة المكرمة','Makkah Region','مركز جبلي','Mountain area','TIF','منطقة جبلية فوق الطائف للمناظر البانورامية والضباب والطرق المتعرجة.','A mountain area above Taif for panoramas, mist and scenic winding roads.','طريق الهدا، التلفريك، الإطلالات','Al Hada road, cable car, viewpoints',['nature','adventure','photography','family']),
    d('al-shafa','الشفا','Al Shafa','makkah','منطقة مكة المكرمة','Makkah Region','مركز جبلي','Mountain area','TIF','وجهة جبلية باردة نسبيًا لمزارع الفاكهة والضباب والمشي وسط الطبيعة.','A cooler mountain escape for fruit farms, mist and nature walks.','جبال الشفا، المزارع، المسارات','Al Shafa mountains, farms, trails',['nature','wellness','photography','family']),
    d('al-lith','الليث','Al Lith','makkah','منطقة مكة المكرمة','Makkah Region','محافظة ساحلية','Coastal governorate','JED','محافظة ساحلية لمحبي الشواطئ والجزر والرحلات البحرية جنوب جدة.','A coastal governorate south of Jeddah for beaches, islands and boat trips.','الشواطئ، الغوص، الجزر القريبة','Beaches, diving, nearby islands',['beach','adventure','nature','photography']),
    d('rabigh','رابغ','Rabigh','makkah','منطقة مكة المكرمة','Makkah Region','محافظة ساحلية','Coastal governorate','JED','وجهة بحرية شمال جدة مع شواطئ ورحلات قصيرة وامتداد إلى مدينة الملك عبدالله الاقتصادية.','A coastal getaway north of Jeddah with beaches, short trips and KAEC access.','الشواطئ، خليج رابغ، الواجهة','Beaches, Rabigh Bay, waterfront',['beach','family','adventure']),
    d('kaec','مدينة الملك عبدالله الاقتصادية','King Abdullah Economic City','makkah','منطقة مكة المكرمة','Makkah Region','مدينة ساحلية','Coastal city','JED','مدينة ساحلية منظمة للواجهات والمراسي والرياضات البحرية والإقامات القصيرة.','A planned coastal city for marinas, waterfronts, water sports and short stays.','مرسى البيلسان، الواجهة، الجولف','Bay La Sun Marina, waterfront, golf',['beach','luxury','family','shopping']),
    d('al-qunfudhah','القنفذة','Al Qunfudhah','makkah','منطقة مكة المكرمة','Makkah Region','محافظة ساحلية','Coastal governorate','JED','محافظة بحرية جنوب المنطقة يقصدها الزوار للشواطئ والجزر والهدوء.','A southern coastal governorate visited for beaches, islands and slower escapes.','شواطئ القنفذة، جزر، منتزهات بحرية','Al Qunfudhah beaches, islands, seafront parks',['beach','nature','family']),
    d('turbah','تربة','Turbah','makkah','منطقة مكة المكرمة','Makkah Region','محافظة','Governorate','TIF','محافظة على طريق الطائف والجنوب، مع طبيعة مفتوحة ومزارع وامتداد بري.','A governorate on the Taif–south route with open landscapes, farms and road-trip appeal.','المزارع، الأودية، الطرق البرية','Farms, valleys, road trips',['nature','food','adventure']),

    // المدينة المنورة
    d('madinah','المدينة المنورة','Madinah','madinah','منطقة المدينة المنورة','Madinah Region','مدينة','City','MED','مدينة للزيارات الروحانية والتاريخ الإسلامي، مع متاحف ومعالم وممشى قباء.','A city for spiritual visits and Islamic history, with museums, landmarks and Quba Walk.','المسجد النبوي، قباء، جبل أحد، وادي العقيق','Prophet’s Mosque, Quba, Mount Uhud, Wadi Al Aqiq',['culture','wellness','family']),
    d('yanbu','ينبع','Yanbu','madinah','منطقة المدينة المنورة','Madinah Region','مدينة ساحلية','Coastal city','YNB','مدينة بحرية مناسبة للشواطئ والغوص والواجهة والكورنيش.','A Red Sea city for beaches, diving, waterfronts and the corniche.','ينبع البحر، الكورنيش، الغوص، الواجهة','Yanbu Al Bahr, corniche, diving, waterfront',['beach','adventure','family','photography']),
    d('khaybar','خيبر','Khaybar','madinah','منطقة المدينة المنورة','Madinah Region','محافظة','Governorate','MED','واحة تاريخية شمال المدينة تجمع القلاع والنخيل والحمم البركانية.','A historic oasis north of Madinah with forts, palms and volcanic landscapes.','حصون خيبر، الواحة، الحرات البركانية','Khaybar forts, oasis, volcanic fields',['culture','nature','photography']),
    d('badr','بدر','Badr','madinah','منطقة المدينة المنورة','Madinah Region','محافظة','Governorate','MED','محافظة تاريخية على طريق المدينة والساحل، مناسبة للمهتمين بالتاريخ والرحلات البرية.','A historic governorate on the Madinah–coast route for history and road trips.','موقع بدر التاريخي، الأودية، الطريق الساحلي','Historic Badr, valleys, coastal route',['culture','nature']),
    d('wadi-al-faraa','وادي الفرع','Wadi Al Faraa','madinah','منطقة المدينة المنورة','Madinah Region','محافظة','Governorate','MED','وجهة ريفية قريبة من المدينة بطبيعة زراعية وأودية للزيارات الهادئة.','A rural Madinah escape with agricultural landscapes and quiet valleys.','المزارع، الأودية، الطبيعة الريفية','Farms, valleys, rural scenery',['nature','food','family']),

    // الشرقية
    d('dhahran','الظهران','Dhahran','eastern','المنطقة الشرقية','Eastern Province','مدينة','City','DMM','مدينة ثقافية وعائلية قرب الخبر والدمام، مع مراكز علمية وفنون وتسوق.','A cultural and family city near Khobar and Dammam with science, arts and shopping.','إثراء، الظهران مول، الحدائق','Ithra, Dhahran Mall, parks',['culture','family','shopping']),
    d('al-ahsa','الأحساء','Al Ahsa','eastern','المنطقة الشرقية','Eastern Province','محافظة وواحة','Governorate & oasis','HOF','واحة نخيل واسعة تجمع التراث والأسواق والكهوف والعيون والمزارع.','A vast palm oasis blending heritage, markets, caves, springs and farms.','جبل القارة، سوق القيصرية، عين نجم، الواحة','Jabal Al Qarah, Al Qaisariya Souq, Ain Najm, oasis',['culture','nature','food','photography','family']),
    d('hofuf','الهفوف','Al Hofuf','eastern','المنطقة الشرقية','Eastern Province','مدينة','City','HOF','قلب الأحساء الحضري للتراث والأسواق والمقاهي والانطلاق إلى الواحة.','The urban heart of Al Ahsa for heritage, markets, cafés and oasis access.','سوق القيصرية، قصر إبراهيم، حي الكوت','Al Qaisariya Souq, Ibrahim Palace, Al Koot',['culture','food','shopping']),
    d('qatif','القطيف','Qatif','eastern','المنطقة الشرقية','Eastern Province','محافظة ساحلية','Coastal governorate','DMM','منطقة ساحلية ذات تاريخ محلي وأسواق وواجهات قريبة من جزيرة تاروت.','A historic coastal area with local markets and waterfronts near Tarout Island.','قلعة تاروت، الأسواق، الواجهة','Tarout Castle, markets, waterfront',['culture','beach','food']),
    d('tarout','جزيرة تاروت','Tarout Island','eastern','المنطقة الشرقية','Eastern Province','جزيرة','Island','DMM','جزيرة تاريخية في الخليج تشتهر بالقلعة والأحياء القديمة والصيد والواجهة البحرية.','A historic Gulf island known for its fort, old quarters, fishing and waterfront.','قلعة تاروت، الديرة، الميناء','Tarout Castle, old town, harbour',['culture','beach','photography','food']),
    d('jubail','الجبيل','Al Jubail','eastern','المنطقة الشرقية','Eastern Province','مدينة ساحلية','Coastal city','DMM','مدينة بحرية منظمة للواجهات والشواطئ والحدائق والأنشطة العائلية.','A planned coastal city for waterfronts, beaches, parks and family activities.','كورنيش الفناتير، الشواطئ، الحدائق','Fanateer Corniche, beaches, parks',['beach','family','food']),
    d('ras-tanura','رأس تنورة','Ras Tanura','eastern','المنطقة الشرقية','Eastern Province','محافظة ساحلية','Coastal governorate','DMM','ساحل هادئ شمال الدمام للبحر والنزهات والزيارات العائلية.','A quieter coast north of Dammam for sea views, picnics and family visits.','الشواطئ، الكورنيش، الصيد','Beaches, corniche, fishing',['beach','family','nature']),
    d('al-uqair','العقير','Al Uqair','eastern','المنطقة الشرقية','Eastern Province','موقع ساحلي تاريخي','Historic coastal site','HOF','ميناء تاريخي وشاطئ مفتوح بين الأحساء والخليج، مناسب للرحلات البرية والبحرية.','A historic port and open beach between Al Ahsa and the Gulf for road trips and sea days.','ميناء العقير، الشاطئ، المباني التاريخية','Al Uqair Port, beach, historic buildings',['beach','culture','photography','adventure']),
    d('salwa','سلوى','Salwa','eastern','المنطقة الشرقية','Eastern Province','محافظة ساحلية','Coastal governorate','DMM','وجهة خليجية هادئة للمنتجعات والشواطئ والرحلات القصيرة.','A quiet Gulf escape for resorts, beaches and short breaks.','الشواطئ، المنتجعات، الواجهة','Beaches, resorts, waterfront',['beach','wellness','family'])
  );
})();

(function(){
  const d=window.TRAVO_BUILD_SAUDI_DESTINATION;
  window.TRAVO_AIRPORTS.push(
    // الحدود الشمالية
    d('arar','عرعر','Arar','northern-borders','منطقة الحدود الشمالية','Northern Borders Region','مدينة','City','RAE','عاصمة الحدود الشمالية وقاعدة لرحلات الصحراء ومشاهدة اتساع الشمال.','Northern Borders capital and a base for desert journeys across the far north.','الأسواق، المنتزهات، الرحلات البرية','Markets, parks, road trips',['nature','culture','family']),
    d('rafha','رفحاء','Rafha','northern-borders','منطقة الحدود الشمالية','Northern Borders Region','محافظة','Governorate','RAE','محافظة على درب الشمال للرحلات البرية والسماء الصافية والتخييم الشتوي.','A northern stop for road trips, clear skies and winter camping.','التخييم، الطرق الصحراوية، السماء الليلية','Camping, desert roads, night sky',['nature','adventure','photography']),
    d('turayf','طريف','Turaif','northern-borders','منطقة الحدود الشمالية','Northern Borders Region','محافظة','Governorate','TUI','وجهة شمالية لأجواء الشتاء والطرق البرية واستكشاف طبيعة الأطراف.','A far-north destination for winter weather, road trips and frontier landscapes.','السهول، التخييم، الطرق الشمالية','Plains, camping, northern roads',['nature','adventure']),
    d('al-uwayqilah','العويقيلة','Al Uwayqilah','northern-borders','منطقة الحدود الشمالية','Northern Borders Region','محافظة','Governorate','RAE','محافظة صحراوية لمحبي الرحلات الهادئة والتخييم ومسارات الشمال.','A desert governorate for quiet road trips, camping and northern routes.','التخييم، النفود، الطرق البرية','Camping, dunes, road trips',['nature','adventure']),

    // الجوف
    d('sakaka','سكاكا','Sakaka','al-jouf','منطقة الجوف','Al Jouf Region','مدينة','City','AJF','مدينة تاريخية بين القلاع والآثار والزيتون، وهي بوابة الجوف.','A historic city of forts, archaeology and olives, and the gateway to Al Jouf.','قلعة زعبل، أعمدة الرجاجيل، أسواق الزيتون','Zaabal Castle, Rajajil columns, olive markets',['culture','food','photography']),
    d('dumat-al-jandal','دومة الجندل','Dumat Al Jandal','al-jouf','منطقة الجوف','Al Jouf Region','محافظة','Governorate','AJF','وجهة تاريخية للقلعة والبحيرة والمسجد القديم والفعاليات الموسمية.','A historic destination for its fortress, lake, old mosque and seasonal events.','قلعة مارد، بحيرة دومة الجندل، مسجد عمر','Marid Castle, Dumat Al Jandal Lake, Omar Mosque',['culture','nature','photography','family']),
    d('qurayyat','القريات','Al Qurayyat','al-jouf','منطقة الجوف','Al Jouf Region','محافظة','Governorate','URY','بوابة شمالية للزيتون والسهول والطرق المؤدية إلى الجوف.','A northern gateway for olive groves, plains and Al Jouf road trips.','المزارع، الزيتون، السهول','Farms, olives, plains',['food','nature','family']),
    d('tabarjal','طبرجل','Tabarjal','al-jouf','منطقة الجوف','Al Jouf Region','محافظة','Governorate','AJF','محافظة زراعية شمال الجوف للمزارع والمنتجات المحلية والرحلات البرية.','An agricultural north Al Jouf governorate for farms, local products and road trips.','المزارع، المنتجات المحلية، الطرق','Farms, local products, drives',['food','nature','family']),
    d('rajajil','الرجاجيل','Rajajil','al-jouf','منطقة الجوف','Al Jouf Region','موقع أثري','Archaeological site','AJF','موقع أثري شهير بالأعمدة الحجرية قرب سكاكا لمحبي التاريخ والتصوير.','A well-known archaeological site of stone columns near Sakaka for history and photography.','أعمدة الرجاجيل، الصحراء، التصوير','Rajajil columns, desert, photography',['culture','photography']),

    // نجران
    d('najran','نجران','Najran','najran','منطقة نجران','Najran Region','مدينة','City','EAM','مدينة ذات تراث معماري وطيني وتاريخ وحدود طبيعية مميزة جنوب المملكة.','A southern city with distinctive mud-brick architecture, history and dramatic landscapes.','قصر الإمارة التاريخي، الأخدود، الأسواق','Historic Emirate Palace, Al Ukhdood, markets',['culture','food','photography']),
    d('habuna','حبونا','Habuna','najran','منطقة نجران','Najran Region','محافظة','Governorate','EAM','محافظة شرق نجران لجبالها ووديانها وطرقها البرية الهادئة.','An eastern Najran governorate for mountains, valleys and quiet road trips.','الوديان، الجبال، القرى','Valleys, mountains, villages',['nature','adventure','photography']),
    d('badr-al-janoub','بدر الجنوب','Badr Al Janoub','najran','منطقة نجران','Najran Region','محافظة','Governorate','EAM','مرتفعات جنوب نجران ذات أجواء ألطف ومزارع وطرق جبلية.','Southern Najran highlands with milder weather, farms and mountain drives.','المرتفعات، المزارع، الأودية','Highlands, farms, valleys',['nature','food','photography']),
    d('sharurah','شرورة','Sharurah','najran','منطقة نجران','Najran Region','محافظة','Governorate','SHW','بوابة الربع الخالي لمحبي المغامرات الصحراوية والسماء الواسعة.','A gateway to the Empty Quarter for desert adventure and vast skies.','النفود، التخييم، السماء الليلية','Dunes, camping, night sky',['nature','adventure','photography']),
    d('thar','ثار','Thar','najran','منطقة نجران','Najran Region','محافظة','Governorate','EAM','وجهة صحراوية بين نجران وشرورة للطرق البرية والكثبان والهدوء.','A desert destination between Najran and Sharurah for road trips, dunes and quiet.','الكثبان، التخييم، الطرق البرية','Dunes, camping, road trips',['nature','adventure']),
    d('yadamah','يدمة','Yadamah','najran','منطقة نجران','Najran Region','محافظة','Governorate','EAM','محافظة شرقية لامتداد الصحراء والتخييم والرحلات داخل نجران.','An eastern governorate for desert expanse, camping and Najran road trips.','الصحراء، التخييم، المسارات','Desert, camping, routes',['nature','adventure'])
  );
})();

(function(){
  const normalize=value=>String(value||'').toLowerCase().trim().replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[\-_—–,،/]/g,' ').replace(/\s+/g,' ');
  const variants=item=>[item.cityKey,item.cityAr,item.cityEn,item.code,item.airportAr,item.airportEn,...(item.aliases||[])].filter(Boolean).map(normalize);
  window.TRAVO_FIND_CITY=function(value){
    const query=normalize(value);
    if(!query)return null;
    const all=window.TRAVO_AIRPORTS||[];
    return all.find(item=>variants(item).includes(query))||all.find(item=>variants(item).some(name=>query.startsWith(`${name} `)||name.startsWith(`${query} `)))||all.find(item=>variants(item).some(name=>name.length>3&&query.includes(name)))||null;
  };

  const officialDestinationDirectory='https://www.visitsaudi.com/ar/destinations';
  const defaultCityContent=destination=>({
    events:[],concerts:[],
    activities:[{
      titleAr:`خطّط لزيارة ${destination.cityAr}`,titleEn:`Plan your ${destination.cityEn} visit`,
      summaryAr:`ابدأ من الخريطة ثم رتّب المحطات الأقرب لك. من أبرز ما يقصده الزوار: ${destination.highlightsAr}.`,
      summaryEn:`Start with the map and group nearby stops. Visitor highlights include ${destination.highlightsEn}.`,
      areaAr:destination.regionAr,areaEn:destination.regionEn,sourceName:'روح السعودية',sourceUrl:officialDestinationDirectory,mapQuery:destination.mapQuery,badgeAr:destination.typeAr,badgeEn:destination.typeEn,tags:destination.tags
    }],
    places:[{
      titleAr:destination.cityAr,titleEn:destination.cityEn,summaryAr:destination.summaryAr,summaryEn:destination.summaryEn,
      areaAr:destination.regionAr,areaEn:destination.regionEn,sourceName:'دليل TRAVO',sourceUrl:officialDestinationDirectory,mapQuery:destination.mapQuery,badgeAr:destination.typeAr,badgeEn:destination.typeEn,tags:destination.tags
    },{
      titleAr:`أبرز ما يستحق الزيارة في ${destination.cityAr}`,titleEn:`Highlights of ${destination.cityEn}`,
      summaryAr:destination.highlightsAr,summaryEn:destination.highlightsEn,areaAr:destination.regionAr,areaEn:destination.regionEn,
      sourceName:'روح السعودية',sourceUrl:officialDestinationDirectory,mapQuery:destination.mapQuery,badgeAr:'محطات مقترحة',badgeEn:'Suggested stops',tags:destination.tags
    }]
  });
  window.TRAVO_ENSURE_SAUDI_CATALOG=function(catalog){
    const next=catalog&&typeof catalog==='object'?catalog:{cities:{}};
    next.cities=next.cities&&typeof next.cities==='object'?next.cities:{};
    (window.TRAVO_AIRPORTS||[]).forEach(destination=>{
      if(!next.cities[destination.cityKey])next.cities[destination.cityKey]=defaultCityContent(destination);
    });
    return next;
  };
})();

(function(){
  const d=window.TRAVO_BUILD_SAUDI_DESTINATION;
  window.TRAVO_AIRPORTS.push(
    // تبوك
    d('duba','ضباء','Duba','tabuk','منطقة تبوك','Tabuk Region','محافظة ساحلية','Coastal governorate','TUU','مدينة على البحر الأحمر للواجهة والشواطئ والصيد والرحلات الساحلية.','A Red Sea town for waterfronts, beaches, fishing and coastal trips.','الكورنيش، الشواطئ، الميناء','Corniche, beaches, harbour',['beach','family','food']),
    d('al-wajh','الوجه','Al Wajh','tabuk','منطقة تبوك','Tabuk Region','محافظة ساحلية','Coastal governorate','EJH','بوابة ساحلية للبحر الأحمر مع شواطئ وجزر وعمارة تاريخية.','A Red Sea coastal gateway with beaches, islands and historic architecture.','البلدة القديمة، الشواطئ، الجزر','Old town, beaches, islands',['beach','culture','photography','adventure']),
    d('haql','حقل','Haql','tabuk','منطقة تبوك','Tabuk Region','محافظة ساحلية','Coastal governorate','TUU','وجهة خليج العقبة للمياه الصافية والشواطئ والجبال القريبة.','A Gulf of Aqaba destination for clear water, beaches and nearby mountains.','شاطئ حقل، حطام السفينة، الجبال','Haql Beach, shipwreck, mountains',['beach','adventure','photography','nature']),
    d('sharma','شرما','Sharma','tabuk','منطقة تبوك','Tabuk Region','قرية ساحلية','Coastal village','TUU','قرية ساحلية هادئة شمال غرب المملكة للبحر والمنتجعات والطرق الجميلة.','A quiet northwest coastal village for sea, resorts and scenic roads.','الشاطئ، الخلجان، المنتجعات','Beach, bays, resorts',['beach','wellness','luxury','photography']),
    d('tayma','تيماء','Tayma','tabuk','منطقة تبوك','Tabuk Region','محافظة','Governorate','TUU','واحة تاريخية عريقة فيها آبار ونقوش وآثار ومسارات صحراوية.','An ancient oasis with wells, inscriptions, archaeology and desert routes.','بئر هداج، النقوش، الواحة','Haddaj Well, inscriptions, oasis',['culture','nature','photography']),
    d('al-bad','البدع','Al Bad','tabuk','منطقة تبوك','Tabuk Region','محافظة','Governorate','TUU','وجهة تاريخية بين الجبال والساحل لآثار مدائن شعيب والمناظر الصحراوية.','A historic mountain-and-coast destination for Madain Shuaib and desert scenery.','مدائن شعيب، الجبال، الوديان','Madain Shuaib, mountains, valleys',['culture','nature','photography']),
    d('wadi-al-disah','وادي الديسة','Wadi Al Disah','tabuk','منطقة تبوك','Tabuk Region','وادي طبيعي','Natural valley','TUU','وادي أخضر بين جبال شاهقة، من أشهر رحلات الطبيعة والتصوير في الشمال الغربي.','A green valley between towering cliffs, among the northwest’s top nature and photo trips.','الوادي، الأعمدة الصخرية، النخيل','Valley, sandstone pillars, palms',['nature','adventure','photography']),
    d('magna','مقنا','Magna','tabuk','منطقة تبوك','Tabuk Region','قرية ساحلية','Coastal village','TUU','قرية على خليج العقبة تجمع الشواطئ والتكوينات الجبلية والطريق الساحلي.','A Gulf of Aqaba village combining beaches, mountain formations and a scenic coastal drive.','الشواطئ، الخلجان، الجبال','Beaches, bays, mountains',['beach','adventure','photography']),

    // حائل
    d('jubbah','جبة','Jubbah','hail','منطقة حائل','Hail Region','محافظة','Governorate','HAS','واحة صحراوية عالمية للنقوش الصخرية والبحيرات الموسمية والكثبان.','A desert oasis renowned for rock art, seasonal lakes and dunes.','النقوش الصخرية، النفود، الواحة','Rock art, dunes, oasis',['culture','nature','photography','adventure']),
    d('shuwaymis','الشويمس','Shuwaymis','hail','منطقة حائل','Hail Region','قرية أثرية','Archaeological village','HAS','موقع للنقوش الصخرية والجبال البركانية في جنوب حائل.','A site for rock art and volcanic landscapes in southern Hail.','النقوش الصخرية، الجبال، الحرات','Rock art, mountains, volcanic fields',['culture','nature','photography']),
    d('fayd','فيد','Fayd','hail','منطقة حائل','Hail Region','مدينة تاريخية','Historic town','HAS','محطة تاريخية على درب زبيدة لمحبي التاريخ والآثار الصحراوية.','A historic stop on the Zubaydah Trail for desert archaeology and history.','درب زبيدة، الآثار، القلاع','Zubaydah Trail, ruins, forts',['culture','photography']),
    d('baqaa','بقعاء','Baqaa','hail','منطقة حائل','Hail Region','محافظة','Governorate','HAS','محافظة واسعة للنفود والرحلات البرية والطبيعة الصحراوية.','A broad governorate for dunes, road trips and desert landscapes.','النفود، التخييم، الطرق البرية','Dunes, camping, road trips',['nature','adventure','photography']),
    d('ajja-salma','جبال أجا وسلمى','Aja and Salma Mountains','hail','منطقة حائل','Hail Region','جبال','Mountain range','HAS','سلسلة جبال حول حائل مناسبة للمشي والإطلالات والتخييم في الطقس المعتدل.','Mountain ranges around Hail for hikes, viewpoints and mild-weather camping.','المسارات، الإطلالات، التخييم','Trails, viewpoints, camping',['nature','adventure','photography']),

    // القصيم
    d('buraydah','بريدة','Buraydah','qassim','منطقة القصيم','Qassim Region','مدينة','City','ELQ','عاصمة القصيم لأسواق التمور والمزارع والمتاحف والتجارب المحلية.','Qassim’s capital for date markets, farms, museums and local experiences.','سوق التمور، متحف بريدة، المزارع','Date market, Buraydah Museum, farms',['food','culture','family']),
    d('unaizah','عنيزة','Unaizah','qassim','منطقة القصيم','Qassim Region','مدينة','City','ELQ','مدينة تراثية جميلة للأسواق والمزارع والمهرجانات الموسمية والضيافة النجدية.','A charming heritage city for markets, farms, seasonal festivals and Najdi hospitality.','بيت البسام، سوق المسوكف، المزارع','Al Bassam House, Al Musawkaf Market, farms',['culture','food','family','photography']),
    d('al-rass','الرس','Al Rass','qassim','منطقة القصيم','Qassim Region','محافظة','Governorate','ELQ','محافظة وسط القصيم تجمع المزارع والأسواق والحدائق والرحلات العائلية.','A central Qassim governorate with farms, markets, parks and family outings.','المزارع، الأسواق، الحدائق','Farms, markets, parks',['food','family','nature']),
    d('al-bukayriyah','البكيرية','Al Bukayriyah','qassim','منطقة القصيم','Qassim Region','محافظة','Governorate','ELQ','وجهة ريفية في القصيم للمزارع والتمور والطرق الهادئة.','A rural Qassim getaway for farms, dates and quiet drives.','المزارع، أسواق التمور، المنتزهات','Farms, date markets, parks',['food','nature','family']),
    d('al-mithnab','المذنب','Al Mithnab','qassim','منطقة القصيم','Qassim Region','محافظة','Governorate','ELQ','محافظة تراثية لأسواقها وبيئتها الزراعية وطرق القصيم الداخلية.','A heritage governorate with markets, agriculture and central Qassim routes.','الأسواق، النخيل، التراث','Markets, palms, heritage',['culture','food']),
    d('uyun-al-jiwa','عيون الجواء','Uyun Al Jiwa','qassim','منطقة القصيم','Qassim Region','محافظة','Governorate','ELQ','وجهة تراثية زراعية فيها آبار ونخيل ومواقع من تاريخ نجد.','An agricultural heritage destination with wells, palms and Najdi history.','الآبار، النخيل، المواقع التراثية','Wells, palms, heritage sites',['culture','nature','food']),
    d('al-badayea','البدائع','Al Badayea','qassim','منطقة القصيم','Qassim Region','محافظة','Governorate','ELQ','محافظة للمزارع والتمور وتجارب الريف القصيمي.','A governorate for farms, dates and Qassim countryside experiences.','المزارع، التمور، الأجواء الريفية','Farms, dates, countryside',['food','nature','family']),
    d('al-shimasiyah','الشماسية','Al Shimasiyah','qassim','منطقة القصيم','Qassim Region','محافظة','Governorate','ELQ','وجهة شمال شرق القصيم للمنتزهات والمزارع والرحلات القصيرة.','A northeast Qassim destination for parks, farms and short trips.','المزارع، المنتزهات، الطرق الهادئة','Farms, parks, quiet roads',['nature','family'])
  );
})();

(function(){
  const d=window.TRAVO_BUILD_SAUDI_DESTINATION;
  window.TRAVO_AIRPORTS.push(
    // عسير
    d('khamis-mushait','خميس مشيط','Khamis Mushait','asir','منطقة عسير','Aseer Region','مدينة','City','AHB','مدينة نشطة في عسير، قريبة من الطبيعة والأسواق والوجهات الجبلية.','A lively Aseer city close to nature, markets and mountain destinations.','جادة خميس مشيط، الأسواق، المنتزهات','Khamis Mushait Boulevard, markets, parks',['shopping','food','family']),
    d('rijal-almaa','رجال ألمع','Rijal Almaa','asir','منطقة عسير','Aseer Region','قرية تراثية','Heritage village','AHB','قرية حجرية مشهورة بعمارتها العسيرية ومتحفها وإطلالاتها الجبلية.','A famed stone village for Aseeri architecture, museum and mountain views.','قرية رجال ألمع، المتحف، الإطلالات','Rijal Almaa village, museum, viewpoints',['culture','photography','nature','family'],['Rijal Alma']),
    d('al-soudah','السودة','Al Soudah','asir','منطقة عسير','Aseer Region','موقع جبلي','Mountain area','AHB','أعلى أجواء عسير لمحبي الضباب والغابات والمشي والإطلالات.','One of Aseer’s highest escapes for mist, forests, hiking and views.','الغابات، المسارات، الإطلالات، التلفريك','Forests, trails, viewpoints, cable car',['nature','adventure','photography','wellness']),
    d('al-namas','النماص','Al Namas','asir','منطقة عسير','Aseer Region','محافظة','Governorate','AHB','محافظة جبلية باردة نسبيًا، مع غابات وممرات ومنازل تراثية.','A relatively cool mountain governorate with forests, roads and heritage homes.','غابات النماص، القرى التراثية، الإطلالات','Al Namas forests, heritage villages, viewpoints',['nature','photography','family']),
    d('tanomah','تنومة','Tanomah','asir','منطقة عسير','Aseer Region','محافظة','Governorate','AHB','طبيعة جبلية وغابات كثيفة وأجواء لطيفة في موسم الصيف.','Mountain scenery, dense forests and pleasant summer weather.','غابات تنومة، الأودية، المنتزهات','Tanomah forests, valleys, parks',['nature','wellness','photography','family']),
    d('balqarn','بلقرن','Balqarn','asir','منطقة عسير','Aseer Region','محافظة','Governorate','AHB','وجهة جنوبية للمزارع والمرتفعات والضباب والقرى الريفية.','A southern destination for farms, highlands, mist and rural villages.','المرتفعات، المزارع، الأودية','Highlands, farms, valleys',['nature','food','photography']),
    d('muhayil-asir','محايل عسير','Muhayil Aseer','asir','منطقة عسير','Aseer Region','محافظة','Governorate','AHB','محافظة تهامية بطابع مختلف عن المرتفعات، مع أسواق ومهرجانات شعبية.','A Tihamah governorate with a different climate, local markets and folk festivals.','الأسواق الشعبية، الأودية، الفنون المحلية','Local markets, valleys, folk arts',['culture','food','family']),
    d('al-habala','الحبلة','Al Habala','asir','منطقة عسير','Aseer Region','قرية جبلية','Mountain village','AHB','قرية معلقة على الجبال تشتهر بالتضاريس الحادة وتجارب الإطلالات.','A cliffside village known for dramatic terrain and dramatic viewpoints.','القرية المعلقة، الإطلالات، المسارات','Hanging village, viewpoints, trails',['nature','adventure','photography']),
    d('bishah','بيشة','Bisha','asir','منطقة عسير','Aseer Region','محافظة','Governorate','BHH','محافظة واحة تشتهر بالنخيل والمزارع والطرق المؤدية لجنوب المملكة.','An oasis governorate known for palms, farms and routes across the south.','النخيل، المزارع، الأسواق المحلية','Date palms, farms, local markets',['food','nature','family']),
    d('ahad-rafidah','أحد رفيدة','Ahad Rafidah','asir','منطقة عسير','Aseer Region','محافظة','Governorate','AHB','محافظة قريبة من أبها وخميس مشيط لرحلات المزارع والطبيعة المحلية.','A nearby Aseer governorate for farms and local nature trips.','المزارع، الوديان، الأسواق','Farms, valleys, markets',['nature','food','family']),
    d('sarat-abidah','سراة عبيدة','Sarat Abidah','asir','منطقة عسير','Aseer Region','محافظة','Governorate','AHB','مرتفعات جنوب عسير للجبال والوديان والرحلات البرية الهادئة.','Southern Aseer highlands for mountains, valleys and calm road trips.','المرتفعات، الأودية، المسارات','Highlands, valleys, trails',['nature','adventure','photography']),

    // الباحة
    d('al-baha','الباحة','Al Baha','al-baha','منطقة الباحة','Al Baha Region','مدينة','City','ABT','مدينة جبلية تجمع الغابات والحدائق والطبيعة والقرى التراثية.','A mountain city blending forests, parks, nature and heritage villages.','غابة رغدان، جبل شدا، منتزه الأمير حسام','Raghadan Forest, Jabal Shada, Prince Hussam Park',['nature','family','photography','wellness']),
    d('baljurashi','بلجرشي','Baljurashi','al-baha','منطقة الباحة','Al Baha Region','محافظة','Governorate','ABT','محافظة جبلية فيها أسواق شعبية وغابات وإطلالات وطرق جميلة.','A mountain governorate with folk markets, forests, views and scenic roads.','سوق السبت، الغابات، الإطلالات','Saturday market, forests, viewpoints',['nature','culture','food','family']),
    d('al-mandaq','المندق','Al Mandaq','al-baha','منطقة الباحة','Al Baha Region','محافظة','Governorate','ABT','وجهة صيفية للغابات والضباب والمنتزهات العائلية.','A summer destination for forests, mist and family parks.','غابة الخيرة، المنتزهات، المسارات','Al Khayrah Forest, parks, trails',['nature','wellness','family','photography']),
    d('dhi-ain','ذي عين','Dhee Ain','al-baha','منطقة الباحة','Al Baha Region','قرية تراثية','Heritage village','ABT','قرية رخامية تاريخية مبنية على سفح جبل، من أبرز وجهات التراث في الباحة.','A historic marble-stone village on a mountain slope, among Al Baha’s top heritage sites.','القرية التراثية، المزارع، الإطلالات','Heritage village, farms, viewpoints',['culture','photography','nature'],['Dhee Ain Village','Thee Ain']),
    d('al-mikhwah','المخواة','Al Mikhwah','al-baha','منطقة الباحة','Al Baha Region','محافظة','Governorate','ABT','بوابة تهامة الباحة، مناسبة للقرى التراثية والتنوع الطبيعي بين السهل والجبل.','A gateway to Tihamah Al Baha, with heritage villages and varied mountain-to-plain scenery.','ذي عين، الأودية، المزارع','Dhee Ain, valleys, farms',['nature','culture','food']),
    d('shada-al-asfal','شدا الأسفل','Shada Al Asfal','al-baha','منطقة الباحة','Al Baha Region','قرية جبلية','Mountain village','ABT','قرية جبلية قرب جبال شدا لمحبي التضاريس والقرى الريفية والتصوير.','A mountain village near Jabal Shada for terrain, rural heritage and photography.','جبال شدا، الكهوف، القرى','Jabal Shada, caves, villages',['nature','adventure','photography']),
    d('al-qura','القرى','Al Qura','al-baha','منطقة الباحة','Al Baha Region','محافظة','Governorate','ABT','محافظة على طريق الباحة والطائف تجمع الطبيعة والقرى والمزارع الموسمية.','A governorate on the Al Baha–Taif route with nature, villages and seasonal farms.','المزارع، الغابات، الطرق الجبلية','Farms, forests, mountain roads',['nature','food','family']),
    d('raghdan','رغدان','Raghadan','al-baha','منطقة الباحة','Al Baha Region','موقع طبيعي','Natural site','ABT','غابة ومنتزه مشهوران داخل الباحة للنزهات والضباب والأجواء العائلية.','A famous forest and park in Al Baha for picnics, mist and family time.','غابة رغدان، المسارات، الإطلالات','Raghadan Forest, trails, viewpoints',['nature','family','wellness']),

    // جازان
    d('jazan','جازان','Jazan','jazan','منطقة جازان','Jazan Region','مدينة','City','GIZ','مدينة ساحلية جنوبية تجمع الواجهة والمطاعم والأسواق والانطلاق إلى الجزر والجبال.','A southern coastal city for waterfronts, local dining, markets and access to islands and mountains.','الواجهة البحرية، الأسواق، الكورنيش','Waterfront, markets, corniche',['beach','food','family']),
    d('farasan','جزر فرسان','Farasan Islands','jazan','منطقة جازان','Jazan Region','جزر','Islands','GIZ','أشهر جزر جنوب المملكة للشواطئ والغوص والرحلات البحرية والحياة الفطرية.','Saudi Arabia’s best-known southern islands for beaches, diving, boat trips and wildlife.','الشواطئ، الغوص، القرى القديمة، المانغروف','Beaches, diving, old villages, mangroves',['beach','adventure','nature','photography']),
    d('fayfa','فيفاء','Fayfa','jazan','منطقة جازان','Jazan Region','محافظة جبلية','Mountain governorate','GIZ','جبال مدرجة خضراء تمنح تجربة مختلفة للضباب والقهوة والتصوير.','Terraced green mountains for mist, coffee and photography.','المدرجات الزراعية، الإطلالات، القهوة','Terraces, viewpoints, coffee',['nature','photography','food','adventure']),
    d('al-dayir','الدائر','Al Dayer','jazan','منطقة جازان','Jazan Region','محافظة جبلية','Mountain governorate','GIZ','وجهة البن الخولاني والمرتفعات والقرى الجبلية شرق جازان.','The Khawlani coffee and highlands destination east of Jazan.','مزارع البن، الجبال، القرى','Coffee farms, mountains, villages',['nature','food','photography']),
    d('sabya','صبيا','Sabya','jazan','منطقة جازان','Jazan Region','محافظة','Governorate','GIZ','محافظة قريبة من جازان بأسواق محلية وقرى وموقع مناسب لاستكشاف تهامة.','A governorate near Jazan with local markets, villages and Tihamah access.','الأسواق، القرى، الأودية','Markets, villages, valleys',['culture','food','family']),
    d('abu-arish','أبو عريش','Abu Arish','jazan','منطقة جازان','Jazan Region','محافظة','Governorate','GIZ','وجهة محلية للتراث والأسواق والمزارع القريبة من مدينة جازان.','A local destination for heritage, markets and farms near Jazan city.','الأسواق الشعبية، المزارع، التراث','Folk markets, farms, heritage',['culture','food','family']),
    d('al-aridah','العارضة','Al Aridah','jazan','منطقة جازان','Jazan Region','محافظة جبلية','Mountain governorate','GIZ','محافظة خضراء شرق جازان للوديان والجبال والطبيعة الموسمية.','A green eastern Jazan governorate for valleys, mountains and seasonal scenery.','الأودية، الجبال، المزارع','Valleys, mountains, farms',['nature','adventure','photography']),
    d('samtah','صامطة','Samtah','jazan','منطقة جازان','Jazan Region','محافظة','Governorate','GIZ','محافظة جنوب جازان مناسبة للتعرف على الأسواق والأكل المحلي والقرى.','A southern Jazan governorate for local markets, food and village life.','الأسواق، المأكولات الشعبية، القرى','Markets, local food, villages',['food','culture','family']),
    d('al-harth','الحرث','Al Harth','jazan','منطقة جازان','Jazan Region','محافظة','Governorate','GIZ','منطقة وديان وجبال شرق جازان لمن يحب الطرق الطبيعية الهادئة.','An eastern Jazan area of valleys and mountains for quiet scenic drives.','وادي لجب القريب، الجبال، الأودية','Nearby Wadi Lajab, mountains, valleys',['nature','adventure','photography'])
  );
})();
