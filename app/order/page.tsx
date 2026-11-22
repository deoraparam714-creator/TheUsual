import { OrderMenu } from '@/components/order/OrderMenu';

type SP = Promise<{ item?: string | string[]; location?: string | string[] }>;

export default async function OrderPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (typeof v === 'string' ? v : undefined);
  return <OrderMenu initialItem={one(sp.item)} initialLocation={one(sp.location)} />;
}
