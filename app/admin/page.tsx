'use client';

import { useEffect, useState, type FormEvent, type ReactNode } from 'react';

type Tab = 'Overview'|'Bookings'|'Customers'|'Services'|'Categories'|'Staff'|'Coupons'|'Slots'|'Areas'|'Reviews'|'Banners'|'Payments'|'Settings'|'Notifications';
const tabs:{name:Tab;icon:string}[]=[
 {name:'Overview',icon:'⌂'},{name:'Bookings',icon:'▣'},{name:'Customers',icon:'♙'},
 {name:'Services',icon:'✦'},{name:'Categories',icon:'◈'},{name:'Staff',icon:'♙'},
 {name:'Coupons',icon:'%'},{name:'Slots',icon:'◷'},{name:'Areas',icon:'⌖'},
 {name:'Reviews',icon:'★'},{name:'Banners',icon:'▤'},{name:'Payments',icon:'₹'},
 {name:'Settings',icon:'⚙'},{name:'Notifications',icon:'✉'}
];
const bookingStatuses=['PENDING','CONFIRMED','ASSIGNED','ON_THE_WAY','STARTED','COMPLETED','CANCELLED','NO_SHOW'];
const paymentStatuses=['PENDING','PAID','FAILED','REFUNDED'];
const money=(n:number)=>'₹'+Number(n||0).toLocaleString('en-IN');
async function api(url:string,options?:RequestInit){const r=await fetch(url,options);const d=await r.json().catch(()=>null);if(!r.ok)throw new Error(d?.error||'Something went wrong');return d}
const post=(url:string,body:any)=>api(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
const patch=(url:string,body:any)=>api(url,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});

function Empty({text}:{text:string}){return <div className="empty-state"><div>✦</div><b>{text}</b><span>New records will appear here automatically.</span></div>}
function Head({title,desc,action}:{title:string;desc?:string;action?:ReactNode}){return <div className="admin-section-head"><div><h2>{title}</h2>{desc&&<p>{desc}</p>}</div>{action}</div>}
function Toggle({active,onClick}:{active:boolean;onClick:()=>void}){return <button className={'switch '+(active?'on':'')} onClick={onClick}><span/></button>}
function Metric({label,value,icon,sub}:{label:string;value:any;icon:string;sub?:string}){return <div className="metric-card"><div className="metric-icon">{icon}</div><div><p>{label}</p><strong>{value}</strong>{sub&&<small>{sub}</small>}</div></div>}

