import { json } from '@/lib/server/http';
import { getLocation } from '@/lib/site';
import { planSlots } from '@/lib/slots';

export const dynamic = 'force-dynamic';

export function GET(req: Request) {
  const url = new URL(req.url);
  const location = getLocation(url.searchParams.get('location'));
  if (!location) return json({ error: 'Unknown location.' }, 404);
  const prep = Math.min(20, Math.max(3, Number(url.searchParams.get('prep')) || 6));
  return json({ locationId: location.id, prep, now: new Date().toISOString(), ...planSlots(location, new Date(), prep) });
}
