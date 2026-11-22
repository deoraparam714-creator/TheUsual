import 'server-only';
import { NextResponse } from 'next/server';
import { OrderError } from './orders';

const buckets = new Map<string, { count: number; reset: number }>();

/** Small in-memory fixed-window limiter. Good for one instance; use Redis or similar when scaling out. */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    if (buckets.size > 5000) for (const [k, v] of buckets) if (v.reset < now) buckets.delete(k);
    return true;
  }
  b.count += 1;
  return b.count <= limit;
}

export function clientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'local';
}

export function json<T>(data: T, init?: number | ResponseInit) {
  const res = NextResponse.json(data, typeof init === 'number' ? { status: init } : init);
  res.headers.set('Cache-Control', 'no-store');
  return res;
}

export function errorResponse(e: unknown) {
  if (e instanceof OrderError) return json({ error: e.message }, e.status);
  console.error(e);
  return json({ error: 'That didn’t go through. Not you, us. Try again?' }, 500);
}

export const tooMany = () => json({ error: 'Easy there. Give it a minute and try again.' }, 429);