export default function Admin(){
 const [authed,setAuthed]=useState<boolean|null>(null),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState(''),[tab,setTab]=useState<Tab>('Overview'),[data,setData]=useState<any>(null),[mobile,setMobile]=useState(false);
 async function load(){
  try{
    const [overview,settings]=await Promise.all([
      api('/api/admin/overview'),
      api('/api/admin/settings').catch(()=>[])
    ]);
    const settingsMap:any={};
    for(const item of settings) settingsMap[item.key]=item.value;
    setData({...overview,settings:settingsMap});
    setAuthed(true);
  }catch{setAuthed(false)}
}
 useEffect(()=>{load()},[]);
 useEffect(()=>{document.body.style.overflow=mobile?'hidden':'';return()=>{document.body.style.overflow=''}},[mobile]);
 useEffect(()=>{const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')setMobile(false)};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[]);
 async function login(e:FormEvent){e.preventDefault();setError('');try{await post('/api/admin/login',{email,password});await load()}catch(e:any){setError(e.message||'Invalid email or password')}}
 if(authed===null)return <main className="admin-loading"><div className="admin-loading-card"><div className="admin-loading-brand">The <span>Royal Beauty</span></div><div className="admin-loading-mark"><span>RB</span></div><div className="admin-loading-spinner"/><h1>Opening your admin console</h1><p>Preparing bookings, customers, services and storefront settings…</p><div className="admin-loading-progress"><span/></div><small>Secure dashboard · Please wait</small></div></main>;
 if(!authed)return <main className="admin-login"><div className="login-decoration"/><div className="login-card"><div className="admin-brand">The <span>Royal Beauty</span> <small>ADMIN</small></div><div className="login-icon">✦</div><div className="eyebrow">Business control center</div><h1>Welcome back</h1><p className="muted">Manage bookings, customers, services, staff and your storefront from one secure dashboard.</p><form className="form" onSubmit={login}><label>Email<input className="input" type="email" required placeholder="admin@theroyalbeauty.in" value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input className="input" type="password" required placeholder="Your admin password" value={password} onChange={e=>setPassword(e.target.value)}/></label>{error&&<div className="admin-error">{error}</div>}<button className="btn admin-login-btn">Sign in to dashboard</button></form></div></main>;
 return <main className="admin-shell">
  {mobile&&<button className="admin-sidebar-backdrop" aria-label="Close admin menu" onClick={()=>setMobile(false)} />}
  <aside className={'admin-sidebar '+(mobile?'open':'')}><div className="admin-logo">
    {data?.settings?.logo_url ? <img src={data.settings.logo_url} alt={data?.settings?.business_name||'Business logo'} /> : <div className="admin-logo-wordmark">The <span>{data?.settings?.business_name||'Royal Beauty'}</span></div>}
    <div>ADMIN CONSOLE</div>
  </div><nav>{tabs.map(x=><button key={x.name} className={tab===x.name?'admin-nav active':'admin-nav'} onClick={()=>{setTab(x.name);setMobile(false)}}><span>{x.icon}</span>{x.name}</button>)}</nav><div className="sidebar-bottom"><a href="/" target="_blank">↗ View website</a><button onClick={async()=>{await fetch('/api/auth/logout',{method:'POST'});location.reload()}}>↪ Logout</button></div></aside>
  <div className="admin-main"><header className="admin-topbar"><button className="mobile-menu" aria-label={mobile?'Close admin menu':'Open admin menu'} onClick={()=>setMobile(!mobile)}>{mobile?'×':'☰'}</button><h1>{tab}</h1><div className="admin-top-actions"><a href="/" target="_blank" className="admin-view-btn">View website ↗</a></div></header>
  <section className="admin-content">
   {tab==='Overview'&&<Overview data={data} go={setTab}/>}
   {tab==='Bookings'&&<Bookings/>}{tab==='Customers'&&<Customers/>}{tab==='Services'&&<Services/>}{tab==='Categories'&&<Categories/>}
   {tab==='Staff'&&<Staff/>}{tab==='Coupons'&&<Coupons/>}{tab==='Slots'&&<Slots/>}{tab==='Areas'&&<Areas/>}
   {tab==='Reviews'&&<Reviews/>}{tab==='Banners'&&<Banners/>}{tab==='Payments'&&<Payments/>}{tab==='Settings'&&<Settings/>}{tab==='Notifications'&&<Notifications/>}
  </section></div>
 </main>
}

function Overview({data,go}:{data:any;go:(t:Tab)=>void}){
 const s=data?.stats||{};
 return <>
 <div className="metric-grid"><Metric label="Total bookings" value={s.totalBookings||0} icon="▣" sub={s.todayBookings?(s.todayBookings+' today'):undefined}/><Metric label="Customers" value={s.customers||0} icon="♙"/><Metric label="Active services" value={s.services||0} icon="✦"/><Metric label="Paid revenue" value={money(s.revenue)} icon="₹"/></div>
 <div className="metric-grid secondary"><Metric label="Pending bookings" value={s.pendingBookings||0} icon="◷"/><Metric label="Active staff" value={s.staff||0} icon="♙"/><button className="action-card" onClick={()=>go('Bookings')}><b>Manage bookings</b><span>Update status & assign staff →</span></button><button className="action-card" onClick={()=>go('Services')}><b>Manage services</b><span>Pricing, duration & availability →</span></button></div>
 <div className="admin-panel"><Head title="Recent bookings" desc="Latest customer activity."/><BookingTable bookings={data?.bookings||[]} compact/></div></>
}

function BookingTable({bookings,compact=false,onRefresh}:{bookings:any[];compact?:boolean;onRefresh?:()=>void}){
 const [staff,setStaff]=useState<any[]>([]);useEffect(()=>{api('/api/admin/staff').then(setStaff).catch(()=>{})},[]);
 if(!bookings.length)return <Empty text="No bookings found yet."/>;
 return <div className="table-wrap"><table className="admin-table"><thead><tr><th>Booking</th><th>Customer</th><th>Service</th><th>Schedule</th><th>Total</th><th>Status</th>{!compact&&<th>Beautician</th>}<th>Payment</th></tr></thead><tbody>
 {bookings.slice(0,compact?8:200).map((b:any)=><tr key={b.id}><td><b>{b.bookingNo}</b><small>{new Date(b.createdAt).toLocaleDateString('en-IN')}</small></td><td><b>{b.customer?.name||'Guest'}</b><small>{b.customer?.phone||'—'}</small></td><td>{b.items?.map((i:any)=>i.service?.name).join(', ')||'—'}</td><td>{new Date(b.date).toLocaleDateString('en-IN')}<small>{b.slot?.start}–{b.slot?.end}</small></td><td><b>{money(b.total)}</b></td>
 <td><select className="mini-select" value={b.status} onChange={async e=>{try{await patch('/api/admin/bookings',{id:b.id,status:e.target.value});onRefresh?.()}catch(err:any){alert(err.message)}}}>{bookingStatuses.map(x=><option key={x}>{x}</option>)}</select></td>
 {!compact&&<td><select className="mini-select" value={b.staffId||''} onChange={async e=>{try{await patch('/api/admin/bookings',{id:b.id,staffId:e.target.value||null});onRefresh?.()}catch(err:any){alert(err.message)}}}><option value="">Unassigned</option>{staff.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></td>}
 <td><span className={'status-pill '+String(b.paymentStatus||'').toLowerCase()}>{b.paymentStatus}</span></td></tr>)}</tbody></table></div>
}

function Bookings(){const [items,setItems]=useState<any[]>([]),[filter,setFilter]=useState('ALL');async function load(){setItems(await api('/api/admin/bookings').catch(()=>[]))}useEffect(()=>{load()},[]);const rows=filter==='ALL'?items:items.filter(x=>x.status===filter);return <div className="admin-panel"><Head title="Bookings" desc="Full booking control — status, payment and beautician assignment." action={<select className="input filter-select" value={filter} onChange={e=>setFilter(e.target.value)}><option>ALL</option>{bookingStatuses.map(x=><option key={x}>{x}</option>)}</select>}/><BookingTable bookings={rows} onRefresh={load}/></div>}

function Customers(){const [items,setItems]=useState<any[]>([]);async function load(){setItems(await api('/api/admin/customers').catch(()=>[]))}useEffect(()=>{load()},[]);return <><Head title="Customers" desc="Customer directory and booking history."/>
 {!items.length?<Empty text="No customers yet."/>:<div className="admin-list">{items.map(c=><div className="entity-row" key={c.id}><div className="entity-avatar">{(c.name||c.phone||'?').slice(0,1).toUpperCase()}</div><div className="entity-main"><b>{c.name||'Unnamed customer'}</b><span>{c.phone}{c.email?' · '+c.email:''}</span></div><div className="customer-stats"><b>{c._count?.bookings||0}</b><span>bookings</span></div><button className="text-btn" onClick={async()=>{const name=prompt('Customer name',c.name||'');if(name===null)return;const email=prompt('Email',c.email||'');await patch('/api/admin/customers',{id:c.id,name,email});load()}}>Edit</button></div>)}</div>}</>}

function Services(){
 const [items,setItems]=useState<any[]>([]),[cats,setCats]=useState<any[]>([]),[f,setF]=useState<any>({name:'',slug:'',description:'',price:'',duration:'',categoryId:'',image:'',sortOrder:'0'}),[editing,setEditing]=useState<any>(null);
 async function load(){const r=await Promise.all([api('/api/admin/services').catch(()=>[]),api('/api/admin/categories').catch(()=>[])]);setItems(r[0]);setCats(r[1])}
 useEffect(()=>{load()},[]);
 async function saveNew(e:FormEvent){e.preventDefault();try{await post('/api/admin/services',f);setF({name:'',slug:'',description:'',price:'',duration:'',categoryId:'',image:'',sortOrder:'0'});load()}catch(err:any){alert(err.message)}}
 async function saveEdit(e:FormEvent){e.preventDefault();try{await patch('/api/admin/services',{id:editing.id,name:editing.name,slug:editing.slug,description:editing.description,price:editing.price,duration:editing.duration,categoryId:editing.categoryId,image:editing.image,sortOrder:editing.sortOrder,active:editing.active});setEditing(null);load()}catch(err:any){alert(err.message)}}
 return <><Head title="Services" desc="Create and fully edit customer-bookable services."/>
 <div className="admin-panel form-panel"><form className="form grid2" onSubmit={saveNew}>
  <label>Service name<input className="input" required placeholder="Glow Facial" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/></label>
  <label>Slug<input className="input" required placeholder="glow-facial" value={f.slug} onChange={e=>setF({...f,slug:e.target.value})}/></label>
  <label>Price<input className="input" required type="number" min="0" value={f.price} onChange={e=>setF({...f,price:e.target.value})}/></label>
  <label>Duration (minutes)<input className="input" required type="number" min="1" value={f.duration} onChange={e=>setF({...f,duration:e.target.value})}/></label>
  <label>Category<select className="input" required value={f.categoryId} onChange={e=>setF({...f,categoryId:e.target.value})}><option value="">Select category</option>{cats.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
  <label>Image URL <span className="optional">(paste image URL)</span><input className="input" placeholder="https://..." value={f.image} onChange={e=>setF({...f,image:e.target.value})}/></label>
  <label className="full">Description<textarea className="input textarea" rows={3} placeholder="Service description" value={f.description} onChange={e=>setF({...f,description:e.target.value})}/></label>
  <label>Sort order<input className="input" type="number" min="0" value={f.sortOrder} onChange={e=>setF({...f,sortOrder:e.target.value})}/></label>
  <div><button className="btn">+ Add service</button></div>
 </form></div>
 <div className="admin-list">{items.map(s=><div className="entity-row" key={s.id}>
  <div className="service-admin-thumb">{s.image?<img src={s.image} alt="" />:<span>✦</span>}</div>
  <div className="entity-main"><b>{s.name}</b><span>{s.category?.name||'Service'} · {s.duration} min · {money(s.price)} · /{s.slug}</span></div>
  <span className={'status-pill '+(s.active?'success':'muted-pill')}>{s.active?'Active':'Disabled'}</span>
  <Toggle active={s.active} onClick={async()=>{await patch('/api/admin/services',{id:s.id,active:!s.active});load()}}/>
  <button className="text-btn" onClick={()=>setEditing({...s})}>Edit</button>
 </div>)}</div>
 {editing&&<div className="admin-modal-backdrop" onClick={()=>setEditing(null)}><div className="admin-edit-modal" onClick={e=>e.stopPropagation()}>
  <div className="admin-modal-head"><div><span className="eyebrow">SERVICE EDITOR</span><h3>Edit service</h3><p>Update every customer-facing field from one place.</p></div><button className="admin-modal-close" onClick={()=>setEditing(null)}>×</button></div>
  <form className="form grid2" onSubmit={saveEdit}>
   <label>Service name<input className="input" required value={editing.name||''} onChange={e=>setEditing({...editing,name:e.target.value})}/></label>
   <label>Slug<input className="input" required value={editing.slug||''} onChange={e=>setEditing({...editing,slug:e.target.value})}/></label>
   <label>Price<input className="input" required type="number" min="0" value={editing.price??''} onChange={e=>setEditing({...editing,price:e.target.value})}/></label>
   <label>Duration (minutes)<input className="input" required type="number" min="1" value={editing.duration??''} onChange={e=>setEditing({...editing,duration:e.target.value})}/></label>
   <label>Category<select className="input" required value={editing.categoryId??''} onChange={e=>setEditing({...editing,categoryId:e.target.value})}><option value="">Select category</option>{cats.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
   <label>Image URL<input className="input" value={editing.image||''} placeholder="https://..." onChange={e=>setEditing({...editing,image:e.target.value})}/></label>
   <label className="full">Description<textarea className="input textarea" rows={4} value={editing.description||''} onChange={e=>setEditing({...editing,description:e.target.value})}/></label>
   <label>Sort order<input className="input" type="number" min="0" value={editing.sortOrder??0} onChange={e=>setEditing({...editing,sortOrder:e.target.value})}/></label>
   <label className="admin-check"><input type="checkbox" checked={!!editing.active} onChange={e=>setEditing({...editing,active:e.target.checked})}/> Active on website</label>
   {editing.image&&<div className="edit-image-preview"><img src={editing.image} alt="Service preview"/></div>}
   <div className="admin-modal-actions"><button type="button" className="btn secondary-btn" onClick={()=>setEditing(null)}>Cancel</button><button className="btn">Save service changes</button></div>
  </form>
 </div></div>}
 </>
}

function Categories(){
 const [items,setItems]=useState<any[]>([]),[name,setName]=useState(''),[slug,setSlug]=useState(''),[image,setImage]=useState(''),[editing,setEditing]=useState<any>(null);
 async function load(){setItems(await api('/api/admin/categories').catch(()=>[]))}
 useEffect(()=>{load()},[]);
 async function saveEdit(e:FormEvent){e.preventDefault();try{await patch('/api/admin/categories',{id:editing.id,name:editing.name,slug:editing.slug,image:editing.image,active:editing.active,sortOrder:editing.sortOrder});setEditing(null);load()}catch(err:any){alert(err.message)}}
 return <><Head title="Categories" desc="Create and fully edit customer-facing service categories."/>
 <div className="admin-panel form-panel"><form className="form grid2" onSubmit={async e=>{e.preventDefault();try{await post('/api/admin/categories',{name,slug,image});setName('');setSlug('');setImage('');load()}catch(err:any){alert(err.message)}}}>
  <label>Category name<input className="input" required placeholder="Facial" value={name} onChange={e=>setName(e.target.value)}/></label>
  <label>Slug<input className="input" required placeholder="facial" value={slug} onChange={e=>setSlug(e.target.value)}/></label>
  <label className="full">Image URL <span className="optional">(paste image URL)</span><input className="input" placeholder="https://..." value={image} onChange={e=>setImage(e.target.value)}/></label>
  <div><button className="btn">+ Add category</button></div>
 </form></div>
 <div className="entity-grid">{items.map(c=><div className="small-card" key={c.id}>
  {c.image?<img className="category-admin-thumb" src={c.image} alt="" />:<div className="entity-avatar">◈</div>}<b>{c.name}</b><span>/{c.slug}</span>
  <div className="card-actions"><span className={'status-pill '+(c.active?'success':'muted-pill')}>{c.active?'Active':'Disabled'}</span><button className="text-btn" onClick={()=>setEditing({...c})}>Edit</button><Toggle active={c.active} onClick={async()=>{await patch('/api/admin/categories',{id:c.id,active:!c.active});load()}}/></div>
 </div>)}</div>
 {editing&&<div className="admin-modal-backdrop" onClick={()=>setEditing(null)}><div className="admin-edit-modal" onClick={e=>e.stopPropagation()}>
  <div className="admin-modal-head"><div><span className="eyebrow">CATEGORY EDITOR</span><h3>Edit category</h3><p>Update the name, slug, image and visibility.</p></div><button className="admin-modal-close" onClick={()=>setEditing(null)}>×</button></div>
  <form className="form grid2" onSubmit={saveEdit}>
   <label>Category name<input className="input" required value={editing.name||''} onChange={e=>setEditing({...editing,name:e.target.value})}/></label>
   <label>Slug<input className="input" required value={editing.slug||''} onChange={e=>setEditing({...editing,slug:e.target.value})}/></label>
   <label className="full">Image URL<input className="input" value={editing.image||''} placeholder="https://..." onChange={e=>setEditing({...editing,image:e.target.value})}/></label>
   <label>Sort order<input className="input" type="number" min="0" value={editing.sortOrder??0} onChange={e=>setEditing({...editing,sortOrder:e.target.value})}/></label>
   <label className="admin-check"><input type="checkbox" checked={!!editing.active} onChange={e=>setEditing({...editing,active:e.target.checked})}/> Active on website</label>
   {editing.image&&<div className="edit-image-preview"><img src={editing.image} alt="Category preview"/></div>}
   <div className="admin-modal-actions"><button type="button" className="btn secondary-btn" onClick={()=>setEditing(null)}>Cancel</button><button className="btn">Save category changes</button></div>
  </form>
 </div></div>}
 </>
}

function Staff(){const [items,setItems]=useState<any[]>([]),[services,setServices]=useState<any[]>([]),[f,setF]=useState<any>({name:'',phone:'',email:'',password:'',serviceIds:[]});async function load(){const r=await Promise.all([api('/api/admin/staff'),api('/api/admin/services').catch(()=>[])]);setItems(r[0]);setServices(r[1])}useEffect(()=>{load()},[]);return <><Head title="Beauticians / Staff" desc="Manage team members, portal access and service assignments."/><div className="admin-panel form-panel"><form className="form grid2" onSubmit={async e=>{e.preventDefault();try{await post('/api/admin/staff',f);setF({name:'',phone:'',email:'',password:'',serviceIds:[]});load()}catch(err:any){alert(err.message)}}}><label>Name<input className="input" required placeholder="Beautician name" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/></label><label>Phone<input className="input" required placeholder="9876543210" value={f.phone} onChange={e=>setF({...f,phone:e.target.value})}/></label><label>Email<input className="input" type="email" placeholder="staff@example.com" value={f.email} onChange={e=>setF({...f,email:e.target.value})}/></label><label>Portal password<input className="input" type="password" placeholder="Temporary password" value={f.password} onChange={e=>setF({...f,password:e.target.value})}/></label><label className="full">Services<select className="input" multiple value={f.serviceIds.map(String)} onChange={e=>setF({...f,serviceIds:Array.from(e.target.selectedOptions).map(o=>Number(o.value))})}>{services.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label><div><button className="btn">+ Add staff member</button></div></form></div><div className="admin-list">{items.map(s=><div className="entity-row" key={s.id}><div className="entity-avatar staff-avatar">{s.name?.slice(0,1).toUpperCase()}</div><div className="entity-main"><b>{s.name}</b><span>{s.phone} · {s.services?.length||0} service(s)</span></div><span className={'status-pill '+(s.active?'success':'muted-pill')}>{s.active?'Active':'Disabled'}</span><Toggle active={s.active} onClick={async()=>{await patch('/api/admin/staff',{id:s.id,name:s.name,phone:s.phone,email:s.email,active:!s.active,serviceIds:s.services?.map((x:any)=>x.serviceId)||[]});load()}}/></div>)}</div></>}

function Coupons(){const [items,setItems]=useState<any[]>([]),[f,setF]=useState({code:'',type:'FLAT',value:'',minOrder:'',maxUses:'',expiresAt:''});async function load(){setItems(await api('/api/admin/coupons').catch(()=>[]))}useEffect(()=>{load()},[]);return <><Head title="Coupons" desc="Create discounts, limits and promotional offers."/><div className="admin-panel form-panel"><form className="form grid2" onSubmit={async e=>{e.preventDefault();try{await post('/api/admin/coupons',f);setF({code:'',type:'FLAT',value:'',minOrder:'',maxUses:'',expiresAt:''});load()}catch(err:any){alert(err.message)}}}><label>Coupon code<input className="input" required placeholder="WELCOME10" value={f.code} onChange={e=>setF({...f,code:e.target.value.toUpperCase()})}/></label><label>Type<select className="input" value={f.type} onChange={e=>setF({...f,type:e.target.value})}><option>FLAT</option><option>PERCENT</option></select></label><label>Value<input className="input" type="number" required min="1" value={f.value} onChange={e=>setF({...f,value:e.target.value})}/></label><label>Minimum order<input className="input" type="number" min="0" value={f.minOrder} onChange={e=>setF({...f,minOrder:e.target.value})}/></label><label>Maximum uses<input className="input" type="number" min="1" value={f.maxUses} onChange={e=>setF({...f,maxUses:e.target.value})}/></label><label>Expiry<input className="input" type="datetime-local" value={f.expiresAt} onChange={e=>setF({...f,expiresAt:e.target.value})}/></label><div><button className="btn">+ Create coupon</button></div></form></div><div className="entity-grid">{items.map(c=><div className="small-card" key={c.id}><div className="coupon-code">{c.code}</div><b>{c.type==='PERCENT'?c.value+'% off':money(c.value)+' off'}</b><span>Used {c.usedCount}{c.maxUses?' / '+c.maxUses:''}</span><div className="card-actions"><span className={'status-pill '+(c.active?'success':'muted-pill')}>{c.active?'Active':'Disabled'}</span><Toggle active={c.active} onClick={async()=>{await patch('/api/admin/coupons',{id:c.id,active:!c.active});load()}}/></div></div>)}</div></>}

function Slots(){const [items,setItems]=useState<any[]>([]),[start,setStart]=useState(''),[end,setEnd]=useState('');async function load(){setItems(await api('/api/admin/slots').catch(()=>[]))}useEffect(()=>{load()},[]);return <><Head title="Time slots" desc="Control appointment windows customers can select."/><div className="admin-panel form-panel"><form className="form grid2" onSubmit={async e=>{e.preventDefault();try{await post('/api/admin/slots',{start,end,sortOrder:items.length});setStart('');setEnd('');load()}catch(err:any){alert(err.message)}}}><label>Start time<input className="input" type="time" required value={start} onChange={e=>setStart(e.target.value)}/></label><label>End time<input className="input" type="time" required value={end} onChange={e=>setEnd(e.target.value)}/></label><div><button className="btn">+ Add time slot</button></div></form></div><div className="entity-grid">{items.map(s=><div className="small-card" key={s.id}><div className="slot-time">{s.start}<span>→</span>{s.end}</div><span>{s.active?'Available for booking':'Disabled'}</span><div className="card-actions"><span className={'status-pill '+(s.active?'success':'muted-pill')}>{s.active?'Active':'Disabled'}</span><Toggle active={s.active} onClick={async()=>{await patch('/api/admin/slots',{id:s.id,active:!s.active});load()}}/></div></div>)}</div></>}

function Areas(){const [items,setItems]=useState<any[]>([]),[city,setCity]=useState(''),[pin,setPin]=useState('');async function load(){setItems(await api('/api/admin/areas').catch(()=>[]))}useEffect(()=>{load()},[]);return <><Head title="Service areas" desc="Control cities and pincodes where bookings are accepted."/><div className="admin-panel form-panel"><form className="form grid2" onSubmit={async e=>{e.preventDefault();try{await post('/api/admin/areas',{city,pincode:pin});setCity('');setPin('');load()}catch(err:any){alert(err.message)}}}><label>City<input className="input" required placeholder="Delhi" value={city} onChange={e=>setCity(e.target.value)}/></label><label>Pincode <span className="optional">(optional)</span><input className="input" placeholder="201001" value={pin} onChange={e=>setPin(e.target.value)}/></label><div><button className="btn">+ Add service area</button></div></form></div><div className="entity-grid">{items.map(a=><div className="small-card" key={a.id}><div className="entity-avatar">⌖</div><b>{a.city}</b><span>{a.pincode||'All pincodes'}</span><div className="card-actions"><span className={'status-pill '+(a.active?'success':'muted-pill')}>{a.active?'Active':'Disabled'}</span><Toggle active={a.active} onClick={async()=>{await patch('/api/admin/areas',{id:a.id,active:!a.active});load()}}/></div></div>)}</div></>}

function Reviews(){const [items,setItems]=useState<any[]>([]);async function load(){setItems(await api('/api/admin/reviews').catch(()=>[]))}useEffect(()=>{load()},[]);return <><Head title="Reviews" desc="Approve customer feedback before publishing it."/>{!items.length?<Empty text="No reviews yet."/>:<div className="review-grid">{items.map(r=><div className="review-card" key={r.id}><div className="stars">{'★'.repeat(Math.max(0,Math.min(5,r.rating)))}<span>{r.customer?.name||'Customer'}</span></div><p>{r.comment||'No comment provided.'}</p><small>{r.approved?'Published':'Waiting for approval'} · {new Date(r.createdAt).toLocaleDateString('en-IN')}</small><button className="text-btn" onClick={async()=>{await patch('/api/admin/reviews',{id:r.id,approved:!r.approved});load()}}>{r.approved?'Hide review':'Approve review'}</button></div>)}</div>}</>}

function Banners(){const [items,setItems]=useState<any[]>([]),[f,setF]=useState({title:'',subtitle:'',image:'',link:''});async function load(){setItems(await api('/api/admin/banners').catch(()=>[]))}useEffect(()=>{load()},[]);return <><Head title="Homepage banners" desc="Control promotional content shown on the storefront."/><div className="admin-panel form-panel"><form className="form grid2" onSubmit={async e=>{e.preventDefault();try{await post('/api/admin/banners',f);setF({title:'',subtitle:'',image:'',link:''});load()}catch(err:any){alert(err.message)}}}><label>Title<input className="input" required placeholder="Beauty at your doorstep" value={f.title} onChange={e=>setF({...f,title:e.target.value})}/></label><label>Subtitle<input className="input" placeholder="Professional beauty services at home" value={f.subtitle} onChange={e=>setF({...f,subtitle:e.target.value})}/></label><label>Image URL<input className="input" placeholder="https://..." value={f.image} onChange={e=>setF({...f,image:e.target.value})}/></label><label>Link URL<input className="input" placeholder="/booking" value={f.link} onChange={e=>setF({...f,link:e.target.value})}/></label><div><button className="btn">+ Add banner</button></div></form></div><div className="admin-list">{items.map(b=><div className="entity-row" key={b.id}><div className="banner-thumb">{b.image?<img src={b.image} alt="" />:'✦'}</div><div className="entity-main"><b>{b.title}</b><span>{b.subtitle||'No subtitle'}{b.link?' · '+b.link:''}</span></div><span className={'status-pill '+(b.active?'success':'muted-pill')}>{b.active?'Active':'Disabled'}</span><button className="text-btn" onClick={async()=>{const title=prompt('Banner title',b.title);if(title===null)return;const subtitle=prompt('Subtitle',b.subtitle||'');if(subtitle===null)return;const image=prompt('Image URL',b.image||'');if(image===null)return;const link=prompt('Link',b.link||'/booking');if(link===null)return;await patch('/api/admin/banners',{id:b.id,title,subtitle,image,link});load()}}>Edit</button><Toggle active={b.active} onClick={async()=>{await patch('/api/admin/banners',{id:b.id,active:!b.active});load()}}/></div>)}</div></>}

function Payments(){const [items,setItems]=useState<any[]>([]);async function load(){setItems(await api('/api/admin/bookings').catch(()=>[]))}useEffect(()=>{load()},[]);return <div className="admin-panel"><Head title="Payments" desc="Track and reconcile payment status for every booking."/><div className="table-wrap"><table className="admin-table"><thead><tr><th>Booking</th><th>Customer</th><th>Amount</th><th>Payment ID</th><th>Status</th><th>Booking</th></tr></thead><tbody>{items.map(b=><tr key={b.id}><td><b>{b.bookingNo}</b><small>{new Date(b.createdAt).toLocaleDateString('en-IN')}</small></td><td>{b.customer?.name||'Guest'}<small>{b.customer?.phone}</small></td><td><b>{money(b.total)}</b></td><td>{b.paymentId||'—'}</td><td><select className="mini-select" value={b.paymentStatus} onChange={async e=>{try{await patch('/api/admin/bookings',{id:b.id,paymentStatus:e.target.value});load()}catch(err:any){alert(err.message)}}}>{paymentStatuses.map(x=><option key={x}>{x}</option>)}</select></td><td><span className="status-pill">{b.status}</span></td></tr>)}</tbody></table></div>{!items.length&&<Empty text="No payment records yet."/>}</div>}

function Settings(){
 const defaults=[['business_name','Business name','Name shown across the website','The Royal Beauty'],['business_city','Service city','Location shown to customers','Delhi-NCR'],['hero_tagline','Homepage headline','Main hero headline','Your beauty. Your home. Your time.'],['short_description','Short description','Homepage/menu description','Professional beauty and self-care services delivered to your home. Pick a service, choose your slot and relax.'],['opening_hours','Opening hours','Customer appointment hours','9:00 AM – 7:30 PM'],['logo_url','Logo URL','Storefront logo image URL',''],['whatsapp_url','WhatsApp URL','WhatsApp button destination','https://wa.me/919999999999']];
 const [items,setItems]=useState<any[]>([]),[form,setForm]=useState<Record<string,string>>({promo_enabled:'true',promo_text:''});
 async function load(){const rows=await api('/api/admin/settings').catch(()=>[]);setItems(rows);const next:any={};for(const [k,, ,v] of defaults)next[k]=v;for(const x of rows)next[x.key]=x.value;setForm(next)}
 useEffect(()=>{load()},[]);
 async function save(key:string){await post('/api/admin/settings',{key,value:form[key]||''});load()}
 return <><Head title="Store settings" desc="Control your storefront from the database. No deployment environment variable is needed for these settings."/>
 <div className="admin-panel form-panel"><div className="promo-settings">
  <div className="promo-settings-copy"><div><b>Top promotional banner</b><span>Show or hide the sale banner above the website header without redeploying.</span></div><Toggle active={form.promo_enabled!=='false'} onClick={()=>{const next=form.promo_enabled==='false'?'true':'false';setForm({...form,promo_enabled:next});post('/api/admin/settings',{key:'promo_enabled',value:next}).then(load).catch(()=>{})}}/></div>
  <label className="promo-text-field">Promotion text<input className="input" value={form.promo_text||''} onChange={e=>setForm({...form,promo_text:e.target.value})}/><small>Example: ₹100 OFF on Any Beauty Service | Code: BEAUTY100 | Minimum Service Value: ₹1,299</small></label>
  <button className="btn" onClick={()=>save('promo_text')}>Save promotion</button>
 </div>
 <div className="settings-grid">{defaults.map(([key,label,help])=><div className="setting-card" key={key}><div><b>{label}</b><span>{help}</span></div><input className="input" value={form[key]||''} onChange={e=>setForm({...form,[key]:e.target.value})}/><button className="btn" onClick={()=>save(key)}>Save</button></div>)}</div></div>
 <div className="admin-panel"><Head title="Advanced settings" desc="Other database-backed settings can also be managed here."/><div className="admin-list">{items.filter((x:any)=>!defaults.some(d=>d[0]===x.key)).map(x=><div className="entity-row" key={x.id}><div className="entity-avatar">⚙</div><div className="entity-main"><b>{x.key}</b><span>{x.value}</span></div><button className="text-btn" onClick={async()=>{const v=prompt(x.key,x.value);if(v===null)return;await post('/api/admin/settings',{key:x.key,value:v});load()}}>Edit</button></div>)}</div></div></>
}
function Notifications(){const [title,setTitle]=useState(''),[body,setBody]=useState(''),[sending,setSending]=useState(false),[done,setDone]=useState('');async function send(e:FormEvent){e.preventDefault();setSending(true);setDone('');try{const r=await post('/api/admin/notifications',{title,body});setDone(r?.message||'Notification sent successfully');setTitle('');setBody('')}catch(err:any){alert(err.message)}finally{setSending(false)}}return <><Head title="Notifications" desc="Send an in-app announcement to your customers."/><div className="admin-panel form-panel narrow"><form className="form" onSubmit={send}><label>Title<input className="input" required placeholder="Weekend beauty offer" value={title} onChange={e=>setTitle(e.target.value)}/></label><label>Message<textarea className="input textarea" rows={5} required placeholder="Your message…" value={body} onChange={e=>setBody(e.target.value)}/></label>{done&&<div className="notice">{done}</div>}<button className="btn" disabled={sending}>{sending?'Sending…':'Send notification'}</button></form></div></>}
