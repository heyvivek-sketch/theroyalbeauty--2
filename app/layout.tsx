import './globals.css';
import SiteHeader from '@/components/SiteHeader';

export const metadata={title:'The Royal Beauty — Beauty Services at Home',description:'Professional beauty services delivered to your doorstep.'};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body><SiteHeader/>{children}</body></html>;
}
