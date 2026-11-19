import Link from 'next/link';
import { db } from '@/lib/db';

export default async function ContactPage(){
  const rows=await db.siteSetting.findMany();
  const s=Object.fromEntries(rows.map(x=>[x.key,x.value]));
  const brand=s.business_name||'The Royal Beauty';
  const phone=s.phone||s.business_phone||'+91 77038 29192';
  const email=s.email||'bookings@theroyalbeauty.in';
  const city=s.business_city||'Delhi-NCR';
  const address=s.contact_address||city;
  const hours=s.opening_hours||'9:00 AM – 7:30 PM';
  const whatsapp=s.whatsapp_url||'';

  return <main className="info-page">
    <section className="info-hero"><div className="container">
      <div className="beauty-script-kicker">We’re here for you</div>
      <h1>Contact Us</h1>
      <p>Have a question about a service, booking, or availability? Reach out to {brand}.</p>
    </div></section>
    <section className="container info-grid">
      <div className="info-card"><div className="info-icon">☎</div><h2>Phone Number</h2><p>Call us for bookings and assistance.</p><a href={'tel:'+phone.replace(/[^0-9+]/g,'')}>{phone}</a></div>
      <div className="info-card"><div className="info-icon">✉</div><h2>Email Address</h2><p>Send us your questions or booking details.</p><a href={'mailto:'+email}>{email}</a></div>
      <div className="info-card"><div className="info-icon">⌖</div><h2>Office Location</h2><p>{address}</p><span>{city}</span></div>
      <div className="info-card"><div className="info-icon">◷</div><h2>Opening Hours</h2><p>Appointments every day.</p><span>{hours}</span></div>
    </section>
    <section className="container info-actions">
      <Link href="/booking" className="beauty-book-btn">BOOK A SERVICE <span>›</span></Link>
      {whatsapp&&<a href={whatsapp} target="_blank" rel="noreferrer" className="beauty-call-btn">WHATSAPP US</a>}
    </section>
  </main>;
}
