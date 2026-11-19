'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
type Settings=Record<string,string>;
function CartIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.1 10.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L20 8H6"/><circle cx="9" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/></svg>}
function WhatsAppIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.1 11.7a8.1 8.1 0 0 1-12 7L3.8 20l1.4-4A8.1 8.1 0 1 1 20.1 11.7Z"/><path d="M8.8 8.2c.2-.3.5-.4.8-.2l1 .8c.3.2.3.5.2.8l-.4.7c.5.9 1.2 1.6 2.1 2.1l.7-.4c.3-.2.6-.1.8.1l.8 1c.2.3.1.6-.2.8-.6.5-1.2.7-1.8.5-2.1-.7-4.1-2.6-5.2-4.6-.3-.6-.1-1.2.4-1.6Z"/></svg>}
function BookIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5.5" width="16" height="15" rx="2"/><path d="M8 3.5v4M16 3.5v4M4 10h16M8 14h3M8 17h5"/></svg>}
export default function SiteFooter({settings}:{settings?:Settings}) {
 const pathname=usePathname(); if(pathname.startsWith('/admin')) return null;
 const brand=settings?.business_name||'The Royal Beauty'; const logo=settings?.logo_url; const city=settings?.business_city||'Delhi-NCR';
 const hours=settings?.opening_hours||'9:00 AM – 7:30 PM'; const phone=settings?.phone||settings?.business_phone||'+91 77038 29192'; const email=settings?.email||'bookings@theroyalbeauty.in'; const whatsapp=settings?.whatsapp_url||'';
 return <footer className="beauty-footer">
  <div className="footer-actions" aria-label="Quick actions"><Link href="/booking" className="footer-action"><span className="footer-icon"><CartIcon/></span><span><b>My Cart</b><small>0</small></span></Link>{whatsapp?<a href={whatsapp} className="footer-action" target="_blank" rel="noreferrer"><span className="footer-icon"><WhatsAppIcon/></span><span><b>WhatsApp</b></span></a>:<a href={'tel:'+phone.replace(/[^0-9+]/g,'')} className="footer-action"><span className="footer-icon"><WhatsAppIcon/></span><span><b>WhatsApp</b></span></a>}<Link href="/booking" className="footer-action footer-action-highlight"><span className="footer-icon"><BookIcon/></span><span><b>Book now</b></span></Link></div>
  <div className="container beauty-footer-main">
   <div className="beauty-footer-about">{logo?<img src={logo} alt={brand} className="beauty-footer-logo"/>:<div className="beauty-footer-wordmark">{brand}</div>}<p>{settings?.short_description||'Professional beauty services at home. Our team brings salon-quality care to the comfort of your home or office.'}</p><h4>We Are Available:</h4><p>Appointments every day, {hours} in the comfort of your home.</p><div className="beauty-socials"><a href="#" aria-label="Facebook">f</a><a href="#" aria-label="Instagram">◎</a></div></div>
   <div className="beauty-footer-col"><h3>Discovers</h3><Link href="/">→ Home</Link><Link href="/customer">→ Login/Register</Link><Link href="/contact">→ Contact Us</Link><Link href="/terms">→ Terms and Conditions</Link></div>
   <div className="beauty-footer-col"><h3>Need Help?</h3><h4>Phone Number</h4><a href={'tel:'+phone.replace(/[^0-9+]/g,'')}>☎ {phone}</a><h4>Email Address</h4><a href={'mailto:'+email}>✉ {email}</a><h4>Office Location</h4><span>⌖ {city}</span></div>
  </div>
  <div className="beauty-copyright">© 2026 <span>{brand.toUpperCase()}</span>. ALL RIGHTS RESERVED. <span className="footer-built-by">Built by <a href="https://growthzync.in/" target="_blank" rel="noreferrer">GrowthZync</a></span></div>
 </footer>;
}
