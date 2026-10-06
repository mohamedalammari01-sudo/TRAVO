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
