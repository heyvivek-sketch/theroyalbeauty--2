import { db } from '@/lib/db';

export default async function TermsPage(){
  const rows=await db.siteSetting.findMany();
  const s=Object.fromEntries(rows.map(x=>[x.key,x.value]));
  const brand=s.business_name||'The Royal Beauty';
  const phone=s.phone||s.business_phone||'+91 77038 29192';
  const email=s.email||'bookings@theroyalbeauty.in';
  const content=s.terms_content||'All bookings are subject to service availability.\n\nCustomers should provide accurate contact and address details at the time of booking.\n\nOur team may contact you to confirm or reschedule an appointment when required.\n\nPlease review the booking details before confirming your appointment.';
  return <main className="info-page">
    <section className="info-hero"><div className="container">
      <div className="beauty-script-kicker">{brand}</div><h1>Terms and Conditions</h1>
      <p>Please read these terms before booking a service.</p>
    </div></section>
    <section className="container terms-card">
      {content.split(/\n\s*\n/).map((p,i)=><div key={i}><h2>{i+1}. General Terms</h2><p>{p}</p></div>)}
      <div><h2>Contact</h2><p>For questions about these terms, contact <a href={'mailto:'+email}>{email}</a> or <a href={'tel:'+phone.replace(/[^0-9+]/g,'')}>{phone}</a>.</p></div>
    </section>
  </main>;
}
