import { db, storage } from '@/lib/server/db';
import { json } from '@/lib/server/http';

export const dynamic = 'force-dynamic';

/** Liveness for the host's health check. `storage: "volume"` confirms orders survive redeploys. */
export function GET() {
  try {
    db().prepare('SELECT 1').get();
    return json({ ok: true, storage: storage() });
  } catch {
    return json({ ok: false }, 503);
  }
}
