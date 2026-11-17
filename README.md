# The Royal Beauty — Full-Stack Home Beauty Platform

Production-oriented Next.js + TypeScript + PostgreSQL + Prisma starter for a home beauty booking platform.

## Included in the project archive
- Customer booking flow
- OTP authentication
- Customer dashboard
- Booking cancellation/rescheduling
- Service/category management
- Slot availability and reservation locking
- Service areas and pincode validation
- Coupons
- Razorpay order/signature/webhook endpoints
- Admin dashboard
- Staff/beautician portal
- Reviews and moderation
- Notifications
- Prisma/PostgreSQL schema
- Docker PostgreSQL setup

## Local setup

```bash
npm install
cp .env.example .env
docker compose up -d
npm run db:push
npm run db:seed
npm run dev
```

## Production

Configure managed PostgreSQL, strong AUTH_SECRET, live Razorpay credentials, real OTP/SMS provider, HTTPS, backups, monitoring and transactional messaging.

> Do not commit `.env` or production secrets.
