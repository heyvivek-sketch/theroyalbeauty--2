import {PrismaClient} from '@prisma/client'; import {createHash} from 'crypto'; const db=new PrismaClient();
async function main(){
const cats=[['Facial','facial'],['Waxing','waxing'],['Mani-Pedi','mani-pedi'],['Hair','hair'],['Makeup','makeup'],['Massage','massage']];
for(let i=0;i<cats.length;i++)await db.category.upsert({where:{slug:cats[i][1]},update:{name:cats[i][0],sortOrder:i},create:{name:cats[i][0],slug:cats[i][1],sortOrder:i}});
const c=await db.category.findMany(); const services=[['Glow Facial','glow-facial','Deep cleansing and glow facial at home',999,60,'facial'],['Classic Waxing','classic-waxing','Full arms and legs waxing service',799,60,'waxing'],['Manicure & Pedicure','mani-pedi','Relaxing manicure and pedicure',899,75,'mani-pedi'],['Hair Spa','hair-spa','Nourishing hair spa with professional products',1199,75,'hair'],['Party Makeup','party-makeup','Professional party makeup at home',2499,120,'makeup'],['Relaxation Massage','relaxation-massage','Calming full-body relaxation massage',1499,60,'massage']];
for(const [name,slug,description,price,duration,cat] of services)await db.service.upsert({where:{slug:String(slug)},update:{name:String(name),description:String(description),price:Number(price),duration:Number(duration),active:true,categoryId:c.find(x=>x.slug===cat)!.id},create:{name:String(name),slug:String(slug),description:String(description),price:Number(price),duration:Number(duration),categoryId:c.find(x=>x.slug===cat)!.id}});
const slots=[['09:00','10:00'],['10:30','11:30'],['12:00','13:00'],['14:00','15:00'],['15:30','16:30'],['17:00','18:00'],['18:30','19:30']];for(let i=0;i<slots.length;i++)await db.slot.upsert({where:{id:i+1},update:{start:slots[i][0],end:slots[i][1],sortOrder:i},create:{start:slots[i][0],end:slots[i][1],sortOrder:i}});
await db.serviceArea.upsert({where:{id:1},update:{city:'Delhi',pincode:null,active:true},create:{id:1,city:'Delhi',active:true}});await db.serviceArea.upsert({where:{id:2},update:{city:'Ghaziabad',pincode:null,active:true},create:{id:2,city:'Ghaziabad',active:true}});await db.coupon.upsert({where:{code:'WELCOME10'},update:{},create:{code:'WELCOME10',type:'PERCENT',value:10,minOrder:500,active:true}});
const staff=await db.staff.upsert({where:{phone:'9999999999'},update:{passwordHash:createHash('sha256').update('ChangeMe123!').digest('hex')},create:{name:'Demo Beautician',phone:'9999999999',passwordHash:createHash('sha256').update('ChangeMe123!').digest('hex')}});const first=await db.service.findFirst();if(first)await db.staffService.upsert({where:{staffId_serviceId:{staffId:staff.id,serviceId:first.id}},update:{},create:{staffId:staff.id,serviceId:first.id}});
}
main().finally(()=>db.$disconnect());
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin@2026", 12);

  await prisma.admin.upsert({
    where: {
      email: "admin@theroyalbeauty.in",
    },
    update: {
      passwordHash,
      active: true,
    },
    create: {
      name: "The Royal Beauty Admin",
      email: "admin@theroyalbeauty.in",
      passwordHash,
      role: "ADMIN",
      active: true,
    },
  });

  console.log("Admin created successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());