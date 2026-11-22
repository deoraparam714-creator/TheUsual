import { statusUpdateSchema } from '@/lib/schemas';
import { isKitchenAuthed } from '@/lib/server/auth';
import { errorResponse, json } from '@/lib/server/http';
import { updateOrderStatus } from '@/lib/server/orders';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isKitchenAuthed())) return json({ error: 'Sign in with the kitchen PIN.' }, 401);
  const { id } = await params;
  const parsed = statusUpdateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ error: 'Unknown status.' }, 422);
  try {
    return json({ order: updateOrderStatus(id, parsed.data.status) });
  } catch (e) {
    return errorResponse(e);
  }
}
