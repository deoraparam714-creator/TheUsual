import type { Metadata, Viewport } from 'next';
import { KitchenBoard } from '@/components/kitchen/KitchenBoard';

export const metadata: Metadata = { title: 'Kitchen', robots: { index: false, follow: false } };
export const viewport: Viewport = { themeColor: '#1C1A17' };

export default function KitchenPage() {
  return <KitchenBoard />;
}
