import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const customers = await db.customer.findMany({
    include: { _count: { select: { bookings: true, reviews: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(customers);
}

export async function PATCH(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  const id = Number(b.id);
  if (!id) return NextResponse.json({ error: "Customer id is required" }, { status: 400 });
  const data: { name?: string | null; email?: string | null } = {};
  if ("name" in b) data.name = b.name ? String(b.name).trim() : null;
  if ("email" in b) data.email = b.email ? String(b.email).trim() : null;
  return NextResponse.json(await db.customer.update({ where: { id }, data }));
}
