// src/app/api/rsvp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

function isAuthorized(req: NextRequest) {
  const token = req.headers.get('authorization');
  return token === `Bearer ${process.env.DASHBOARD_TOKEN}`;
}

export async function POST(req: NextRequest) {
  try {
    const { name, phone, guests } = await req.json();

    const n = (name ?? '').trim();
    const p = (phone ?? '').trim();
    const g = Number(guests);

    // ✅ בדיקת קלט
    if (!n || !p || !/^\+?\d{7,15}$/.test(p) || !Number.isInteger(g) || g < 1 || g > 20) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('rsvp')
      .insert({ name: n, phone: p, guests: g });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('rsvp')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
