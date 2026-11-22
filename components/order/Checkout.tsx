'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useState } from 'react';
import { NameSticker } from '@/components/brand/NameSticker';
import { Tally } from '@/components/brand/Tally';
import { Button, buttonClass } from '@/components/ui/Button';
import { useHydrated } from '@/hooks/useHydrated';
import { useRegular, useSlots } from '@/hooks/useOrderData';
import { inr, istTime, normalizePhone } from '@/lib/format';
import { priceOrder, prepMinutes, sameLines } from '@/lib/pricing';
import { nameOnCupSchema } from '@/lib/schemas';
import { formatHours, getLocation, locations } from '@/lib/site';
import { tallyMessage } from '@/lib/tally';
import { useCart } from '@/store/cart';
import { useProfile } from '@/store/profile';
import { Chevron } from './bits';
import { usePricedCart } from './CartView';

type Pickup = { type: 'asap' } | { type: 'scheduled'; at: string };

function Step({ n, title, children, hint }: { n: number; title: string; children: React.ReactNode; hint?: React.ReactNode }) {
  return (
    <section className="border-t border-line py-8 first:border-t-0 first:pt-2" aria-labelledby={`step-${n}`}>
      <div className="flex items-baseline justify-between gap-4">
        <h2 id={`step-${n}`} className="flex items-baseline gap-3">
          <span className="t-label text-grind">{String(n).padStart(2, '0')}</span>
          <span className="t-subhead">{title}</span>
        </h2>
        {hint}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function Checkout() {
  const router = useRouter();
  const hydrated = useHydrated();
  const cartLines = useCart((s) => s.lines);
  const locationId = useCart((s) => s.locationId);
  const setLocation = useCart((s) => s.setLocation);
  const clearCart = useCart((s) => s.clear);
  const profile = useProfile();
  const { priced } = usePricedCart();
  const ids = { name: useId(), phone: useId() };

  const [name, setName] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [pickup, setPickup] = useState<Pickup | null>(null);
  const [useReward, setUseReward] = useState(true);
  const [saveUsual, setSaveUsual] = useState<boolean | null>(null);
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [laterOpen, setLaterOpen] = useState(false);

  const nameValue = name ?? (hydrated ? profile.name : '');
  const phoneValue = phone ?? (hydrated ? profile.phone : '');
  const location = getLocation(locationId) ?? locations[0];
  const lines = useMemo(() => priced.map((p) => ({ itemId: p.line.itemId, qty: p.line.qty, options: p.line.options, note: p.line.note })), [priced]);
  const prep = prepMinutes(lines);
  const { plan, error: slotsError } = useSlots(location.id, prep);
  const regular = useRegular(phoneValue);
  const rewardOn = Boolean(regular?.rewardAvailable && useReward);

  // Default pickup: ASAP when open, otherwise the first slot. Reset when location changes.
  useEffect(() => {
    if (!plan) return;
    setPickup((cur) => {
      if (cur?.type === 'asap' && plan.asapAvailable) return cur;
      if (cur?.type === 'scheduled' && plan.slots.some((s) => s.at === cur.at)) return cur;
      return plan.asapAvailable ? { type: 'asap' } : plan.slots[0] ? { type: 'scheduled', at: plan.slots[0].at } : null;
    });
    if (!plan.asapAvailable) setLaterOpen(true);
  }, [plan]);

  const totals = useMemo(() => {
    if (!lines.length) return null;
    try {
      return priceOrder(lines, { useReward: rewardOn });
    } catch {
      return null;
    }
  }, [lines, rewardOn]);

  const nameCheck = nameOnCupSchema.safeParse(nameValue);
  const nameError = nameCheck.success ? '' : nameCheck.error.issues[0]?.message;
  const phoneNorm = normalizePhone(phoneValue);
  const phoneError = phoneNorm ? '' : 'We need a 10-digit mobile number for your tally.';
  const isSameAsUsual = hydrated && profile.usual ? sameLines(profile.usual.lines, lines) : false;
  const saveUsualValue = saveUsual ?? (hydrated ? !profile.usual : true);

  const slotGroups = useMemo(() => {
    const g: { day: string; slots: string[] }[] = [];
    for (const s of plan?.slots ?? []) {
      const last = g[g.length - 1];
      if (last?.day === s.dayLabel) last.slots.push(s.at);
      else g.push({ day: s.dayLabel, slots: [s.at] });
    }
    return g;
  }, [plan]);

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    setServerError('');
    if (!nameCheck.success || !phoneNorm || !pickup || !lines.length) {
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ locationId: location.id, pickup, nameOnCup: nameCheck.data, phone: phoneNorm, lines, useReward: rewardOn }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.order) {
        setServerError(data.error ?? 'That didn’t go through. Not you, us. Try again?');
        setSubmitting(false);
        return;
      }
      const order = data.order as { id: string; number: number; createdAt: string; total: number };
      profile.setName(nameCheck.data);
      profile.setPhone(phoneNorm);
      profile.addOrder({ id: order.id, number: order.number, createdAt: order.createdAt, total: order.total, lines, locationId: location.id });
      if (saveUsualValue && !isSameAsUsual) profile.saveUsual({ lines, locationId: location.id, savedAt: new Date().toISOString() });
      clearCart();
      router.replace(`/order/track/${order.id}`);
    } catch {
      setServerError('That didn’t go through. Not you, us. Try again?');
      setSubmitting(false);
    }
  }

  if (!hydrated) return <div className="mx-auto min-h-[60vh] max-w-[1240px] px-4" aria-busy="true" />;

  if (!cartLines.length) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center md:py-32">
        <Tally count={0} ghost className="mx-auto w-14" />
        <h1 className="t-headline mt-8">
          Nothing to <span className="accent">check out</span>
          <span className="dot" aria-hidden />
        </h1>
        <p className="mt-4 text-grind">Your order is empty. Pick something first.</p>
        <Link href="/order" className={buttonClass('espresso', 'lg', 'mt-8')}>
          Back to the menu
        </Link>
      </div>
    );
  }

  const submitLabel = totals ? `Place order · ${inr(totals.total)}` : 'Place order';

  return (
    <form onSubmit={placeOrder} noValidate className="mx-auto max-w-[1240px] px-4 pb-16 pt-6 md:px-8 md:pt-10 lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14">
      <div className="min-w-0">
        <Link href="/order" className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-grind hover:text-espresso">
          <Chevron dir="left" className="size-4" /> Menu
        </Link>
        <h1 className="t-headline mt-2">
          Nearly <span className="accent">yours</span>
          <span className="dot" aria-hidden />
        </h1>

        <div className="mt-8">
          <Step n={1} title="Name on the cup">
            <div className="flex items-center gap-5">
              <div className="flex-1">
                <label htmlFor={ids.name} className="sr-only">
                  Name on the cup
                </label>
                <input
                  id={ids.name}
                  value={nameValue}
                  onChange={(e) => setName(e.target.value.slice(0, 20))}
                  autoComplete="given-name"
                  placeholder="Riya"
                  aria-invalid={touched && !!nameError}
                  aria-describedby={`${ids.name}-help`}
                  className="hand min-h-14 w-full border-b-2 border-espresso bg-transparent text-4xl leading-none placeholder:text-espresso/25 focus:outline-none aria-[invalid=true]:border-error"
                />
                <p id={`${ids.name}-help`} className={['mt-2 text-sm', touched && nameError ? 'text-error' : 'text-grind'].join(' ')}>
                  {touched && nameError ? nameError : 'Every cup gets a name, handwritten. No name, no cup.'}
                </p>
              </div>
              <NameSticker name={nameValue} className="w-24 shrink-0 -rotate-6 md:w-28" />
            </div>
          </Step>

          <Step n={2} title="Pickup">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Pickup location">
              {locations.map((l) => {
                const on = l.id === location.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setLocation(l.id)}
                    className={['rounded-[18px] border p-4 text-left transition-colors', on ? 'border-espresso bg-foam' : 'border-line hover:border-line-strong'].join(' ')}
                  >
                    <span className="t-label block text-grind">{l.kind}</span>
                    <span className="mt-1 block font-semibold">{l.name}</span>
                    <span className="mt-1 block text-xs text-grind">{formatHours(l.hours)}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 space-y-2" role="radiogroup" aria-label="Pickup time">
              {slotsError && <p className="text-sm text-error">Couldn’t load pickup times. Not you, us. Refresh to try again?</p>}
              {!plan && !slotsError && <div className="h-16 animate-pulse rounded-[18px] bg-foam" />}
              {plan && (
                <>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={pickup?.type === 'asap'}
                    disabled={!plan.asapAvailable}
                    onClick={() => setPickup({ type: 'asap' })}
                    className={['flex w-full items-center justify-between gap-4 rounded-[18px] border p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50', pickup?.type === 'asap' ? 'border-espresso bg-foam' : 'border-line hover:border-line-strong'].join(' ')}
                  >
                    <span>
                      <span className="block font-semibold">As soon as it’s ready</span>
                      <span className="mt-0.5 block text-sm text-grind">{plan.asapAvailable && plan.asapReadyAt ? `Ready in ${prep} min · around ${istTime(plan.asapReadyAt)}` : `${location.name} is closed right now`}</span>
                    </span>
                    <Radio on={pickup?.type === 'asap'} />
                  </button>
                  <div className={['rounded-[18px] border transition-colors', pickup?.type === 'scheduled' ? 'border-espresso bg-foam' : 'border-line'].join(' ')}>
                    <button type="button" onClick={() => setLaterOpen((v) => !v)} aria-expanded={laterOpen} className="flex w-full items-center justify-between gap-4 p-4 text-left">
                      <span>
                        <span className="block font-semibold">Later</span>
                        <span className="mt-0.5 block text-sm text-grind">
                          {pickup?.type === 'scheduled' ? `${plan.slots.find((s) => s.at === pickup.at)?.dayLabel ?? ''}, ${istTime(pickup.at)}` : 'Pick a time. Pre-order by 11, lunch by 1.'}
                        </span>
                      </span>
                      <Chevron className={['size-5 transition-transform', laterOpen ? 'rotate-180' : ''].join(' ')} />
                    </button>
                    {laterOpen && (
                      <div className="space-y-4 px-4 pb-4">
                        {slotGroups.length === 0 && <p className="text-sm text-grind">No more pickup times this week. Try another location.</p>}
                        {slotGroups.map((g) => (
                          <div key={g.day}>
                            <p className="t-label text-grind">{g.day}</p>
                            <div className="no-scrollbar -mx-4 mt-2 flex gap-2 overflow-x-auto px-4 pb-1">
                              {g.slots.map((at) => {
                                const on = pickup?.type === 'scheduled' && pickup.at === at;
                                return (
                                  <button
                                    key={at}
                                    type="button"
                                    role="radio"
                                    aria-checked={on}
                                    onClick={() => setPickup({ type: 'scheduled', at })}
                                    className={['min-h-11 shrink-0 rounded-full border px-4 text-sm tabular-nums transition-colors', on ? 'border-espresso bg-espresso text-milk' : 'border-line-strong bg-milk hover:border-espresso'].join(' ')}
                                  >
                                    {istTime(at)}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
              {touched && !pickup && plan && <p className="text-sm text-error">Pick a pickup time.</p>}
            </div>
          </Step>

          <Step n={3} title="Your number">
            <label htmlFor={ids.phone} className="sr-only">
              Mobile number
            </label>
            <div className={['flex items-center rounded-[10px] border bg-milk focus-within:border-espresso', touched && phoneError ? 'border-error' : 'border-line-strong'].join(' ')}>
              <span className="pl-4 text-grind">+91</span>
              <input
                id={ids.phone}
                inputMode="numeric"
                autoComplete="tel-national"
                value={phoneValue}
                onChange={(e) => setPhone(e.target.value.replace(/[^\d +]/g, '').slice(0, 14))}
                placeholder="98765 43210"
                aria-invalid={touched && !!phoneError}
                aria-describedby={`${ids.phone}-help`}
                className="min-h-12 w-full bg-transparent px-3 text-base focus:outline-none"
              />
            </div>
            <p id={`${ids.phone}-help`} className={['mt-2 text-sm', touched && phoneError ? 'text-error' : 'text-grind'].join(' ')}>
              {touched && phoneError ? phoneError : 'For your tally. No spam, ever.'}
            </p>
            {regular && (
              <div className="mt-4 flex items-center gap-4 rounded-[18px] bg-foam p-4">
                <Tally count={regular.rewardAvailable ? 5 : regular.stamps} ghost className="w-10 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{tallyMessage(regular.stamps, regular.rewardAvailable)}</p>
                  {regular.rewardAvailable && (
                    <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm">
                      <input type="checkbox" checked={useReward} onChange={(e) => setUseReward(e.target.checked)} className="size-4 accent-espresso" />
                      Use it on this order
                    </label>
                  )}
                </div>
              </div>
            )}
          </Step>
        </div>
      </div>

      {/* Summary */}
      <aside className="lg:pt-24" aria-label="Order summary">
        <div className="rounded-[18px] bg-foam p-5 md:p-6 lg:sticky lg:top-24">
          <div className="flex items-baseline justify-between">
            <h2 className="t-subhead">Your order</h2>
            <Link href="/order" className="text-sm font-medium underline decoration-line-strong underline-offset-4 hover:decoration-espresso">
              Edit
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-line">
            {totals?.lines.map((l, i) => (
              <li key={i} className="flex justify-between gap-4 py-3 text-[0.9375rem]">
                <span className="min-w-0">
                  <span className="font-medium">
                    {l.qty > 1 && <span className="tabular-nums">{l.qty} × </span>}
                    {l.name}
                  </span>
                  {l.summary.length > 0 && <span className="block text-sm text-grind">{l.summary.join(' · ')}</span>}
                  {l.note && <span className="block text-sm italic text-grind">“{l.note}”</span>}
                </span>
                <span className="shrink-0 tabular-nums">{inr(l.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-2 space-y-1.5 border-t border-line pt-4 text-[0.9375rem]">
            <div className="flex justify-between">
              <dt className="text-grind">Subtotal</dt>
              <dd className="tabular-nums">{totals ? inr(totals.subtotal) : '—'}</dd>
            </div>
            {totals && totals.discount > 0 && (
              <div className="flex justify-between">
                <dt>Free usual · tally full</dt>
                <dd className="tabular-nums">−{inr(totals.discount)}</dd>
              </div>
            )}
            <div className="flex items-baseline justify-between pt-2">
              <dt className="font-semibold">To pay at pickup</dt>
              <dd className="font-display text-2xl font-semibold tabular-nums">{totals ? inr(totals.total) : '—'}</dd>
            </div>
          </dl>
          <p className="mt-1 text-sm text-grind">UPI, card or cash at the counter.</p>

          {!isSameAsUsual && (
            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-[10px] border border-line p-3 text-sm">
              <input type="checkbox" checked={saveUsualValue} onChange={(e) => setSaveUsual(e.target.checked)} className="mt-0.5 size-4 accent-espresso" />
              <span>
                <span className="font-semibold">Save this as my usual</span>
                <span className="block text-grind">Next time it’s one tap.</span>
              </span>
            </label>
          )}

          {serverError && (
            <p role="alert" className="mt-4 rounded-[10px] bg-error/10 p-3 text-sm text-error">
              {serverError}
            </p>
          )}

          <Button type="submit" variant="lime" size="lg" className="mt-5 w-full" disabled={submitting}>
            {submitting ? 'Sending it to the counter…' : submitLabel}
          </Button>
        </div>
      </aside>
    </form>
  );
}

function Radio({ on }: { on: boolean }) {
  return (
    <span aria-hidden className={['grid size-6 shrink-0 place-items-center rounded-full border-[1.5px]', on ? 'border-espresso bg-espresso' : 'border-line-strong'].join(' ')}>
      {on && <span className="size-2 rounded-full bg-lime" />}
    </span>
  );
}
