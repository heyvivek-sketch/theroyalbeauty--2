'use client';

import {useEffect,useMemo,useState} from 'react';
import Link from 'next/link';
import {useCart} from '@/components/CartProvider';

function CheckIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>}
function CalendarIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13H4V6a1 1 0 0 1 1-1Z"/><path d="M8 13h3M8 17h3M14 13h2"/></svg>}
function ClockIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg>}
function TagIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 5 9-1 7 7-8 8-7-7V5Z"/><circle cx="8.5" cy="8.5" r="1"/></svg>}

export default function Booking(){
  const {add,items}=useCart();
  const [services,setServices]=useState<any[]>([]),[slots,setSlots]=useState<any[]>([]),[form,setForm]=useState<any>({serviceIds:[],date:'',slotId:'',name:'',phone:'',email:'',password:'',address:'',city:'Delhi',pincode:'',notes:'',coupon:''}),[coupon,setCoupon]=useState<any>(null),[msg,setMsg]=useState(''),[submitting,setSubmitting]=useState(false),[rememberDetails,setRememberDetails]=useState(true);
  useEffect(()=>{fetch('/api/services').then(r=>r.json()).then(setServices);const d=new Date(Date.now()+86400000).toISOString().slice(0,10);try{const saved=JSON.parse(localStorage.getItem('trb_booking_profile')||'null');const ids=(new URLSearchParams(window.location.search).get('serviceIds')||'').split(',').filter(Boolean).map(Number).filter(Boolean);const single=Number(new URLSearchParams(window.location.search).get('service')||0);setForm((x:any)=>({...x,date:d,...(saved||{}),serviceIds:ids.length?ids:(single?[single]:x.serviceIds)}));}catch{setForm((x:any)=>({...x,date:d}))}},[]);
  useEffect(()=>{if(form.date)fetch('/api/slots?date='+form.date).then(r=>r.json()).then(setSlots)},[form.date]);
  const selected=useMemo(()=>services.filter(s=>form.serviceIds.includes(s.id)),[services,form.serviceIds]);
  const subtotal=selected.reduce((n,s)=>n+s.price,0),total=coupon?.total??subtotal;
  function toggle(id:number){setForm((x:any)=>({...x,serviceIds:x.serviceIds.includes(id)?x.serviceIds.filter((v:number)=>v!==id):[...x.serviceIds,id]}));setCoupon(null)}
  function addServiceToCart(service:any){
    if(!items.some(i=>i.id===service.id)) add({id:service.id,name:service.name,price:service.price,duration:service.duration,image:service.image||undefined});
    if(!form.serviceIds.includes(service.id)) setForm((x:any)=>({...x,serviceIds:[...x.serviceIds,service.id]}));
  }
  async function applyCoupon(){if(!form.coupon)return;const r=await fetch('/api/coupons',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:form.coupon,subtotal})});setCoupon(await r.json())}
  async function submit(e:any){e.preventDefault();if(submitting)return;setSubmitting(true);setMsg('Booking your appointment…');try{if(rememberDetails){localStorage.setItem('trb_booking_profile',JSON.stringify({name:form.name,phone:form.phone,email:form.email,address:form.address,city:form.city,pincode:form.pincode}));} const r=await fetch('/api/bookings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,slotId:Number(form.slotId)})});const j=await r.json().catch(()=>({}));if(!r.ok){setMsg(j.error||'Could not create booking. Please check your details and try again.');setSubmitting(false);return}setMsg('Booking confirmed. Redirecting…');location.href='/booking/success?booking='+encodeURIComponent(j.bookingNo)+'&total='+encodeURIComponent(j.total)}catch{setMsg('Booking service is temporarily unavailable. Please try again in a moment.');setSubmitting(false)}}

  return <main className="booking-page">
    <div className="booking-shell">
      <header className="booking-hero">
        <div>
          <span className="booking-kicker">THE ROYAL BEAUTY</span>
          <h1>Book your beauty<br/><em>experience at home.</em></h1>
          <p>Choose your services, preferred time and share your details. We’ll bring salon-quality care to your doorstep.</p>
        </div>
        <div className="booking-hero-badge"><span>✦</span><small>HOME<br/>SERVICE</small></div>
      </header>

      <form className="booking-form" onSubmit={submit}>
        <section className="booking-section">
          <div className="booking-section-head"><div className="step">01</div><div><h2>Choose your services</h2><p>Select one or more services for your appointment.</p></div></div>
          <div className="service-grid">
            {services.map(s=><div className="service-card-wrap" key={s.id}>
              <label className={'service-card '+(form.serviceIds.includes(s.id)?'selected':'')}>
                <input type="checkbox" checked={form.serviceIds.includes(s.id)} onChange={()=>toggle(s.id)}/>
                <span className="service-check">{form.serviceIds.includes(s.id)?<CheckIcon/>:null}</span>
                <div className="service-copy"><h3>{s.name}</h3><p>{s.description}</p></div>
                <div className="service-bottom"><strong>₹{s.price.toLocaleString('en-IN')}</strong><span>{s.duration} min</span></div>
                <button type="button" className={'service-add-cart '+(items.some(i=>i.id===s.id)?'in-cart':'')} onClick={(e)=>{e.preventDefault();e.stopPropagation();addServiceToCart(s)}}>
                  <span>{items.some(i=>i.id===s.id)?'✓ Added to cart':'＋ Add to cart'}</span>
                </button>
              </label>
            </div>)}
          </div>
          {!services.length&&<div className="booking-empty">Loading services…</div>}
        </section>

        <section className="booking-section">
          <div className="booking-section-head"><div className="step">02</div><div><h2>Pick date & time</h2><p>Choose a convenient slot for your home visit.</p></div></div>
          <div className="booking-pick-grid">
            <label className="booking-field"><span><CalendarIcon/> Date</span><input className="input" type="date" min={new Date().toISOString().slice(0,10)} value={form.date} onChange={e=>setForm({...form,date:e.target.value,slotId:''})}/></label>
            <label className="booking-field"><span><ClockIcon/> Time slot</span><select className="input" required value={form.slotId} onChange={e=>setForm({...form,slotId:e.target.value})}><option value="">Select available slot</option>{slots.map(s=><option disabled={!s.available} value={s.id} key={s.id}>{s.start} - {s.end}{s.available?'':' (Booked)'}</option>)}</select></label>
          </div>
        </section>

        <section className="booking-section">
          <div className="booking-section-head"><div className="step">03</div><div><h2>Your details</h2><p>Tell us where and how we can reach you.</p></div></div>
          <div className="booking-fields-grid">
            <input className="input" required placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
            <input className="input" required placeholder="10-digit mobile" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
            <input className="input" placeholder="Email address" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
            <input className="input" type="password" minLength={6} required placeholder="Create account password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
            <input className="input" required placeholder="Pincode" value={form.pincode} onChange={e=>setForm({...form,pincode:e.target.value})}/>
            <input className="input" placeholder="City" value={form.city} onChange={e=>setForm({...form,city:e.target.value})}/>
          </div>
          <textarea className="input booking-textarea" required placeholder="Complete home address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/>
          <input className="input" placeholder="Notes / special instructions" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/>
        </section>

        <section className="booking-checkout">
          <div className="coupon-box">
            <div className="booking-section-head compact"><div className="step">04</div><div><h2>Coupon & total</h2><p>Have a promo code? Apply it before confirming.</p></div></div>
            <div className="coupon-row"><div className="coupon-input"><TagIcon/><input className="input" placeholder="Enter coupon code" value={form.coupon} onChange={e=>setForm({...form,coupon:e.target.value})}/></div><button type="button" className="btn secondary" onClick={applyCoupon}>Apply</button></div>
            {coupon&&!coupon.valid&&<p className="coupon-error">{coupon.error||'Invalid coupon code'}</p>}
            {coupon?.valid&&<p className="coupon-success">Coupon applied • You save ₹{coupon.discount.toLocaleString('en-IN')}</p>}
          </div>
          <aside className="booking-summary">
            <p>Booking summary</p>
            {selected.length?<div className="summary-services">{selected.map(s=><div key={s.id}><span>{s.name}</span><b>₹{s.price.toLocaleString('en-IN')}</b></div>)}</div>:<div className="summary-empty">Select a service to see your total.</div>}
            <div className="summary-line"><span>Subtotal</span><b>₹{subtotal.toLocaleString('en-IN')}</b></div>
            {coupon?.valid&&<div className="summary-line discount"><span>Discount</span><b>-₹{coupon.discount.toLocaleString('en-IN')}</b></div>}
            <div className="summary-total"><span>Total</span><strong>₹{total.toLocaleString('en-IN')}</strong></div>
            <button className="btn booking-confirm" disabled={submitting||!form.serviceIds.length||!form.slotId}>{submitting?'Booking…':'Confirm booking'} <span>{submitting?'…':'→'}</span></button>
            {msg&&<p className="booking-message">{msg}</p>}
          </aside>
        </section>
      </form>
      <p className="booking-manage">Already booked? <Link href="/customer">Manage your bookings →</Link></p>
    </div>
  </main>
}
