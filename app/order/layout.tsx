import type { Metadata, Viewport } from 'next';
import { OrderHeader } from '@/components/order/OrderHeader';

export const metadata: Metadata = {
  title: { default: 'Order ahead for pickup at Mesa', template: '%s — the usual' },
  description: 'Order your usual ahead: 35g+ protein paneer rolls, fries, bowls and coffee. Takeaway from RJ Twin Building or pre-order at Mesa, your name on the cup.',
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
