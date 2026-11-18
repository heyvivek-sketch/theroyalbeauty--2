import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import { db } from '@/lib/db';

export const metadata={title:'The Royal Beauty — Beauty Services at Home',description:'Professional beauty services delivered to your doorstep.'};

async function getSettings(){const rows=await db.siteSetting.findMany();return Object.fromEntries(rows.map(x=>[x.key,x.value]));}

export default async function RootLayout({children}:{children:React.ReactNode}){
 const settings=await getSettings();
 return <html lang="en"><body><SiteHeader settings={settings}/>{children}</body></html>;
}
