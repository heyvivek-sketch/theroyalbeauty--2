import {NextResponse} from 'next/server'; import {db} from '@/lib/db'; import {isAdmin} from '@/lib/auth';
export async function GET(){if(!await isAdmin())return NextResponse.json({error:'Unauthorized'},{status:401});return NextResponse.json(await db.review.findMany({include:{customer:true,booking:true},orderBy:{createdAt:'desc'}}))}
export async function PATCH(req:Request){if(!await isAdmin())return NextResponse.json({error:'Unauthorized'},{status:401});const b=await req.json();return NextResponse.json(await db.review.update({where:{id:Number(b.id)},data:{approved:Boolean(b.approved)}}))}
