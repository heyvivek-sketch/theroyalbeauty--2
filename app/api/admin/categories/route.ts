import {NextResponse} from 'next/server';
import {db} from '@/lib/db';
import {isAdmin} from '@/lib/auth';

export async function GET(){
  if(!await isAdmin()) return NextResponse.json({error:'Unauthorized'},{status:401});
  return NextResponse.json(await db.category.findMany({orderBy:{sortOrder:'asc'}}));
}

export async function POST(req:Request){
  if(!await isAdmin()) return NextResponse.json({error:'Unauthorized'},{status:401});
  const b=await req.json();
  return NextResponse.json(await db.category.create({
    data:{
      name:String(b.name||'').trim(),
      slug:String(b.slug||'').trim().toLowerCase(),
      image:b.image||null,
      sortOrder:Number(b.sortOrder||0)
    }
  }));
}

export async function PATCH(req:Request){
  if(!await isAdmin()) return NextResponse.json({error:'Unauthorized'},{status:401});
  const b=await req.json();
  const data:any={};
  if('name' in b) data.name=String(b.name||'').trim();
  if('slug' in b) data.slug=String(b.slug||'').trim().toLowerCase();
  if('image' in b) data.image=b.image||null;
  if('active' in b) data.active=Boolean(b.active);
  if('sortOrder' in b) data.sortOrder=Number(b.sortOrder||0);
  return NextResponse.json(await db.category.update({
    where:{id:Number(b.id)},
    data
  }));
}
