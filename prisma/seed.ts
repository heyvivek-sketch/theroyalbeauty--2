import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createHash } from "crypto";

const db = new PrismaClient();

async function main() {
  const categories = [
    ["Facial", "facial"],
    ["Waxing", "waxing"],
    ["Mani-Pedi", "mani-pedi"],
    ["Hair", "hair"],
    ["Makeup", "makeup"],
    ["Massage", "massage"],
  ] as const;

  for (let i = 0; i < categories.length; i++) {
    await db.category.upsert({
      where: { slug: categories[i][1] },
      update: { name: categories[i][0], sortOrder: i },
      create: { name: categories[i][0], slug: categories[i][1], sortOrder: i },
    });
  }

  const categoryRows = await db.category.findMany();

  const services = [
    ["Glow Facial", "glow-facial", "Deep cleansing and glow facial at home", 999, 60, "facial"],
    ["Classic Waxing", "classic-waxing", "Full arms and legs waxing service", 799, 60, "waxing"],
    ["Manicure & Pedicure", "mani-pedi", "Relaxing manicure and pedicure", 899, 75, "mani-pedi"],
    ["Hair Spa", "hair-spa", "Nourishing hair spa with professional products", 1199, 75, "hair"],
    ["Party Makeup", "party-makeup", "Professional party makeup at home", 2499, 120, "makeup"],
    ["Relaxation Massage", "relaxation-massage", "Calming full-body relaxation massage", 1499, 60, "massage"],
  ] as const;

  for (const [name, slug, description, price, duration, categorySlug] of services) {
    const category = categoryRows.find((x) => x.slug === categorySlug);
    if (!category) continue;

    await db.service.upsert({
      where: { slug },
      update: { name, description, price, duration, active: true, categoryId: category.id },
      create: { name, slug, description, price, duration, categoryId: category.id },
    });
  }

  const slots = [
    ["09:00", "10:00"],
    ["10:30", "11:30"],
    ["12:00", "13:00"],
    ["14:00", "15:00"],
    ["15:30", "16:30"],
    ["17:00", "18:00"],
    ["18:30", "19:30"],
  ] as const;

  for (let i = 0; i < slots.length; i++) {
    await db.slot.upsert({
      where: { id: i + 1 },
      update: { start: slots[i][0], end: slots[i][1], sortOrder: i },
      create: { start: slots[i][0], end: slots[i][1], sortOrder: i },
    });
  }

  await db.serviceArea.upsert({
    where: { id: 1 },
    update: { city: "Delhi", pincode: null, active: true },
    create: { id: 1, city: "Delhi", active: true },
  });

  await db.serviceArea.upsert({
    where: { id: 2 },
    update: { city: "Ghaziabad", pincode: null, active: true },
    create: { id: 2, city: "Ghaziabad", active: true },
  });

  await db.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: { code: "WELCOME10", type: "PERCENT", value: 10, minOrder: 500, active: true },
  });

  const staffPassword = createHash("sha256").update("ChangeMe123!").digest("hex");

  const staff = await db.staff.upsert({
    where: { phone: "9999999999" },
    update: { passwordHash: staffPassword },
    create: { name: "Demo Beautician", phone: "9999999999", passwordHash: staffPassword },
  });

  const firstService = await db.service.findFirst();
  if (firstService) {
    await db.staffService.upsert({
      where: { staffId_serviceId: { staffId: staff.id, serviceId: firstService.id } },
      update: {},
      create: { staffId: staff.id, serviceId: firstService.id },
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set before seeding the admin user.");
  }

  const adminPasswordHash = await bcrypt.hash(adminPassword, 12);

  await db.admin.upsert({
    where: { email: adminEmail.trim().toLowerCase() },
    update: { passwordHash: adminPasswordHash, active: true },
    create: {
      name: "The Royal Beauty Admin",
      email: adminEmail.trim().toLowerCase(),
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      active: true,
    },
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
