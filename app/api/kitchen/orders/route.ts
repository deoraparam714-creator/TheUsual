import { isKitchenAuthed } from '@/lib/server/auth';
import { json } from '@/lib/server/http';
import { listKitchenOrders } from '@/lib/server/orders';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isKitchenAuthed())) return json({ error: 'Sign in with the kitchen PIN.' }, 401);
  return json({ orders: listKitchenOrders(), now: new Date().toISOString() });
}
