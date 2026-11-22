'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Tally } from '@/components/brand/Tally';
import { buttonClass } from '@/components/ui/Button';
import { useHydrated } from '@/hooks/useHydrated';
import { inr } from '@/lib/format';
import { type PricedLine, priceLine } from '@/lib/pricing';
import { getLocation } from '@/lib/site';
import { type CartLine, useCart } from '@/store/cart';
import { Stepper } from './bits';

export function usePricedCart() {
  const lines = useCart((s) => s.lines);
  return useMemo(() => {
    const priced: { line: CartLine; priced: PricedLine }[] = [];
    for (const line of lines) {
      try {
        priced.push({ line, priced: priceLine(line) });
      } catch {
        // Item no longer on the menu; it is skipped and dropped at checkout.
      }
    }
    const subtotal = priced.reduce((s, p) => s + p.priced.lineTotal, 0);
    const count = priced.reduce((s, p) => s + p.priced.qty, 0);
    return { priced, subtotal, count };
  }, [lines]);
}

export function CartView({ onNavigate, showCheckout = true }: { onNavigate?: () => void; showCheckout?: boolean }) {
  const hydrated = useHydrated();
  const setQty = useCart((s) => s.setQty);
  const locationId = useCart((s) => s.locationId);
  const { priced, subtotal, count } = usePricedCart();
  const location = getLocation(locationId);

  if (!hydrated) return <div className="min-h-40" aria-busy="true" />;

  if (!priced.length) {
    return (
      <div className="flex flex-col items-start gap-4 py-6">
        <Tally count={0} ghost className="w-12" />
        <p className="t-subhead">Nothing here yet.</p>
        <p className="text-sm text-grind">Pick something from the menu. Once you’ve ordered, you can save it as your usual.</p>
      </div>
    );
  }

  return (
    <div>
      <ul className="divide-y divide-line">
        {priced.map(({ line, priced: p }) => (
          <li key={line.key} className="py-4 first:pt-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold leading-snug">{p.name}</p>
                {p.summary.length > 0 && <p className="mt-0.5 text-sm text-grind">{p.summary.join(' · ')}</p>}
                {p.note && <p className="mt-0.5 text-sm italic text-grind">“{p.note}”</p>}
              </div>
              <p className="shrink-0 font-semibold tabular-nums">{inr(p.lineTotal)}</p>
            </div>
            <div className="mt-2">
              <Stepper size="sm" value={line.qty} min={0} onChange={(v) => setQty(line.key, v)} label={`Quantity of ${p.name}`} />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex items-baseline justify-between border-t border-line pt-4">
        <span className="text-grind">Subtotal · {count} {count === 1 ? 'item' : 'items'}</span>
        <span className="font-display text-xl font-semibold tabular-nums">{inr(subtotal)}</span>
      </div>
      <p className="mt-1 text-sm text-grind">Pay at pickup{location ? ` at ${location.name}` : ''}. UPI, card or cash.</p>
      {showCheckout && (
        <Link href="/order/checkout" onClick={onNavigate} className={buttonClass('lime', 'lg', 'mt-5 w-full justify-between')}>
          <span>Checkout</span>
          <span className="tabular-nums">{inr(subtotal)}</span>
        </Link>
      )}
    </div>
  );
}
