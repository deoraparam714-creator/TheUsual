'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Tally } from '@/components/brand/Tally';
import { ItemImage } from '@/components/menu/ItemImage';
import { Button } from '@/components/ui/Button';
import { useHydrated } from '@/hooks/useHydrated';
import { useRegular, useSlots } from '@/hooks/useOrderData';
import { greeting, inr, istTime, istWeekday } from '@/lib/format';
import { categories, itemsIn, type MenuItem, menuById } from '@/lib/menu';
import { describeLines, type LineInput, priceLine, prepMinutes } from '@/lib/pricing';
import { getLocation, locations } from '@/lib/site';
import { tallyMessage } from '@/lib/tally';
import { useCart } from '@/store/cart';
import { useProfile } from '@/store/profile';
import { useOrderUI } from '@/store/ui';
import { useToast } from './bits';
import { CartView, usePricedCart } from './CartView';
import { ItemSheet } from './ItemSheet';

/** Keep only lines that still price (menu may have changed since they were saved). */
function validLines(lines: LineInput[]) {
  return lines.filter((l) => {
    try {
      priceLine(l);
      return true;
    } catch {
      return false;
    }
  });
}

export function OrderMenu({ initialItem, initialLocation }: { initialItem?: string; initialLocation?: string }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const lines = useCart((s) => s.lines);
  const locationId = useCart((s) => s.locationId);
  const setLocation = useCart((s) => s.setLocation);
  const replace = useCart((s) => s.replace);
  const add = useCart((s) => s.add);
  const name = useProfile((s) => s.name);
  const phone = useProfile((s) => s.phone);
  const usual = useProfile((s) => s.usual);
  const history = useProfile((s) => s.history);
  const setCartOpen = useOrderUI((s) => s.setCartOpen);
  const toast = useToast((s) => s.show);
  const [openItem, setOpenItem] = useState<MenuItem | null>(null);
  const { subtotal, count } = usePricedCart();

  // Deep links: /order?item=ghee-roast-roll&location=cafe
  const handledParams = useRef(false);
  useEffect(() => {
    if (!hydrated || handledParams.current) return;
    handledParams.current = true;
    if (initialLocation && getLocation(initialLocation)) setLocation(initialLocation);
    if (initialItem && menuById[initialItem]) setOpenItem(menuById[initialItem]);
    if (initialItem || initialLocation) router.replace('/order', { scroll: false });
  }, [hydrated, initialItem, initialLocation, router, setLocation]);

  const location = getLocation(locationId) ?? locations[0];
  const usualLines = useMemo(() => (hydrated && usual ? validLines(usual.lines) : []), [hydrated, usual]);
  const prep = prepMinutes(lines.length ? lines : usualLines);
  const { plan } = useSlots(location.id, prep);
  const regular = useRegular(hydrated ? phone : undefined);

  const usualTotal = usualLines.reduce((s, l) => s + priceLine(l).lineTotal, 0);
  const recent = useMemo(() => {
    if (!hydrated) return [];
    const usualKey = usual ? describeLines(usual.lines) : '';
    const seen = new Set<string>([usualKey]);
    return history
      .map((h) => ({ ...h, lines: validLines(h.lines), label: describeLines(h.lines) }))
      .filter((h) => h.lines.length && !seen.has(h.label) && seen.add(h.label))
      .slice(0, 3);
  }, [hydrated, history, usual]);

  const qtyByItem = useMemo(() => {
    const m: Record<string, number> = {};
    if (hydrated) for (const l of lines) m[l.itemId] = (m[l.itemId] ?? 0) + l.qty;
    return m;
  }, [hydrated, lines]);

  // Scroll-spy: the active tab is the last section whose top has passed under the tab bar.
  const [active, setActive] = useState<string>(categories[0].id);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        let current = categories[0].id;
        for (const c of categories) {
          const el = document.getElementById(`cat-${c.id}`);
          if (el && el.getBoundingClientRect().top <= 140) current = c.id;
        }
        // At the very bottom, the last section wins even if it is short.
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = categories[categories.length - 1].id;
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const orderUsual = () => {
    if (!usualLines.length) return;
    replace(usualLines);
    router.push('/order/checkout');
  };

  const firstSlot = plan?.slots[0];
  const timingLine = plan
    ? plan.asapAvailable && plan.asapReadyAt
      ? `Ready around ${istTime(plan.asapReadyAt)}`
      : firstSlot
        ? `${location.name} is closed. Pre-order from ${istTime(firstSlot.at)}${firstSlot.dayLabel === 'Today' ? '' : ` ${firstSlot.dayLabel.toLowerCase() === 'tomorrow' ? 'tomorrow' : istWeekday(firstSlot.at)}`}.`
        : `${location.name} is closed for now.`
    : '';

  return (
    <div className="mx-auto max-w-[1240px] px-4 pb-32 md:px-8 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12 lg:pb-20 xl:grid-cols-[minmax(0,1fr)_400px]">
      <div className="min-w-0">
        {/* Greeting */}
        <section className="pt-6 md:pt-10" aria-labelledby="greet">
          <p className={['min-h-6 text-grind transition-opacity duration-500', hydrated ? 'opacity-100' : 'opacity-0'].join(' ')}>
            {hydrated ? `${greeting()}${name ? `, ${name}` : ''}.` : ' '}
          </p>
          <h1 id="greet" className="t-headline mt-1">
            {usualLines.length ? (
              <>
                Your <span className="accent">usual?</span>
              </>
            ) : (
              <>
                What’s your <span className="accent">usual?</span>
              </>
            )}
          </h1>

          {plan && !plan.asapAvailable && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-toast px-4 py-2 text-sm">
              <span className="size-2 rounded-full bg-grind/60" aria-hidden />
              {timingLine}
            </p>
          )}

          {usualLines.length > 0 ? (
            <div className="mt-6 rounded-[18px] bg-foam p-5 md:p-6">
              <p className="t-label text-grind">Saved usual · {location.name}</p>
              <p className="t-subhead mt-2">{describeLines(usualLines)}</p>
              {(() => {
                const extras = usualLines.flatMap((l) => priceLine(l).summary);
                return extras.length ? <p className="mt-1 text-sm text-grind">{extras.join(' · ')}</p> : null;
              })()}
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-grind">{plan?.asapAvailable ? timingLine : firstSlot ? `Earliest ${istTime(firstSlot.at)}` : ' '}</span>
                <span className="font-semibold tabular-nums">{inr(usualTotal)}</span>
              </div>
              <Button variant="lime" size="lg" className="mt-4 w-full" onClick={orderUsual}>
                Order my usual
              </Button>
            </div>
          ) : (
            <p className="mt-3 max-w-[40ch] text-grind">Pick it once. Save it as your usual at checkout. Next time it’s one tap.</p>
          )}

          {regular && (
            <div className="mt-5 flex items-center gap-4">
              <Tally count={regular.rewardAvailable ? 5 : regular.stamps} ghost className="w-9 shrink-0" label={`${regular.stamps} of 5`} />
              <p className="text-sm">{tallyMessage(regular.stamps, regular.rewardAvailable)}</p>
            </div>
          )}

          {recent.length > 0 && (
            <div className="mt-6">
              <p className="t-label text-grind">Again?</p>
              <ul className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
                {recent.map((h) => (
                  <li key={h.id} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        h.lines.forEach((l) => add(l));
                        toast('Added to your order.');
                      }}
                      className="flex min-h-11 max-w-[18rem] items-center gap-2 rounded-full border border-line-strong px-4 text-sm transition-colors hover:border-espresso"
                    >
                      <span className="truncate">{h.label}</span>
                      <span className="shrink-0 text-grind">+</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Category tabs */}
        <nav aria-label="Menu categories" className="sticky top-16 z-30 -mx-4 mt-8 border-b border-line bg-milk/92 px-4 backdrop-blur-md md:-mx-8 md:px-8 lg:mx-0 lg:px-0">
          <ul className="no-scrollbar flex gap-2 overflow-x-auto py-3">
            {categories.map((c) => (
              <li key={c.id}>
                <a
                  href={`#cat-${c.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(`cat-${c.id}`);
                    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 124, behavior: 'smooth' });
                    setActive(c.id);
                  }}
                  aria-current={active === c.id ? 'true' : undefined}
                  className={['inline-flex min-h-10 items-center rounded-full px-4 text-sm font-medium transition-colors duration-300', active === c.id ? 'bg-espresso text-milk' : 'bg-foam hover:bg-toast'].join(' ')}
                >
                  {c.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Menu */}
        {categories.map((c) => (
          <section key={c.id} id={`cat-${c.id}`} className="scroll-mt-32 pt-10" aria-labelledby={`h-${c.id}`}>
            <h2 id={`h-${c.id}`} className="t-title">
              {c.title}
              <span className="dot" aria-hidden />
            </h2>
            <p className="mt-1 text-sm text-grind">{c.blurb}</p>
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {itemsIn(c.id).map((item) => (
                <li key={item.id}>
                  <MenuRow item={item} qty={qtyByItem[item.id] ?? 0} onOpen={() => setOpenItem(item)} />
                </li>
              ))}
            </ul>
          </section>
        ))}
        <p className="mt-12 border-t border-line pt-6 text-sm text-grind">100% vegetarian. All prices in ₹. Pay at pickup — UPI, card or cash.</p>
      </div>

      {/* Desktop cart */}
      <aside className="hidden lg:block" aria-label="Your order">
        <div className="sticky top-24 mt-10 rounded-[18px] bg-foam p-6">
          <p className="t-label text-grind">Pickup · {location.name}</p>
          <h2 className="t-title mb-6 mt-2">Your order</h2>
          <CartView />
        </div>
      </aside>

      {/* Mobile cart bar */}
      <AnimatePresence>
        {hydrated && count > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:hidden"
          >
            <button type="button" onClick={() => setCartOpen(true)} className="on-dark flex min-h-14 w-full items-center justify-between rounded-full bg-espresso pl-3 pr-6 text-milk shadow-[0_16px_40px_-12px_rgb(28_26_23_/_0.55)]">
              <span className="flex items-center gap-3 font-semibold">
                <span className="grid size-8 place-items-center rounded-full bg-lime text-sm font-bold text-espresso">{count}</span>
                View order
              </span>
              <span className="font-semibold tabular-nums">{inr(subtotal)}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <ItemSheet item={openItem} onClose={() => setOpenItem(null)} />
    </div>
  );
}

function MenuRow({ item, qty, onOpen }: { item: MenuItem; qty: number; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="group flex w-full items-center gap-4 rounded-[18px] bg-foam p-3 text-left transition-colors duration-300 hover:bg-[#f7f2e9]" aria-label={`${item.name}, ${inr(item.price)}${qty ? `, ${qty} in your order` : ''}`}>
      <span className="relative block shrink-0">
        <ItemImage item={item} sizes="96px" compact className="size-[84px] rounded-[12px]" />
        {qty > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-6 min-w-6 place-items-center rounded-full bg-lime px-1.5 text-xs font-bold text-espresso">{qty}</span>}
      </span>
      <span className="block min-w-0 flex-1">
        <span className="block text-[1.0625rem] font-semibold leading-snug">{item.name}</span>
        <span className="mt-0.5 line-clamp-2 block text-sm text-grind">{item.description}</span>
        <span className="mt-2 block font-semibold tabular-nums">{inr(item.price)}</span>
      </span>
      <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-espresso text-milk transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-90">
        <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M8 3v10M3 8h10" strokeLinecap="round" />
        </svg>
      </span>
    </button>
  );
}
