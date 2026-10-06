window.TRAVO_SAUDI_GALLERY=[
  {key:'riyadh',labelAr:'الرياض',labelEn:'Riyadh',image:'https://images.unsplash.com/photo-1674822858255-fcc093a1ef43?auto=format&fit=crop&w=1800&q=88'},
  {key:'jeddah',labelAr:'جدة',labelEn:'Jeddah',image:'https://book.txsaudi.com/Images2/eXchange/3cd49b18-7500-4f31-881a-06cccb9d842a.jpg'},
  {key:'alula',labelAr:'العلا',labelEn:'AlUla',image:'https://images.unsplash.com/photo-1738006996209-40401cbd3664?auto=format&fit=crop&w=1800&q=88'},
  {key:'saudi-nature',labelAr:'طبيعة السعودية',labelEn:'Saudi nature',image:'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1800&q=88'}
];

window.TRAVO_DEFAULT_SAUDI_IMAGE=window.TRAVO_SAUDI_GALLERY[0].image;
window.TRAVO_DESTINATION_THEMES={
  riyadh:{countryAr:'السعودية',countryEn:'Saudi Arabia',flag:'🇸🇦',c1:'#8b5cf6',c2:'#c4b5fd',image:window.TRAVO_SAUDI_GALLERY[0].image},
  jeddah:{countryAr:'السعودية',countryEn:'Saudi Arabia',flag:'🇸🇦',c1:'#0ea5a8',c2:'#7dd3fc',image:window.TRAVO_SAUDI_GALLERY[1].image},
  alula:{countryAr:'السعودية',countryEn:'Saudi Arabia',flag:'🇸🇦',c1:'#9a5a39',c2:'#f2bf7e',image:window.TRAVO_SAUDI_GALLERY[2].image},
  taif:{countryAr:'السعودية',countryEn:'Saudi Arabia',flag:'🇸🇦',c1:'#7c3c9d',c2:'#f0abfc',image:window.TRAVO_SAUDI_GALLERY[3].image},
  abha:{countryAr:'السعودية',countryEn:'Saudi Arabia',flag:'🇸🇦',c1:'#0f766e',c2:'#67e8c9',image:window.TRAVO_SAUDI_GALLERY[3].image},
  khobar:{countryAr:'السعودية',countryEn:'Saudi Arabia',flag:'🇸🇦',c1:'#1d4ed8',c2:'#67e8f9',image:window.TRAVO_SAUDI_GALLERY[1].image},
  dammam:{countryAr:'السعودية',countryEn:'Saudi Arabia',flag:'🇸🇦',c1:'#1d4ed8',c2:'#67e8f9',image:window.TRAVO_SAUDI_GALLERY[1].image},
  diriyah:{countryAr:'السعودية',countryEn:'Saudi Arabia',flag:'🇸🇦',c1:'#8a5a2b',c2:'#e8be83',image:window.TRAVO_SAUDI_GALLERY[0].image},
  hail:{countryAr:'السعودية',countryEn:'Saudi Arabia',flag:'🇸🇦',c1:'#b45309',c2:'#fbbf24',image:window.TRAVO_SAUDI_GALLERY[3].image},
  tabuk:{countryAr:'السعودية',countryEn:'Saudi Arabia',flag:'🇸🇦',c1:'#047857',c2:'#6ee7b7',image:window.TRAVO_SAUDI_GALLERY[3].image},
  umluj:{countryAr:'السعودية',countryEn:'Saudi Arabia',flag:'🇸🇦',c1:'#0369a1',c2:'#67e8f9',image:window.TRAVO_SAUDI_GALLERY[1].image}
};

window.TRAVO_RESET_BRAND_THEME=function(){
  const root=document.documentElement;
  root.style.setProperty('--p','#8b5cf6');
  root.style.setProperty('--p2','#c084fc');
};

window.TRAVO_APPLY_DESTINATION_THEME=function(cityKey,opts={}){
  const theme=window.TRAVO_DESTINATION_THEMES?.[cityKey];
  if(!theme)return null;
  const root=document.documentElement;
  root.style.setProperty('--p',theme.c1);
  root.style.setProperty('--p2',theme.c2);
  const visual=theme.image?`url('${theme.image}')`:`linear-gradient(135deg,${theme.c1},${theme.c2})`;
  if(opts.target==='discover')root.style.setProperty('--discover-image',visual);
  else root.style.setProperty('--trip-hero',visual);
  return theme;
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
