'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Settings = Record<string, string>;

function CartIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.1 10.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L20 8H6"/><circle cx="9" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/></svg>;
}
function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.1 11.7a8.1 8.1 0 0 1-12 7L3.8 20l1.4-4A8.1 8.1 0 1 1 20.1 11.7Z"/><path d="M8.8 8.2c.2-.3.5-.4.8-.2l1 .8c.3.2.3.5.2.8l-.4.7c.5.9 1.2 1.6 2.1 2.1l.7-.4c.3-.2.6-.1.8.1l.8 1c.2.3.1.6-.2.8-.6.5-1.2.7-1.8.5-2.1-.7-4.1-2.6-5.2-4.6-.3-.6-.1-1.2.4-1.6Z"/></svg>;
}
function BookIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5.5" width="16" height="15" rx="2"/><path d="M8 3.5v4M16 3.5v4M4 10h16M8 14h3M8 17h5"/></svg>;
}

export default function SiteFooter({settings}:{settings?:Settings}) {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  const whatsapp=settings?.whatsapp_url;
  const brand=settings?.business_name || 'The Royal Beauty';
  const logo=settings?.logo_url;
  const city=settings?.business_city || 'Delhi-NCR';
  const hours=settings?.opening_hours || '9:00 AM – 7:30 PM';

  return (
    <footer className="footer">
      <div className="footer-actions" aria-label="Quick actions">
        <Link href="/booking" className="footer-action">
          <span className="footer-icon"><CartIcon /></span>
          <span><b>My Cart</b><small>0</small></span>
        </Link>
        {whatsapp ? (
          <a href={whatsapp} className="footer-action" target="_blank" rel="noreferrer">
            <span className="footer-icon"><WhatsAppIcon /></span>
            <span><b>WhatsApp</b></span>
          </a>
        ) : (
          <Link href="/booking" className="footer-action">
            <span className="footer-icon"><WhatsAppIcon /></span>
            <span><b>WhatsApp</b></span>
          </Link>
        )}
        <Link href="/booking" className="footer-action footer-action-highlight">
          <span className="footer-icon"><BookIcon /></span>
          <span><b>Book now</b></span>
        </Link>
      </div>
      <div className="container footer-brand">
        <div className="logo">{logo ? <img src={logo} alt={brand} className="site-logo-image" /> : brand}</div>
        <p className="muted">Professional beauty services at your doorstep · {city}</p>
        <p className="muted">Appointments: {hours}</p>
      </div>
    </footer>
  );
}
