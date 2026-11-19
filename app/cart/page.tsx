'use client';

import Link from 'next/link';
import {useCart} from '@/components/CartProvider';

export default function CartPage(){
  const {items,total,setQuantity,remove,clear}=useCart();

  return <main className="cart-page">
    <div className="container cart-shell">
      <div className="eyebrow">Your selection</div>
      <h1>My Cart</h1>
      <p className="muted">Review your beauty services before booking.</p>

      {!items.length ? <div className="cart-empty">
        <div className="cart-empty-icon">♡</div>
        <h2>Your cart is empty</h2>
        <p className="muted">Add services you like and they will stay here for your next booking.</p>
        <Link className="btn" href="/services">Browse services</Link>
      </div> : <div className="cart-layout">
        <section className="cart-items">
          {items.map(item=><article className="cart-item" key={item.id}>
            <div className="cart-item-image">{item.image?<img src={item.image} alt={item.name}/>:null}</div>
            <div className="cart-item-copy">
              <div className="meta">At-home beauty service</div>
              <h2>{item.name}</h2>
              <p className="muted">{item.duration} mins · ₹{item.price.toLocaleString('en-IN')}</p>
              <div className="cart-item-actions">
                <div className="qty">
                  <button type="button" onClick={()=>setQuantity(item.id,item.quantity-1)} aria-label="Decrease quantity">−</button>
                  <b>{item.quantity}</b>
                  <button type="button" onClick={()=>setQuantity(item.id,item.quantity+1)} aria-label="Increase quantity">+</button>
                </div>
                <button type="button" className="remove-cart" onClick={()=>remove(item.id)}>Remove</button>
              </div>
            </div>
            <strong className="cart-item-total">₹{(item.price*item.quantity).toLocaleString('en-IN')}</strong>
          </article>)}
          <button type="button" className="clear-cart" onClick={clear}>Clear cart</button>
        </section>

        <aside className="cart-summary">
          <div className="meta">ORDER SUMMARY</div>
          <div className="cart-summary-row"><span>Services</span><b>{items.reduce((n,i)=>n+i.quantity,0)}</b></div>
          <div className="cart-summary-total"><span>Total</span><strong>₹{total.toLocaleString('en-IN')}</strong></div>
          <Link className="btn cart-book-btn" href={'/booking?serviceIds='+items.map(i=>i.id).join(',')}>Continue to booking <span>→</span></Link>
          <Link className="cart-continue" href="/services">Continue shopping</Link>
        </aside>
      </div>}
    </div>
  </main>;
}
