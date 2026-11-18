import {cookies} from 'next/headers';
import {createHmac, timingSafeEqual} from 'crypto';
const secret=process.env.AUTH_SECRET||'dev-secret-change-me';
const sign=(v:string)=>createHmac('sha256',secret).update(v).digest('hex');
export function makeCustomerToken(id:number){const b=Buffer.from(JSON.stringify({id,exp:Date.now()+1000*60*60*24*30})).toString('base64url');return `${b}.${sign(b)}`}
export function verifyCustomerToken(t:string){try{const [b,s]=t.split('.');const a=Buffer.from(s,'hex'),e=Buffer.from(sign(b),'hex');if(a.length!==e.length||!timingSafeEqual(a,e))return null;const p=JSON.parse(Buffer.from(b,'base64url').toString());return p.exp>Date.now()?p.id:null}catch{return null}}
export async function customerId(){return verifyCustomerToken((await cookies()).get('customer_session')?.value||'')}
