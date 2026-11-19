'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useCart } from './CartProvider';

type Settings = Record<string, string>;

export default function SiteHeader({settings}:{settings?:Settings}){
 const pathname=usePathname();
 const [open,setOpen]=useState(false);
 const {count}=useCart();
 if(pathname.startsWith('/admin')) return null;
 const close=()=>setOpen(false);
 const brand=settings?.business_name||'The Royal Beauty';
 const city=settings?.business_city||'Delhi-NCR';
 const promoEnabled=settings?.promo_enabled !== 'false';
 const promo=settings?.promo_text||'₹100 OFF on Any Beauty Service | Code: BEAUTY100 | Minimum Service Value: ₹1,299';

 return <>
  {promoEnabled && promo.trim() && <div className="promo-strip site-promo">{promo}</div>}
  <header className="site-header">
   <div className="container site-header-inner">
    <Link className="logo" href="/" onClick={close}>
     {settings?.logo_url ? <img src={settings.logo_url} alt={brand} className="site-logo-image" /> : brand}
    </Link>
    <div className="site-header-actions">
     <Link className="header-cart-link" href="/cart" onClick={close} aria-label={`My cart${count ? `, ${count} item${count===1?'':'s'} ` : ''}`}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.1 10.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L20 8H6"/><circle cx="9" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/></svg><span>Cart</span>{count>0&&<b>{count}</b>}
     </Link>
     <Link className="btn header-book-btn" href="/booking" onClick={close}>Book a service</Link>
     <button className={'menu-toggle '+(open?'open':'')} type="button" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(v=>!v)}>
      <span></span><span></span><span></span>
     </button>
    </div>
   </div>
  </header>
  {open&&<>
   <button className="menu-backdrop" aria-label="Close menu" onClick={close}></button>
   <aside className="site-menu" aria-label="Main menu">
    <div className="site-menu-top">
     <div>
      <div className="menu-eyebrow">{brand.toUpperCase()}</div>
      <h2>{settings?.hero_tagline||'Everything beauty, at home.'}</h2>
     </div>
     <button className="menu-close" onClick={close} aria-label="Close menu">×</button>
    </div>
    <nav className="site-menu-links">
     <Link href="/" onClick={close}>Home <span>→</span></Link>
     <Link href="/services" onClick={close}>Services <span>→</span></Link>
     <Link href="/cart" onClick={close}>My Cart {count>0&&<small>({count})</small>} <span>→</span></Link>
     <Link href="/booking" onClick={close}>Book a service <span>→</span></Link>
     <Link href="/customer" onClick={close}>My bookings <span>→</span></Link>
    </nav>
    <div className="site-menu-note">
     <b>{city}</b>
     <span>{settings?.short_description||'Professional beauty services delivered to your doorstep.'}</span>
    </div>
   </aside>
  </>}
 </>;
}
