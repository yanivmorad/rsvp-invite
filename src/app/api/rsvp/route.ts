// src/app/api/rsvp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

function isAuthorized(req: NextRequest) {
  const token = req.headers.get('authorization') ?? '';
  return token === `Bearer ${process.env.DASHBOARD_TOKEN}`;
}

const requireAuth = process.env.DASHBOARD_PROTECT === '1'; // set to '1' in production to require auth

function sendError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: NextRequest) {
  try {
    const { name, phone, guests } = await req.json();

    const n = (name ?? '').trim();
    const p = (phone ?? '').trim();
    const g = Number(guests);

    if (!n || !Number.isInteger(g) || g < 1 || g > 20) {
      return sendError('Invalid input', 400);
    }

    const { error, data } = await supabaseAdmin
      .from('rsvp')
      .insert({ name: n, phone: p, guests: g })
      .select(); // select to return inserted row

    if (error) {
      console.error('Supabase INSERT error:', error);
      return sendError(error.message || 'Insert failed', 500);
    }

    return NextResponse.json({ ok: true, inserted: data ?? [] });
  } catch (err: unknown) {
    console.error('POST /api/rsvp error:', err);
    return sendError('Bad request', 400);
  }
}

export async function GET(req: NextRequest) {
  try {
    if (requireAuth && !isAuthorized(req)) {
      return sendError('Unauthorized', 401);
    }

    const { data, error } = await supabaseAdmin
      .from('rsvp')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase SELECT error:', error);
      return sendError(error.message || 'Failed to fetch', 500);
    }

    return NextResponse.json(data ?? []);
  } catch (err: unknown) {
    console.error('GET /api/rsvp error:', err);
    return sendError('Server error', 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (requireAuth && !isAuthorized(req)) {
      return sendError('Unauthorized', 401);
    }

    const body = await req.json();
    const rawId = body?.id;

    const id = typeof rawId === 'string' ? Number(rawId) : rawId;
    if (!Number.isInteger(id)) {
      return sendError('Invalid ID', 400);
    }

    const { data, error } = await supabaseAdmin
      .from('rsvp')
      .delete()
      .eq('id', id)
      .select(); // return deleted rows

    if (error) {
      console.error('Supabase DELETE error:', error);
      return sendError(error.message || 'Delete failed', 500);
    }

    if (!data || data.length === 0) {
      return sendError('Not found or already deleted', 404);
    }

    return NextResponse.json({ ok: true, deleted: data.length, deletedRows: data });
  } catch (err: unknown) {
    console.error('DELETE /api/rsvp error:', err);
    return sendError('Bad request', 400);
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (requireAuth && !isAuthorized(req)) {
      return sendError('Unauthorized', 401);
    }

    const body = await req.json();
    const rawId = body?.id;
    const id = typeof rawId === "string" ? Number(rawId) : rawId;

    if (!Number.isInteger(id)) {
      return sendError('Invalid ID', 400);
    }

    const n = (body?.name ?? "").trim();
    const p = (body?.phone ?? "").trim();
    const g = Number(body?.guests);

    if (!n || !Number.isInteger(g) || g < 1 || g > 20) {
      return sendError('Invalid input', 400);
    }

    const { data, error } = await supabaseAdmin
      .from("rsvp")
      .update({ name: n, phone: p, guests: g })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Supabase UPDATE error:", error);
      return sendError(error.message || "Update failed", 500);
    }

    if (!data || data.length === 0) {
      return sendError("Not found", 404);
    }

    return NextResponse.json({ ok: true, updated: data });
  } catch (err: unknown) {
    console.error("PUT /api/rsvp error:", err);
    return sendError("Bad request", 400);
  }
}
