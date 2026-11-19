import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { bookingSchema } from '@/lib/validation';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

function errorMessage(error: unknown) {
  if (error instanceof ZodError) {
    const first = error.issues[0];
    return first ? `${String(first.path.join('.'))}: ${first.message}` : 'Please check your booking details and try again.';
  }
  if (!(error instanceof Error)) return 'Could not create booking. Please try again.';

  const code = (error as Error & { code?: string }).code;
  if (code === 'P2002') {
    const target = String((error as Error & { meta?: { target?: unknown } }).meta?.target ?? '');
    if (target.includes('date') && target.includes('slotId')) return 'That slot was just booked. Please choose another time slot.';
    if (target.includes('bookingNo')) return 'We could not create a unique booking number. Please try again.';
    if (target.includes('phone')) return 'This mobile number is already registered. Please check your details.';
    return 'Some booking details already exist. Please check your details and try again.';
  }
  if (code === 'P2003') return 'Some booking information is invalid. Please check your details and try again.';
  if (code === 'P2025') return 'The selected slot or booking information is no longer available. Please refresh and try again.';
  if (code === 'P2021') return 'Booking service is not fully configured yet. Please contact the administrator.';
  if (code === 'P1001' || code === 'P1002' || code === 'P1017') return 'Booking service is temporarily unavailable. Please try again in a moment.';
  if (code === 'P2004') return 'The booking could not be saved because the database rejected one of the booking details.';
  if (code === 'P2022') return 'Booking database schema is out of date. Please contact the administrator.';
  if (code === 'P2024') return 'Booking service is busy right now. Please try again in a moment.';
  if (code === 'P2028') return 'Booking transaction timed out. Please try again.';
  if (code === 'P2034') return 'This booking was processed at the same time as another request. Please try again.';
  if (error instanceof Prisma.PrismaClientValidationError) return 'Booking details could not be processed. Please check your details and try again.';
  if (error.message === 'SLOT_ALREADY_BOOKED') return 'That slot was just booked. Please choose another time slot.';
  return 'Could not create booking. Please check your details and try again.';
}

export async function POST(req: Request) {
  try {
    const d = bookingSchema.parse(await req.json());
    const date = new Date(d.date + 'T00:00:00.000Z');
    const today = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00.000Z');

    if (Number.isNaN(date.getTime()) || date < today) {
      return NextResponse.json({ error: 'Please choose a valid future date.' }, { status: 400 });
    }

    const serviceIds = [...new Set(d.serviceIds)];

    const [services, slot, area] = await Promise.all([
      db.service.findMany({ where: { id: { in: serviceIds }, active: true } }),
      db.slot.findFirst({ where: { id: d.slotId, active: true } }),
      db.serviceArea.findFirst({
        where: {
          city: { equals: d.city.trim(), mode: 'insensitive' },
          OR: [{ pincode: d.pincode.trim() }, { pincode: null }],
          active: true,
        },
      }),
    ]);

    if (services.length !== serviceIds.length) {
      return NextResponse.json({ error: 'One or more selected services are unavailable.' }, { status: 400 });
    }
    if (!slot) {
      return NextResponse.json({ error: 'The selected time slot is unavailable. Please choose another.' }, { status: 400 });
    }
    if (!area && process.env.ENFORCE_SERVICE_AREA === 'true') {
      return NextResponse.json({ error: 'We do not currently serve this location.' }, { status: 400 });
    }

    const subtotal = services.reduce((sum, service) => sum + service.price, 0);
    let discount = 0;
    let couponId: number | undefined;

    if (d.coupon?.trim()) {
      const couponCode = d.coupon.trim().toUpperCase();
      const coupon = await db.coupon.findUnique({ where: { code: couponCode } });

      if (
        !coupon ||
        !coupon.active ||
        (coupon.expiresAt && coupon.expiresAt < new Date()) ||
        (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) ||
        subtotal < coupon.minOrder
      ) {
        return NextResponse.json({ error: 'Coupon is not valid for this booking.' }, { status: 400 });
      }

      discount =
        coupon.type === 'PERCENT'
          ? Math.min(Math.round((subtotal * coupon.value) / 100), subtotal)
          : Math.min(coupon.value, subtotal);
      couponId = coupon.id;
    }

    const passwordHash = bcrypt.hashSync(d.password, 12);

    const result = await db.$transaction(async tx => {
      const existingReservation = await tx.slotReservation.findUnique({
        where: { date_slotId: { date, slotId: slot.id } },
      });
      if (existingReservation) throw new Error('SLOT_ALREADY_BOOKED');

      let customer = await tx.customer.findUnique({ where: { phone: d.phone.trim() } });

      if (!customer) {
        customer = await tx.customer.create({
          data: {
            name: d.name.trim(),
            phone: d.phone.trim(),
            email: d.email?.trim() || undefined,
            passwordHash,
          },
        });
      } else {
        customer = await tx.customer.update({
          where: { id: customer.id },
          data: {
            name: d.name.trim(),
            email: d.email?.trim() || undefined,
            passwordHash,
          },
        });
      }

      const address = await tx.address.create({
        data: {
          customerId: customer.id,
          address: d.address.trim(),
          city: d.city.trim(),
          pincode: d.pincode.trim(),
          label: 'Home',
        },
      });

      const bookingNo = 'TRB-' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 10);

      const booking = await tx.booking.create({
        data: {
          bookingNo,
          customerId: customer.id,
          addressId: address.id,
          date,
          slotId: slot.id,
          total: subtotal - discount,
          discount,
          couponId,
          notes: d.notes?.trim() || null,
          items: {
            create: services.map(service => ({
              serviceId: service.id,
              price: service.price,
              qty: 1,
            })),
          },
        },
      });

      await tx.slotReservation.create({
        data: { date, slotId: slot.id, bookingId: booking.id },
      });

      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        });
      }

      return { ...booking, customerId: customer.id };
    });

    // Notifications are intentionally created after the booking transaction.
    // A missing/invalid notification table must never roll back a valid booking.
    try {
      await db.notification.create({
        data: {
          customerId: result.customerId,
          title: 'Booking received',
          body: `Your booking ${result.bookingNo} has been received.`,
          channel: 'IN_APP',
        },
      });
    } catch (notificationError) {
      console.error('[BOOKING_NOTIFICATION_ERROR]', notificationError);
    }

    return NextResponse.json(
      { bookingNo: result.bookingNo, id: result.id, total: result.total },
      { status: 201 }
    );
  } catch (error) {
    console.error('[BOOKING_CREATE_ERROR]', error);
    return NextResponse.json({ error: errorMessage(error) }, { status: 400 });
  }
}
