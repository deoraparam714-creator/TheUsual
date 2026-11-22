import { clientIp, errorResponse, json, rateLimit, tooMany } from '@/lib/server/http';
import { createOrder } from '@/lib/server/orders';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!rateLimit(`order:${clientIp(req)}`, 8, 60_000)) return tooMany();
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'That didn’t go through. Not you, us. Try again?' }, 400);
  }
  try {
    const order = createOrder(body);
    return json({ order }, 201);
  } catch (e) {
    return errorResponse(e);
  }
}
