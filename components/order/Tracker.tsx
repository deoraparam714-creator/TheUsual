'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Cup } from '@/components/brand/Cup';
import { Tally } from '@/components/brand/Tally';
import { Button, buttonClass } from '@/components/ui/Button';
import { useHydrated } from '@/hooks/useHydrated';
import { inr, istTime, istWeekday, padOrderNumber } from '@/lib/format';
import { sameLines } from '@/lib/pricing';
import type { OrderStatus } from '@/lib/schemas';
import type { PublicOrder } from '@/lib/server/orders';
import { getLocation } from '@/lib/site';
import { tallyMessage } from '@/lib/tally';
import { useProfile } from '@/store/profile';
import { useToast } from './bits';

const COPY: Record<OrderStatus, { title: React.ReactNode; sub: string }> = {
  received: { title: <>Got it<span className="dot" aria-hidden /></>, sub: 'Your usual’s on the way.' },
  making: { title: <>On it<span className="dot" aria-hidden /></>, sub: 'Making it now. Same as always.' },
  ready: { title: <>Your usual is <span className="accent">ready</span><span className="dot" aria-hidden /></>, sub: 'At the counter. Look for your name.' },
  collected: { title: <>Enjoy<span className="dot" aria-hidden /></>, sub: 'Same time tomorrow?' },
  cancelled: { title: <>Cancelled<span className="dot dot-mono" aria-hidden /></>, sub: 'This one’s off. If that’s a surprise, talk to us at the counter.' },
};

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'received', label: 'Received' },
  { key: 'making', label: 'Making' },
  { key: 'ready', label: 'Ready' },
];
const RANK: Record<OrderStatus, number> = { received: 0, making: 1, ready: 2, collected: 3, cancelled: -1 };

