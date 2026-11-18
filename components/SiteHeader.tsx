'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
type Settings=Record<string,string>;
export default function SiteHeader({settings}:{settings?:Settings}){
 const pathname=usePathname(); const [open,setOpen]=useState(false);
 if(pathname.startsWith('/admin')) return null;
 const close=()=>setOpen(false); const brand=settings?.business_name||'The Royal Beauty'; const city=settings?.business_city||'Delhi-NCR';
 return <><header className="site-header"><div className="container site-header-inner">
  <Link className="logo" href="/" onClick={close}>{brand}</Link><div className="site-header-actions">
   <Link className="btn header-book-btn" href="/booking" onClick={close}>Book a service</Link>
   <button className={'menu-toggle '+(open?'open':'')} type="button" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(v=>!v)}><span></span><span></span><span></span></button>
  </div></div></header>
  {open&&<><button className="menu-backdrop" aria-label="Close menu" onClick={close}></button><aside className="site-menu" aria-label="Main menu">
   <div className="site-menu-top"><div><div className="menu-eyebrow">{brand.toUpperCase()}</div><h2>{settings?.hero_tagline||'Everything beauty, at home.'}</h2></div><button className="menu-close" onClick={close} aria-label="Close menu">×</button></div>
   <nav className="site-menu-links"><Link href="/" onClick={close}>Home <span>→</span></Link><Link href="/services" onClick={close}>Services <span>→</span></Link><Link href="/booking" onClick={close}>Book a service <span>→</span></Link><Link href="/customer" onClick={close}>My bookings <span>→</span></Link></nav>
   <div className="site-menu-note"><b>{city}</b><span>{settings?.short_description||'Professional beauty services delivered to your doorstep.'}</span></div>
  </aside></>}</>;
}
