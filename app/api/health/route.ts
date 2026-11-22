import { db } from '@/lib/server/db';
import { json } from '@/lib/server/http';

export const dynamic = 'force-dynamic';

export function GET() {
  try {
    db().prepare('SELECT 1').get();
    return json({ ok: true });
  } catch {
    return json({ ok: false }, 503);
  }
}
