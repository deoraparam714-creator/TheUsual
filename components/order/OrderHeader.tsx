'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { OpenStatus } from '@/components/site/OpenStatus';
import { useHydrated } from '@/hooks/useHydrated';
import { formatHours, getLocation, locations } from '@/lib/site';
import { cartCount, useCart } from '@/store/cart';
import { useOrderUI } from '@/store/ui';
import { BagIcon, Chevron, Toaster } from './bits';
import { CartView } from './CartView';
import { Sheet } from './Sheet';

export function OrderHeader() {
  const hydrated = useHydrated();
  const pathname = usePathname();
  const lines = useCart((s) => s.lines);
  const locationId = useCart((s) => s.locationId);
  const setLocation = useCart((s) => s.setLocation);
  const { cartOpen, setCartOpen, locationOpen, setLocationOpen } = useOrderUI();
  const location = getLocation(locationId) ?? locations[0];
  const count = hydrated ? cartCount(lines) : 0;
  const onMenu = pathname === '/order';
  const onTrack = pathname.startsWith('/order/track');

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-milk/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-3 px-4 md:px-8">
          <Link href="/" className="-m-2 shrink-0 p-2" aria-label="the usual — home">
            <Logo variant="oneline" decorative className="h-5 w-auto md:h-[22px]" />
          </Link>

          <div className="flex min-w-0 items-center gap-1.5">
            {!onTrack && (
              <button
                type="button"
                onClick={() => setLocationOpen(true)}
                className="flex min-h-11 min-w-0 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors hover:bg-foam"
                aria-label={`Pickup at ${location.name}. Change location`}
              >
                <span className="truncate">{hydrated ? location.name : ' '}</span>
                <Chevron className="size-4 shrink-0 text-grind" />
              </button>
            )}
            {onMenu && (
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative grid size-11 place-items-center rounded-full transition-colors hover:bg-foam lg:hidden"
                aria-label={`Your order, ${count} ${count === 1 ? 'item' : 'items'}`}
              >
                <BagIcon className="size-6" />
                {count > 0 && <span className="absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-lime px-1 text-[0.6875rem] font-bold text-espresso">{count}</span>}
              </button>
            )}
          </div>
        </div>
      </header>

      <Sheet open={locationOpen} onClose={() => setLocationOpen(false)} label="Choose a pickup location">
        <div className="px-4 pb-6 pt-8 md:px-6">
          <p className="t-label text-grind">Pickup from</p>
          <h2 className="t-title mt-2">Where are you today?</h2>
          <ul className="mt-6 space-y-3">
            {locations.map((l) => {
              const active = l.id === location.id;
              return (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setLocation(l.id);
                      setLocationOpen(false);
                    }}
                    aria-pressed={active}
                    className={['flex w-full items-start justify-between gap-4 rounded-[18px] border p-4 text-left transition-colors', active ? 'border-espresso bg-foam' : 'border-line hover:border-line-strong'].join(' ')}
                  >
                    <span>
                      <span className="t-label block text-grind">{l.kind}</span>
                      <span className="mt-1 block font-display text-xl font-semibold">{l.name}</span>
                      <span className="mt-1 block text-sm text-grind">{formatHours(l.hours)}</span>
                      <OpenStatus locationId={l.id} className="mt-2" />
                    </span>
                    <span aria-hidden className={['mt-1 grid size-6 shrink-0 place-items-center rounded-full border-[1.5px]', active ? 'border-espresso bg-espresso' : 'border-line-strong'].join(' ')}>
                      {active && <span className="size-2 rounded-full bg-lime" />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </Sheet>

      <Sheet open={cartOpen} onClose={() => setCartOpen(false)} label="Your order">
        <div className="px-4 pb-6 pt-8 md:px-6">
          <p className="t-label text-grind">Pickup · {location.name}</p>
          <h2 className="t-title mt-2 mb-6">Your order</h2>
          <CartView onNavigate={() => setCartOpen(false)} />
        </div>
      </Sheet>

      <Toaster raised={onMenu && count > 0} />
    </>
  );
}
