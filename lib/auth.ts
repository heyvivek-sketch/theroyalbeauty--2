import {createHmac, timingSafeEqual} from 'crypto';
import {cookies} from 'next/headers';
const secret=process.env.AUTH_SECRET||'dev-secret-change-me';
const sign=(v:string)=>createHmac('sha256',secret).update(v).digest('hex');
export function makeAdminToken(){const payload=JSON.stringify({email:process.env.ADMIN_EMAIL||'admin@example.com',exp:Date.now()+1000*60*60*12});const b=Buffer.from(payload).toString('base64url');return `${b}.${sign(b)}`}
export function verifyAdminToken(token:string){try{const [b,s]=token.split('.');if(!b||!s)return false;const a=Buffer.from(s,'hex'),e=Buffer.from(sign(b),'hex');if(a.length!==e.length||!timingSafeEqual(a,e))return false;return JSON.parse(Buffer.from(b,'base64url').toString()).exp>Date.now()}catch{return false}}
export async function isAdmin(){return verifyAdminToken((await cookies()).get('admin_session')?.value||'')}
