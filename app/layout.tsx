import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import { db } from '@/lib/db';

async function getSettings(){const rows=await db.siteSetting.findMany();return Object.fromEntries(rows.map(x=>[x.key,x.value]));}

export async function generateMetadata(){
 const settings=await getSettings();
 const brand=settings.business_name||'The Royal Beauty';
 return {title:brand+' — Beauty Services at Home',description:settings.short_description||'Professional beauty services delivered to your doorstep.'};
}

export default async function RootLayout({children}:{children:React.ReactNode}){
 const settings=await getSettings();
 return <html lang="en"><body><SiteHeader settings={settings}/>{children}</body></html>;
}
