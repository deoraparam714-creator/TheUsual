import { normalizePhone } from '@/lib/format';
import { clientIp, json, rateLimit, tooMany } from '@/lib/server/http';
import { getRegular } from '@/lib/server/orders';

export const dynamic = 'force-dynamic';

/** Tally lookup by phone. Returns counts only — never names or orders. */
export function GET(req: Request) {
  if (!rateLimit(`tally:${clientIp(req)}`, 20, 60_000)) return tooMany();
  const phone = normalizePhone(new URL(req.url).searchParams.get('phone') ?? '');
  if (!phone) return json({ error: 'That doesn’t look like a 10-digit mobile number.' }, 422);
  return json(getRegular(phone));
}
