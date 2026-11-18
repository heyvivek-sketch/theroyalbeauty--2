import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const end = new Date(start); end.setDate(end.getDate() + 1);

  const [totalBookings, todayBookings, pendingBookings, customers, services, staff, paid, recent] = await Promise.all([
    db.booking.count(),
    db.booking.count({ where: { date: { gte: start, lt: end } } }),
    db.booking.count({ where: { status: "PENDING" } }),
    db.customer.count(),
    db.service.count({ where: { active: true } }),
    db.staff.count({ where: { active: true } }),
    db.booking.aggregate({ where: { paymentStatus: "PAID" }, _sum: { total: true } }),
    db.booking.findMany({
      include: { customer: true, address: true, slot: true, staff: true, items: { include: { service: true } } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  return NextResponse.json({
    stats: {
      totalBookings, todayBookings, pendingBookings, customers,
      services, staff, revenue: paid._sum.total || 0,
    },
    bookings: recent,
  });
}
