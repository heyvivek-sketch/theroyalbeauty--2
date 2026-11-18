import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await db.service.findMany({
    include: { category: true },
    orderBy: [{ sortOrder: "asc" }, { id: "desc" }],
  }));
}

export async function POST(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const d = await req.json();
  const name = String(d.name || "").trim();
  const slug = String(d.slug || "").trim().toLowerCase();
  if (!name || !slug || !d.categoryId) return NextResponse.json({ error: "Name, slug and category are required" }, { status: 400 });

  const s = await db.service.create({
    data: {
      name,
      slug,
      description: String(d.description || ""),
      price: Number(d.price),
      duration: Number(d.duration),
      categoryId: Number(d.categoryId),
      image: d.image || null,
      sortOrder: Number(d.sortOrder || 0),
    },
  });
  return NextResponse.json(s, { status: 201 });
}

export async function PATCH(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const d = await req.json();
  const data: any = {};
  if ("name" in d) data.name = String(d.name).trim();
  if ("slug" in d) data.slug = String(d.slug).trim().toLowerCase();
  if ("price" in d) data.price = Number(d.price);
  if ("duration" in d) data.duration = Number(d.duration);
  if ("description" in d) data.description = String(d.description || "");
  if ("categoryId" in d) data.categoryId = Number(d.categoryId);
  if ("image" in d) data.image = d.image || null;
  if ("sortOrder" in d) data.sortOrder = Number(d.sortOrder);
  if ("active" in d) data.active = Boolean(d.active);

  return NextResponse.json(await db.service.update({
    where: { id: Number(d.id) },
    data,
    include: { category: true },
  }));
}
