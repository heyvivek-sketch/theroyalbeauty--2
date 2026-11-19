'use client';

import {createContext,useContext,useEffect,useMemo,useState} from 'react';

export type CartItem={
  id:number;
  name:string;
  price:number;
  duration:number;
  image?:string;
  quantity:number;
};

type CartContextValue={
  items:CartItem[];
  count:number;
  total:number;
  add:(item:Omit<CartItem,'quantity'>)=>void;
  remove:(id:number)=>void;
  setQuantity:(id:number,quantity:number)=>void;
  clear:()=>void;
};

const CartContext=createContext<CartContextValue|null>(null);
const STORAGE_KEY='trb_cart';

export function CartProvider({children}:{children:React.ReactNode}){
  const [items,setItems]=useState<CartItem[]>([]);
  const [ready,setReady]=useState(false);

  useEffect(()=>{
    try{
      const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
      if(Array.isArray(saved)) setItems(saved);
    }catch{}
    setReady(true);
  },[]);

  useEffect(()=>{
    if(ready) localStorage.setItem(STORAGE_KEY,JSON.stringify(items));
  },[items,ready]);

  const value=useMemo<CartContextValue>(()=>({
    items,
    count:items.reduce((n,i)=>n+i.quantity,0),
    total:items.reduce((n,i)=>n+i.price*i.quantity,0),
    add:(item)=>{
      setItems(prev=>{
        const found=prev.find(i=>i.id===item.id);
        return found
          ? prev.map(i=>i.id===item.id?{...i,quantity:i.quantity+1}:i)
          : [...prev,{...item,quantity:1}];
      });
    },
    remove:(id)=>setItems(prev=>prev.filter(i=>i.id!==id)),
    setQuantity:(id,quantity)=>setItems(prev=>quantity<1?prev.filter(i=>i.id!==id):prev.map(i=>i.id===id?{...i,quantity}:i)),
    clear:()=>setItems([])
  }),[items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(){
  const value=useContext(CartContext);
  if(!value) throw new Error('useCart must be used inside CartProvider');
  return value;
}
