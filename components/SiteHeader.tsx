'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
type Settings=Record<string,string>;
export default function SiteHeader({settings}:{settings?:Settings}){
 const pathname=usePathname(); const [open,setOpen]=useState(false);
 if(pathname.startsWith('/admin')) return null;
 const close=()=>setOpen(false); const brand=settings?.business_name||'The Royal Beauty'; const city=settings?.business_city||'Delhi-NCR';
 const phone=settings?.phone||settings?.business_phone||'+91 77038 29192';
 const promo=settings?.promo_text||'₹100 OFF on Any Beauty Service | Code: BEAUTY100 | Minimum Service Value: ₹1,299';
 return <>
  <div className="promo-strip site-promo">{promo}</div>
  <header className="site-header beauty-site-header"><div className="container site-header-inner">
   <a className="beauty-call-us" href={'tel:'+phone.replace(/[^0-9+]/g,'')}>Call Us</a>
   <Link className="beauty-brand" href="/" onClick={close}>{settings?.logo_url?<img src={settings.logo_url} alt={brand} className="site-logo-image"/>:<span>{brand}</span>}</Link>
   <button className={'menu-toggle '+(open?'open':'')} type="button" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(v=>!v)}><span></span><span></span><span></span></button>
  </div></header>
  {open&&<><button className="menu-backdrop" aria-label="Close menu" onClick={close}></button><aside className="site-menu beauty-menu">
   <div className="site-menu-top"><div><div className="menu-eyebrow">{brand.toUpperCase()}</div><h2>{settings?.hero_tagline||'Beauty services at home.'}</h2></div><button className="menu-close" onClick={close}>×</button></div>
   <nav className="site-menu-links"><Link href="/" onClick={close}>Home <span>→</span></Link><Link href="/services" onClick={close}>Services <span>→</span></Link><Link href="/booking" onClick={close}>Book Now <span>→</span></Link><Link href="/customer" onClick={close}>Login/Register <span>→</span></Link><Link href="/contact" onClick={close}>Contact Us <span>→</span></Link></nav>
   <div className="site-menu-note"><b>{city}</b><span>{settings?.short_description||'Professional beauty services delivered to your doorstep.'}</span></div>
  </aside></>}
 </>;
}
