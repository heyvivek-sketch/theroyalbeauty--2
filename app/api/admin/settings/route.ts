import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const rows = await db.siteSetting.findMany({ orderBy: { key: 'asc' } });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const key = String(body?.key ?? '').trim();
    const value = String(body?.value ?? '');

    if (!key) return NextResponse.json({ error: 'Setting key is required' }, { status: 400 });

    const setting = await db.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    // Settings are consumed by the shared storefront layout and info pages.
    // Revalidate them immediately after an admin save so changes appear without
    // waiting for a deployment or stale server-rendered response.
    revalidatePath('/', 'layout');
    revalidatePath('/contact');
    revalidatePath('/terms');

    return NextResponse.json({ ok: true, setting });
  } catch (error) {
    console.error('Admin settings save failed:', error);
    return NextResponse.json({ error: 'Could not save this setting. Please try again.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const key = new URL(req.url).searchParams.get('key');
  if (!key) return NextResponse.json({ error: 'Setting key is required' }, { status: 400 });

  try {
    await db.siteSetting.delete({ where: { key } });
    revalidatePath('/', 'layout');
    revalidatePath('/contact');
    revalidatePath('/terms');
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Admin setting delete failed:', error);
    return NextResponse.json({ error: 'Could not delete this setting.' }, { status: 500 });
  }
}
