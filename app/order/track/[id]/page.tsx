import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Tracker } from '@/components/order/Tracker';
import { getOrder } from '@/lib/server/orders';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Your order', robots: { index: false } };

export default async function TrackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getOrder(id);
  if (!order) notFound();
  return <Tracker initial={order} />;
}
