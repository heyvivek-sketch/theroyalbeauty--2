import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createHash } from "crypto";

const db = new PrismaClient();

async function main() {
  const categories = [["Face Wax","face-wax"],["Threading","threading"],["Facial","facial"],["Honey Wax","honey-wax"],["Rica Wax","rica-wax"],["Mani-Pedi","mani-pedi"],["Pedicure","pedicure"],["Manicure","manicure"],["Raaga","raaga"],["Bleach","bleach"],["Massage","massage"],["Polishing","polishing"]];
  for (let i=0;i<categories.length;i++) {
    await db.category.upsert({
      where:{slug:categories[i][1]},
      update:{name:categories[i][0],sortOrder:i,active:true},
      create:{name:categories[i][0],slug:categories[i][1],sortOrder:i,active:true}
    });
  }

  const categoryRows=await db.category.findMany();
  const services=[["Full Face Wax","full-face-wax","Full face waxing service",200,30,"face-wax"],["Forehead Wax","forehead-wax","Forehead waxing service",80,15,"face-wax"],["Side Lock Wax","side-lock-wax","Side lock waxing service",80,15,"face-wax"],["Upper Lips Wax","upper-lips-wax","Upper lips waxing service",50,10,"face-wax"],["Lower Lips Wax","lower-lips-wax","Lower lips waxing service",50,10,"face-wax"],["Chin Wax","chin-wax","Chin waxing service",50,10,"face-wax"],["Full Face Thread","full-face-thread","Full face threading service",150,30,"threading"],["Eyebrow Thread","eyebrow-thread","Eyebrow threading service",30,10,"threading"],["Forehead Thread","forehead-thread","Forehead threading service",25,10,"threading"],["Side Lock Thread","side-lock-thread","Side lock threading service",25,10,"threading"],["Upper Lips Thread","upper-lips-thread","Upper lips threading service",25,10,"threading"],["Chin Thread","chin-thread","Chin threading service",25,10,"threading"],["Korean Facial","korean-facial","Korean facial treatment",795,60,"facial"],["Red Wine Facial","red-wine-facial","Red wine facial treatment",599,60,"facial"],["Aroma Magic Bridal","aroma-magic-bridal","Aroma Magic bridal facial",699,60,"facial"],["Lotus White Glow Facial","lotus-white-glow-facial","Lotus white glow facial",550,60,"facial"],["Vedic Line Moroccan Argan Oil Facial","vedic-line-moroccan-argan-oil-facial","Vedic Line Moroccan Argan Oil facial",699,60,"facial"],["Sara Gold Facial","sara-gold-facial","Sara Gold facial treatment",835,60,"facial"],["Lotus Radiant Pearl Facial","lotus-radiant-pearl-facial","Lotus Radiant Pearl facial",595,60,"facial"],["O3+ Anti Aging Facial","o3-anti-aging-facial","O3+ anti aging facial",1199,60,"facial"],["O3+ Shine Glow Facial","o3-shine-glow-facial","O3+ shine glow facial",1390,60,"facial"],["O3+ Whitening & Brightening Facial","o3-whitening-brightening-facial","O3+ whitening and brightening facial",1290,60,"facial"],["VLCC Insta Glow","vlcc-insta-glow","VLCC Insta Glow facial",499,45,"facial"],["VLCC Anti Tan Facial","vlcc-anti-tan-facial","VLCC anti tan facial",499,45,"facial"],["VLCC Fruit Facial","vlcc-fruit-facial","VLCC fruit facial",499,45,"facial"],["VLCC Skin Tightening Facial","vlcc-skin-tightening-facial","VLCC skin tightening facial",499,45,"facial"],["VLCC Fruit Cleanup","vlcc-fruit-cleanup","VLCC fruit cleanup",345,30,"facial"],["VLCC Anti Tan Cleanup","vlcc-anti-tan-cleanup","VLCC anti tan cleanup",350,30,"facial"],["Bikini Cleanup Fruit","bikini-cleanup-fruit","Bikini cleanup fruit service",799,30,"facial"],["Under Arms Cleanup Fruit","under-arms-cleanup-fruit","Under arms cleanup fruit service",599,30,"facial"],["Full Arms + Full Legs + Underarms","honey-full-arms-full-legs-underarms","Honey wax full arms, full legs and underarms",470,50,"honey-wax"],["Full Arms + Half Legs + Underarms","honey-full-arms-half-legs-underarms","Honey wax full arms, half legs and underarms",425,40,"honey-wax"],["Full Arms Only","honey-full-arms","Honey wax full arms",265,15,"honey-wax"],["Full Arms + Underarms","honey-full-arms-underarms","Honey wax full arms and underarms",310,15,"honey-wax"],["Full Legs Only","honey-full-legs","Honey wax full legs",275,15,"honey-wax"],["Half Legs Only","honey-half-legs","Honey wax half legs",195,10,"honey-wax"],["Under Arms","honey-underarms","Honey wax under arms",51,5,"honey-wax"],["Full Body","honey-full-body","Honey wax full body",780,90,"honey-wax"],["Full Body + Bikini","honey-full-body-bikini","Honey wax full body and bikini",1130,120,"honey-wax"],["Bikini Wax","honey-bikini-wax","Honey wax bikini",460,25,"honey-wax"],["Bikini Butt","honey-bikini-butt","Honey wax bikini butt",630,40,"honey-wax"],["Front + Back","honey-front-back","Honey wax front and back",525,30,"honey-wax"],["Full Back","honey-full-back","Honey wax full back",275,15,"honey-wax"],["Full Front","honey-full-front","Honey wax full front",275,15,"honey-wax"],["Full Butt","honey-full-butt","Honey wax full butt",390,15,"honey-wax"],["Rica Full Body + Bikini","rica-full-body-bikini","Rica wax full body and bikini",2080,120,"rica-wax"],["Rica Full Body","rica-full-body","Rica wax full body",1530,90,"rica-wax"],["Rica Full Arms, Full Legs & Underarms","rica-full-arms-full-legs-underarms","Rica wax full arms, full legs and underarms",780,50,"rica-wax"],["Rica Full Arms, Half Legs & Underarms","rica-full-arms-half-legs-underarms","Rica wax full arms, half legs and underarms",725,40,"rica-wax"],["Rica Full Arms & Underarms","rica-full-arms-underarms","Rica wax full arms and underarms",395,20,"rica-wax"],["Rica Full Arms","rica-full-arms","Rica wax full arms",365,15,"rica-wax"],["Rica Full Legs","rica-full-legs","Rica wax full legs",420,25,"rica-wax"],["Rica Half Legs","rica-half-legs","Rica wax half legs",285,10,"rica-wax"],["Rica Front & Back","rica-front-back","Rica wax front and back",659,30,"rica-wax"],["Rica Full Back","rica-full-back","Rica wax full back",349,15,"rica-wax"],["Rica Full Front","rica-full-front","Rica wax full front",349,15,"rica-wax"],["Rica Under Arms","rica-underarms","Rica wax under arms",120,10,"rica-wax"],["Rica Bikini + Butt","rica-bikini-butt","Rica wax bikini and butt",865,40,"rica-wax"],["Rica Peel of Bikini","rica-peel-bikini","Rica peel of bikini service",849,40,"rica-wax"],["O3+ Bubblegum Mani-Pedi","o3-bubblegum-mani-pedi","O3+ Bubblegum mani-pedi",995,100,"mani-pedi"],["Aroma Magic Brightening Mani-Pedi","aroma-magic-brightening-mani-pedi","Aroma Magic brightening mani-pedi",789,60,"mani-pedi"],["Classic Mani-Pedi","classic-mani-pedi","Classic mani-pedi",535,45,"mani-pedi"],["O3+ Bubblegum Pedicure","o3-bubblegum-pedicure","O3+ Bubblegum pedicure",595,40,"pedicure"],["Aroma Magic Brightening Pedicure","aroma-magic-brightening-pedicure","Aroma Magic brightening pedicure",499,30,"pedicure"],["Classic Pedicure","classic-pedicure","Classic pedicure",295,25,"pedicure"],["O3+ Bubblegum Manicure","o3-bubblegum-manicure","O3+ Bubblegum manicure",445,35,"manicure"],["Aroma Magic Brightening Manicure","aroma-magic-brightening-manicure","Aroma Magic brightening manicure",399,30,"manicure"],["Classic Manicure","classic-manicure","Classic manicure",345,25,"manicure"],["Full Body & Face + Neck Raaga","raaga-full-body-face-neck","Raaga full body, face and neck",779,60,"raaga"],["Full Body Raaga","raaga-full-body","Raaga full body service",615,50,"raaga"],["Full Arms Raaga + Underarms","raaga-full-arms-underarms","Raaga full arms and underarms",234,25,"raaga"],["Full Legs Raaga","raaga-full-legs","Raaga full legs service",314,40,"raaga"],["Face + Neck Raaga","raaga-face-neck","Raaga face and neck service",239,25,"raaga"],["Full Back Raaga","raaga-full-back","Raaga full back service",220,25,"raaga"],["Bikini Raaga","raaga-bikini","Raaga bikini service",349,20,"raaga"],["Underarms Raaga","raaga-underarms","Raaga underarms service",245,25,"raaga"],["Full Body + Face Neck Glow","bleach-full-body-face-neck-glow","Bleach full body and face neck glow",785,60,"bleach"],["Full Body Glow","bleach-full-body-glow","Bleach full body glow",675,50,"bleach"],["Face Neck Glow","bleach-face-neck-glow","Bleach face and neck glow",220,20,"bleach"],["Full Arms Underarms Glow","bleach-full-arms-underarms-glow","Bleach full arms and underarms glow",349,30,"bleach"],["Full Legs Glow","bleach-full-legs-glow","Bleach full legs glow",389,30,"bleach"],["Full Back Glow","bleach-full-back-glow","Bleach full back glow",289,30,"bleach"],["Bikini Glow","bleach-bikini-glow","Bleach bikini glow",399,25,"bleach"],["Underarms Glow","bleach-underarms-glow","Bleach underarms glow",299,25,"bleach"],["Full Body Massage","full-body-massage","Relaxing full body massage",749,45,"massage"],["Head Massage","head-massage","Relaxing head massage",199,20,"massage"],["Head Shoulder Massage","head-shoulder-massage","Head and shoulder massage",349,30,"massage"],["Back Massage","back-massage","Relaxing back massage",399,30,"massage"],["Foot Massage","foot-massage","Relaxing foot massage",349,30,"massage"],["Bikini Massage","bikini-massage","Bikini massage service",499,20,"massage"],["Full Body Polishing","full-body-polishing","Full body polishing service",1079,60,"polishing"],["Full Body Scrub with Pack","full-body-scrub-pack","Full body scrub with pack",530,30,"polishing"]];
  const desiredSlugs=new Set(services.map(x=>x[1]));

  for(let i=0;i<services.length;i++){
    const [name,slug,description,price,duration,categorySlug]=services[i];
    const category=categoryRows.find(x=>x.slug===categorySlug);
    if(!category) continue;
    await db.service.upsert({
      where:{slug:String(slug)},
      update:{name:String(name),description:String(description),price:Number(price),duration:Number(duration),active:true,categoryId:category.id,sortOrder:i},
      create:{name:String(name),slug:String(slug),description:String(description),price:Number(price),duration:Number(duration),categoryId:category.id,active:true,sortOrder:i}
    });
  }

  // Keep legacy/demo services out of the storefront while preserving existing booking records.
  const existing=await db.service.findMany({select:{id:true,slug:true}});
  for(const s of existing){
    if(!desiredSlugs.has(s.slug)) await db.service.update({where:{id:s.id},data:{active:false}});
  }

  const slots=[["09:00","10:00"],["10:30","11:30"],["12:00","13:00"],["14:00","15:00"],["15:30","16:30"],["17:00","18:00"],["18:30","19:30"]];
  for(let i=0;i<slots.length;i++) await db.slot.upsert({where:{id:i+1},update:{start:slots[i][0],end:slots[i][1],sortOrder:i,active:true},create:{start:slots[i][0],end:slots[i][1],sortOrder:i,active:true}});

  await db.serviceArea.upsert({where:{id:1},update:{city:"Delhi",pincode:null,active:true},create:{id:1,city:"Delhi",active:true}});
  await db.serviceArea.upsert({where:{id:2},update:{city:"Ghaziabad",pincode:null,active:true},create:{id:2,city:"Ghaziabad",active:true}});

  await db.coupon.upsert({where:{code:"WELCOME10"},update:{},create:{code:"WELCOME10",type:"PERCENT",value:10,minOrder:500,active:true}});

  const staffPassword=createHash("sha256").update("ChangeMe123!").digest("hex");
  const staff=await db.staff.upsert({where:{phone:"9999999999"},update:{passwordHash:staffPassword},create:{name:"Demo Beautician",phone:"9999999999",passwordHash:staffPassword}});
  for(const s of await db.service.findMany({where:{active:true},select:{id:true}})){
    await db.staffService.upsert({where:{staffId_serviceId:{staffId:staff.id,serviceId:s.id}},update:{},create:{staffId:staff.id,serviceId:s.id}});
  }

  const adminEmail=process.env.ADMIN_EMAIL;
  const adminPassword=process.env.ADMIN_PASSWORD;
  if(!adminEmail||!adminPassword) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set before seeding the admin user.");
  const adminPasswordHash=await bcrypt.hash(adminPassword,12);
  await db.admin.upsert({
    where:{email:adminEmail.trim().toLowerCase()},
    update:{passwordHash:adminPasswordHash,active:true},
    create:{name:"The Royal Beauty Admin",email:adminEmail.trim().toLowerCase(),passwordHash:adminPasswordHash,role:"ADMIN",active:true}
  });

  await db.siteSetting.upsert({where:{key:"store_name"},update:{value:"The Royal Beauty"},create:{key:"store_name",value:"The Royal Beauty"}});
  await db.siteSetting.upsert({where:{key:"business_hours"},update:{value:"9:00 AM - 7:30 PM"},create:{key:"business_hours",value:"9:00 AM - 7:30 PM"}});
  console.log("Seed completed successfully.");
}

main().catch(error=>{console.error(error);process.exit(1)}).finally(async()=>{await db.$disconnect()});
