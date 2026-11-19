import {NextResponse} from 'next/server';
import bcrypt from 'bcryptjs';
import {db} from '@/lib/db';
import {makeCustomerToken} from '@/lib/customer-auth';

export async function POST(req:Request){
  try{
    const {phone,password}=await req.json();
    if(!/^\d{10}$/.test(String(phone||'')) || String(password||'').length<6){
      return NextResponse.json({error:'Enter a valid 10 digit mobile number and password.'},{status:400});
    }
    const customer=await db.customer.findUnique({where:{phone:String(phone)}});
    if(!customer || !customer.passwordHash || !(await bcrypt.compare(String(password),customer.passwordHash))){
      return NextResponse.json({error:'Invalid mobile number or password.'},{status:401});
    }
    const r=NextResponse.json({ok:true,customer:{id:customer.id,name:customer.name,phone:customer.phone}});
    r.cookies.set('customer_session',makeCustomerToken(customer.id),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:60*60*24*30});
    return r;
  }catch(e){
    console.error('Customer login error:',e);
    return NextResponse.json({error:'Unable to sign in right now.'},{status:500});
  }
}