export function Tracker({ initial }: { initial: PublicOrder }) {
  const [order, setOrder] = useState(initial);
  const hydrated = useHydrated();
  const usual = useProfile((s) => s.usual);
  const saveUsual = useProfile((s) => s.saveUsual);
  const toast = useToast((s) => s.show);
  const location = getLocation(order.locationId);
  const done = order.status === 'collected' || order.status === 'cancelled';

  useEffect(() => {
    if (done) return;
    let alive = true;
    const tick = async () => {
      try {
        const r = await fetch(`/api/orders/${order.id}`, { cache: 'no-store' });
        if (r.ok) {
          const d = await r.json();
          if (alive && d.order) setOrder(d.order);
        }
      } catch {
        /* keep the last known state */
      }
    };
    const t = setInterval(tick, 4000);
    const onVis = () => document.visibilityState === 'visible' && tick();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      alive = false;
      clearInterval(t);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [order.id, done]);

  const linesInput = order.lines.map((l) => ({ itemId: l.itemId, qty: l.qty, options: Object.fromEntries(groupChoices(l.choices)), note: l.note }));
  const isUsual = hydrated && usual ? sameLines(usual.lines, linesInput) : false;
  const rank = RANK[order.status];
  const today = istWeekday(order.pickupAt) === istWeekday(new Date());
  const pickupLine = order.isAsap ? `Ready around ${istTime(order.pickupAt)}` : `Pickup ${today ? 'today' : istWeekday(order.pickupAt)} at ${istTime(order.pickupAt)}`;
  const c = COPY[order.status];

  return (
    <div className="mx-auto max-w-[1240px] px-4 pb-20 pt-6 md:px-8 md:pt-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <p className="t-label text-grind">
            Order {padOrderNumber(order.number)} · {location?.name}
          </p>
          <h1 className="t-display mt-4 !text-[clamp(3rem,10vw,6.5rem)]" aria-live="polite">
            {c.title}
          </h1>
          <p className="t-body-lg mt-4 text-grind">{c.sub}</p>

          {order.status !== 'cancelled' && (
            <ol className="mt-10 grid grid-cols-3 gap-2" aria-label="Order progress">
              {STEPS.map((s, i) => {
                const reached = rank >= i;
                const current = rank === i;
                const time = i === 0 ? order.createdAt : i === 1 ? order.times.making : order.times.ready;
                return (
                  <li key={s.key} aria-current={current ? 'step' : undefined}>
                    <div className="relative h-1.5 overflow-hidden rounded-full bg-line">
                      <div className={['absolute inset-y-0 left-0 rounded-full transition-[width] duration-1000 ease-[var(--ease-out-expo)]', reached ? 'w-full' : 'w-0', i === 2 && reached ? 'bg-lime' : 'bg-espresso'].join(' ')} />
                    </div>
                    <p className={['mt-3 text-sm font-semibold', reached ? '' : 'text-grind'].join(' ')}>
                      {s.label}
                      {current && !done && <span className="pulse-dot ml-2 inline-block size-1.5 rounded-full bg-espresso align-middle" aria-hidden />}
                    </p>
                    <p className="text-xs tabular-nums text-grind">{reached && time ? istTime(time) : ' '}</p>
                  </li>
                );
              })}
            </ol>
          )}

          <dl className="mt-10 grid grid-cols-1 gap-x-8 gap-y-5 border-t border-line pt-8 sm:grid-cols-2">
            <div>
              <dt className="t-label text-grind">When</dt>
              <dd className="t-subhead mt-1">{pickupLine}</dd>
            </div>
            <div>
              <dt className="t-label text-grind">Where</dt>
              <dd className="t-subhead mt-1">{location?.name}</dd>
              <dd className="text-sm text-grind">{location?.area}</dd>
            </div>
          </dl>

          <div className="mt-10 rounded-[18px] bg-foam p-5 md:p-6">
            <ul className="divide-y divide-line">
              {order.lines.map((l, i) => (
                <li key={i} className="flex justify-between gap-4 py-3 text-[0.9375rem] first:pt-0">
                  <span>
                    <span className="font-medium">
                      {l.qty > 1 && `${l.qty} × `}
                      {l.name}
                    </span>
                    {l.summary.length > 0 && <span className="block text-sm text-grind">{l.summary.join(' · ')}</span>}
                    {l.note && <span className="block text-sm italic text-grind">“{l.note}”</span>}
                  </span>
                  <span className="tabular-nums">{inr(l.lineTotal)}</span>
                </li>
              ))}
            </ul>
            {order.discount > 0 && (
              <p className="flex justify-between border-t border-line pt-3 text-[0.9375rem]">
                <span>Free usual · tally full</span>
                <span className="tabular-nums">−{inr(order.discount)}</span>
              </p>
            )}
            <p className="mt-2 flex items-baseline justify-between border-t border-line pt-4">
              <span className="font-semibold">{order.status === 'collected' ? 'Paid at pickup' : 'Pay at pickup'}</span>
              <span className="font-display text-2xl font-semibold tabular-nums">{inr(order.total)}</span>
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {hydrated && !isUsual && order.status !== 'cancelled' && (
              <Button
                variant="espresso"
                onClick={() => {
                  saveUsual({ lines: linesInput, locationId: order.locationId, savedAt: new Date().toISOString() });
                  toast('Saved. That’s your usual now.');
                }}
              >
                Save as my usual
              </Button>
            )}
            {hydrated && isUsual && <p className="inline-flex min-h-12 items-center text-sm text-grind">This is your saved usual.</p>}
            <Link href="/order" className={buttonClass('outline')}>
              Order something else
            </Link>
          </div>
        </div>

        <div className="lg:col-span-4 lg:col-start-9">
          <div className="rounded-[18px] bg-toast p-8 md:p-10">
            <div className="mx-auto w-[60%] max-w-[240px]">
              <Cup name={order.nameOnCup} className="-rotate-3" />
            </div>
            <p className="mt-6 text-center text-sm text-espresso/70">Look for this name at the counter.</p>
          </div>
          {order.status !== 'cancelled' && (
            <div className="mt-4 flex items-center gap-4 rounded-[18px] border border-line p-5">
              <Tally count={order.tally.rewardAvailable ? 5 : order.tally.stamps} ghost draw className="w-12 shrink-0" />
              <div>
                <p className="t-label text-grind">Your tally</p>
                <p className="mt-1 text-[0.9375rem] font-medium">{order.rewardUsed ? 'Free usual used. Back to one.' : tallyMessage(order.tally.stamps, order.tally.rewardAvailable)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="mt-20 border-t border-line pt-10 font-display text-4xl font-extrabold tracking-[-0.02em] md:text-6xl">
        Same time <span className="accent">tomorrow?</span>
      </p>
    </div>
  );
}

function groupChoices(choices: { groupId: string; choiceId: string }[]): [string, string[]][] {
  const m = new Map<string, string[]>();
  for (const c of choices) m.set(c.groupId, [...(m.get(c.groupId) ?? []), c.choiceId]);
  return [...m.entries()];
}
