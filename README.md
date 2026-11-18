# Beauty Home — Production Full-Stack Starter

A production-oriented home beauty booking platform inspired by the core workflow of Beautylook, with original branding and implementation.

## Included
- Next.js App Router + TypeScript
- PostgreSQL + Prisma
- Customer OTP authentication
- Customer dashboard, bookings, cancellation and rescheduling
- Multi-service cart-style booking
- Date/slot availability and database-backed slot reservation locking
- Service areas and pincode control
- Coupon validation and usage tracking
- Razorpay order creation, signature verification and webhook endpoint
- Admin dashboard: bookings, services, staff, coupons, slots, areas, reviews, banners, settings and broadcasts
- Staff portal with assigned appointment workflow
- Reviews and approval moderation
- In-app notification records
- Docker PostgreSQL

## Setup
1. `cp .env.example .env`
2. Configure `DATABASE_URL`, `AUTH_SECRET`, admin credentials and production provider keys.
3. `docker compose up -d`
4. `npm install`
5. `npm run db:push`
6. `npm run db:seed`
7. `npm run dev`

## Production
Use managed PostgreSQL (e.g. Supabase/Neon), Vercel or another Node-compatible host, Razorpay live keys, a real SMS/OTP provider, HTTPS, strong secrets, backups, monitoring and a transactional email/WhatsApp provider.

### Demo accounts
Admin uses the values from `.env`.
Demo staff: `9999999999` / `ChangeMe123!` — change immediately in production.

## Payment flow
Create booking -> customer login -> create Razorpay order -> client checkout -> verify signature -> webhook confirmation.

Do not put Razorpay secret, database password, OTP token or auth secret in client-side code.
