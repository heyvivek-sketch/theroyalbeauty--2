'use client';

import {useState} from 'react';
import {useCart} from './CartProvider';

export default function AddToCartButton({service}:{service:{id:number;name:string;price:number;duration:number;image?:string}}){
  const {add}=useCart();
  const [added,setAdded]=useState(false);

  function handleClick(){
    add(service);
    setAdded(true);
    window.setTimeout(()=>setAdded(false),1400);
  }

  return <button type="button" className={'add-cart-btn '+(added?'added':'')} onClick={handleClick}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.1 10.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L20 8H6"/><circle cx="9" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/></svg>
    <span>{added?'Added to cart':'Add to cart'}</span>
  </button>;
}
