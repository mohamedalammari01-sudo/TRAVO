window.TRAVO_DESTINATION_THEMES={
riyadh:{countryAr:'السعودية',countryEn:'Saudi Arabia',flag:'🇸🇦',c1:'#5f8f63',c2:'#c9a96e',image:'https://images.unsplash.com/photo-1674822858255-fcc093a1ef43?auto=format&fit=crop&w=1800&q=88'},
jeddah:{countryAr:'السعودية',countryEn:'Saudi Arabia',flag:'🇸🇦',c1:'#148ea8',c2:'#d7b56d',image:'https://images.unsplash.com/photo-1622274421175-87b87bde7fca?auto=format&fit=crop&w=1800&q=88'},
alula:{countryAr:'السعودية',countryEn:'Saudi Arabia',flag:'🇸🇦',c1:'#b26f43',c2:'#d7b56d',image:'https://images.unsplash.com/photo-1738006996209-40401cbd3664?auto=format&fit=crop&w=1800&q=88'},
dubai:{countryAr:'الإمارات',countryEn:'UAE',flag:'🇦🇪',c1:'#22c1c3',c2:'#d8b26a',image:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1800&q=86'},
abudhabi:{countryAr:'الإمارات',countryEn:'UAE',flag:'🇦🇪',c1:'#167b73',c2:'#c9a56a'},
doha:{countryAr:'قطر',countryEn:'Qatar',flag:'🇶🇦',c1:'#8a1538',c2:'#d6b8c2'},
istanbul:{countryAr:'تركيا',countryEn:'Türkiye',flag:'🇹🇷',c1:'#c63b36',c2:'#d3a259'},
cairo:{countryAr:'مصر',countryEn:'Egypt',flag:'🇪🇬',c1:'#b98543',c2:'#1d1d1f'},
london:{countryAr:'بريطانيا',countryEn:'United Kingdom',flag:'🇬🇧',c1:'#244f9e',c2:'#b72835',image:'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1800&q=86'},
paris:{countryAr:'فرنسا',countryEn:'France',flag:'🇫🇷',c1:'#506ea7',c2:'#d8b6bf',image:'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1800&q=86'},
rome:{countryAr:'إيطاليا',countryEn:'Italy',flag:'🇮🇹',c1:'#55735a',c2:'#b5684a'},
milan:{countryAr:'إيطاليا',countryEn:'Italy',flag:'🇮🇹',c1:'#506c61',c2:'#c8b58a'},
barcelona:{countryAr:'إسبانيا',countryEn:'Spain',flag:'🇪🇸',c1:'#be3e44',c2:'#e5b044'},
madrid:{countryAr:'إسبانيا',countryEn:'Spain',flag:'🇪🇸',c1:'#9d2f39',c2:'#d9b34f'},
amsterdam:{countryAr:'هولندا',countryEn:'Netherlands',flag:'🇳🇱',c1:'#d96f3d',c2:'#496a91'},
zurich:{countryAr:'سويسرا',countryEn:'Switzerland',flag:'🇨🇭',c1:'#b82f3d',c2:'#d9dbe3'},
vienna:{countryAr:'النمسا',countryEn:'Austria',flag:'🇦🇹',c1:'#ae3948',c2:'#d4b48b'},
prague:{countryAr:'التشيك',countryEn:'Czechia',flag:'🇨🇿',c1:'#315f8a',c2:'#b95847'},
athens:{countryAr:'اليونان',countryEn:'Greece',flag:'🇬🇷',c1:'#3d78b4',c2:'#ded7c7'},
tokyo:{countryAr:'اليابان',countryEn:'Japan',flag:'🇯🇵',c1:'#e34876',c2:'#6a5fa4',image:'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1800&q=86'},
bangkok:{countryAr:'تايلاند',countryEn:'Thailand',flag:'🇹🇭',c1:'#7b4d9e',c2:'#d49343'},
singapore:{countryAr:'سنغافورة',countryEn:'Singapore',flag:'🇸🇬',c1:'#d6404a',c2:'#4c8b86'},
kualalumpur:{countryAr:'ماليزيا',countryEn:'Malaysia',flag:'🇲🇾',c1:'#3a6b9c',c2:'#d6a948'},
bali:{countryAr:'إندونيسيا',countryEn:'Indonesia',flag:'🇮🇩',c1:'#31866f',c2:'#c98a52'},
newyork:{countryAr:'الولايات المتحدة',countryEn:'United States',flag:'🇺🇸',c1:'#384d71',c2:'#b84750'}
};
window.TRAVO_APPLY_DESTINATION_THEME=function(cityKey,opts={}){
 const t=window.TRAVO_DESTINATION_THEMES?.[cityKey]; if(!t)return null;
 const root=document.documentElement; root.style.setProperty('--p',t.c1);root.style.setProperty('--p2',t.c2);
 const visual=t.image?`url('${t.image}')`:`linear-gradient(135deg,${t.c1},${t.c2})`;
 if(opts.target==='discover')root.style.setProperty('--discover-image',visual);else root.style.setProperty('--trip-hero',visual);
 return t;
};
