import { categories, menu } from '@/lib/menu';
import { locations } from '@/lib/site';

export const dynamic = 'force-static';

export function GET() {
  return Response.json({ categories, items: menu, locations });
}
