import { checkPin, createSessionToken, isKitchenAuthed, KITCHEN_COOKIE, kitchenConfig, sessionCookieOptions } from '@/lib/server/auth';
import { clientIp, json, rateLimit, tooMany } from '@/lib/server/http';

export const dynamic = 'force-dynamic';

export async function GET() {
  return json({ authed: await isKitchenAuthed(), configured: Boolean(kitchenConfig()) });
}

/** Sign in with the kitchen PIN. */
export async function POST(req: Request) {
  if (!rateLimit(`pin:${clientIp(req)}`, 6, 5 * 60_000)) return tooMany();
  if (!kitchenConfig()) return json({ error: 'Kitchen PIN isn’t set up on this server.' }, 503);
  const body = (await req.json().catch(() => ({}))) as { pin?: unknown };
  if (typeof body.pin !== 'string' || !checkPin(body.pin)) return json({ error: 'That PIN didn’t work.' }, 401);
  const res = json({ authed: true });
  res.cookies.set(KITCHEN_COOKIE, createSessionToken(), sessionCookieOptions);
  return res;
}

export async function DELETE() {
  const res = json({ authed: false });
  res.cookies.set(KITCHEN_COOKIE, '', { ...sessionCookieOptions, maxAge: 0 });
  return res;
}
