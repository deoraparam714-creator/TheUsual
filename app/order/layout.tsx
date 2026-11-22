import type { Metadata, Viewport } from 'next';
import { OrderHeader } from '@/components/order/OrderHeader';

export const metadata: Metadata = {
  title: { default: 'Order ahead', template: '%s — the usual' },
  description: 'Order your usual ahead for pickup. Rolls, fries, bowls and drinks, your name on the cup.',
  alternates: { canonical: '/order' },
};

export const viewport: Viewport = { themeColor: '#F5F1EA' };

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OrderHeader />
      <main id="main">{children}</main>
    </>
  );
}
