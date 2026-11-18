import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await db.booking.findMany({
    include: { customer: true, address: true, slot: true, staff: true, items: { include: { service: true } } },
    orderBy: { date: "desc" },
    take: 200,
  }));
}

export async function PATCH(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const d = await req.json();
  const b = await db.booking.findUnique({ where: { id: Number(d.id) } });
  if (!b) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (d.status !== undefined) data.status = String(d.status);
  if (d.paymentStatus !== undefined) data.paymentStatus = String(d.paymentStatus);
  if (d.staffId !== undefined) data.staffId = d.staffId ? Number(d.staffId) : null;
  if (d.notes !== undefined) data.notes = d.notes ? String(d.notes) : null;

  const updated = await db.$transaction(async tx => {
    const out = await tx.booking.update({ where: { id: b.id }, data: data as any });
    if (d.status === "CANCELLED") {
      await tx.slotReservation.deleteMany({ where: { bookingId: b.id } });
    }
    return out;
  });
  return NextResponse.json(updated);
}
