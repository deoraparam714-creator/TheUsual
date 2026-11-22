import 'server-only';
import crypto from 'node:crypto';
import { cookies } from 'next/headers';

export const KITCHEN_COOKIE = 'usual_kitchen';
const TTL_SECONDS = 14 * 3600; // one long shift

const isProd = process.env.NODE_ENV === 'production';

/** In production both env vars are required; in development we fall back to documented defaults. */
export function kitchenConfig(): { pin: string; secret: string } | null {
  const pin = process.env.KITCHEN_PIN ?? (isProd ? undefined : '2468');
  const secret = process.env.SESSION_SECRET ?? (isProd ? undefined : 'dev-only-secret-change-me');
  if (!pin || !secret) return null;
  return { pin, secret };
}

function sign(payload: string, secret: string) {
  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

export function checkPin(pin: string): boolean {
  const cfg = kitchenConfig();
  if (!cfg) return false;
  // Hash both sides so length differences don't leak through timing.
  const h = (s: string) => crypto.createHash('sha256').update(s).digest('hex');
  return safeEqual(h(pin), h(cfg.pin));
}

export function createSessionToken(now = Date.now()): string {
  const cfg = kitchenConfig();
  if (!cfg) throw new Error('Kitchen not configured');
  const exp = Math.floor(now / 1000) + TTL_SECONDS;
  const payload = `kitchen.${exp}`;
  return `${payload}.${sign(payload, cfg.secret)}`;
}

export function verifySessionToken(token: string | undefined, now = Date.now()): boolean {
  const cfg = kitchenConfig();
  if (!cfg || !token) return false;
  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== 'kitchen') return false;
  const exp = Number(parts[1]);
  if (!Number.isFinite(exp) || exp * 1000 < now) return false;
  return safeEqual(parts[2], sign(`${parts[0]}.${parts[1]}`, cfg.secret));
}

export async function isKitchenAuthed(): Promise<boolean> {
  const jar = await cookies();
  return verifySessionToken(jar.get(KITCHEN_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: isProd,
  path: '/',
  maxAge: TTL_SECONDS,
};
