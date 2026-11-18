'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function SiteHeader(){
 const pathname=usePathname(); if(pathname.startsWith('/admin')) return null;
 return <div className="nav"><div className="container navin"><Link className="logo" href="/">The <span>Royal Beauty</span></Link><nav className="links"><Link href="/services">Services</Link><Link href="/booking">Book now</Link></nav><Link className="btn nav-book" href="/booking">Book a service</Link></div></div>;
}
