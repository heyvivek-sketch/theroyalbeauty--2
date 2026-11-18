import {NextResponse} from 'next/server'; import {db} from '@/lib/db'; import {isAdmin} from '@/lib/auth';
export async function GET(){if(!await isAdmin())return NextResponse.json({error:'Unauthorized'},{status:401});return NextResponse.json(await db.siteSetting.findMany())}
export async function POST(req:Request){if(!await isAdmin())return NextResponse.json({error:'Unauthorized'},{status:401});const b=await req.json();return NextResponse.json(await db.siteSetting.upsert({where:{key:b.key},update:{value:String(b.value)},create:{key:b.key,value:String(b.value)}}))}
