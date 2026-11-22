import { json } from '@/lib/server/http';
import { getOrder } from '@/lib/server/orders';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) return json({ error: 'We can’t find that order.' }, 404);
  return json({ order });
}
