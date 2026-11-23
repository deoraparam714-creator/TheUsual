'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { NameSticker } from '@/components/brand/NameSticker';
import { istTime, minutesAgo, padOrderNumber } from '@/lib/format';
import type { OrderStatus } from '@/lib/schemas';
import type { KitchenOrder } from '@/lib/server/orders';
import { getLocation, openLocations } from '@/lib/site';

type Session = 'loading' | 'out' | 'in' | 'unconfigured';

const COLUMNS: { status: OrderStatus; title: string; next?: { to: OrderStatus; label: string } }[] = [
  { status: 'received', title: 'New', next: { to: 'making', label: 'Start' } },
  { status: 'making', title: 'Making', next: { to: 'ready', label: 'Ready' } },
  { status: 'ready', title: 'Ready', next: { to: 'collected', label: 'Collected' } },
];

export function KitchenBoard() {
  const [session, setSession] = useState<Session>('loading');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [loc, setLoc] = useState<string>('all');
  const [tab, setTab] = useState<OrderStatus>('received');
  const [now, setNow] = useState(() => Date.now());
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/kitchen/session', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setSession(!d.configured ? 'unconfigured' : d.authed ? 'in' : 'out'))
      .catch(() => setSession('out'));
  }, []);

  const load = useCallback(async () => {
    const r = await fetch('/api/kitchen/orders', { cache: 'no-store' });
    if (r.status === 401) return setSession('out');
    if (r.ok) {
      const d = await r.json();
      setOrders(d.orders);
      setNow(Date.now());
    }
  }, []);

  useEffect(() => {
    if (session !== 'in') return;
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [session, load]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const r = await fetch('/api/kitchen/session', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ pin }) });
    const d = await r.json().catch(() => ({}));
    if (r.ok) {
      setSession('in');
      setPin('');
    } else setError(d.error ?? 'That PIN didn’t work.');
  }

  async function move(id: string, status: OrderStatus) {
    setBusy(id);
    try {
      const r = await fetch(`/api/kitchen/orders/${id}`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status }) });
      if (r.ok) {
        const d = await r.json();
        setOrders((os) => os.map((o) => (o.id === id ? d.order : o)));
      } else if (r.status === 401) setSession('out');
    } finally {
      setBusy(null);
    }
  }

  async function logout() {
    await fetch('/api/kitchen/session', { method: 'DELETE' });
    setSession('out');
    setOrders([]);
  }

  if (session === 'loading') return <div className="min-h-dvh bg-espresso" />;

  if (session !== 'in') {
    return (
      <main id="main" className="on-dark grid min-h-dvh place-items-center bg-espresso px-4 text-milk">
        <form onSubmit={login} className="w-full max-w-sm">
          <Logo variant="stacked" className="w-28 text-milk" />
          <h1 className="t-headline mt-10">Kitchen<span className="dot" aria-hidden /></h1>
          {session === 'unconfigured' ? (
            <p className="mt-4 text-milk/70">Set <code className="rounded bg-milk/10 px-1">KITCHEN_PIN</code> on the server to turn the kitchen display on.</p>
          ) : (
            <>
              <label htmlFor="pin" className="t-label mt-8 block text-milk/60">
                Kitchen PIN
              </label>
              <input
                id="pin"
                type="password"
                inputMode="numeric"
                autoComplete="current-password"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
                className="mt-3 min-h-14 w-full rounded-[10px] border border-milk/20 bg-milk/5 px-4 text-center text-3xl tracking-[0.5em] focus:border-milk focus:outline-none"
                autoFocus
              />
              {error && <p className="mt-3 text-sm text-[#ff9a8f]">{error}</p>}
              <button type="submit" className="mt-6 min-h-14 w-full rounded-full bg-lime font-semibold text-espresso">
                Open the board
              </button>
            </>
          )}
          <Link href="/" className="mt-8 inline-block text-sm text-milk/50 underline underline-offset-4">
            Back to the site
          </Link>
        </form>
      </main>
    );
  }

  const visible = orders.filter((o) => loc === 'all' || o.locationId === loc);
  const doneCount = visible.filter((o) => o.status === 'collected').length;

  return (
    <main id="main" className="on-dark min-h-dvh bg-espresso text-milk">
      <header className="sticky top-0 z-10 border-b border-milk/10 bg-espresso/95 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
          <div className="flex items-center gap-4">
            <Logo variant="oneline" className="h-5 w-auto text-milk" />
            <span className="t-label text-milk/50">Kitchen</span>
          </div>
          <div className="no-scrollbar flex gap-1 overflow-x-auto">
            {[{ id: 'all', name: 'All' }, ...openLocations].map((l) => (
              <button key={l.id} type="button" onClick={() => setLoc(l.id)} aria-pressed={loc === l.id} className={['min-h-10 shrink-0 rounded-full px-4 text-sm transition-colors', loc === l.id ? 'bg-milk text-espresso' : 'text-milk/70 hover:bg-milk/10'].join(' ')}>
                {l.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm text-milk/60">
            <span>{doneCount} collected (last 3 h)</span>
            <button type="button" onClick={logout} className="min-h-10 rounded-full border border-milk/20 px-4 hover:border-milk">
              Lock
            </button>
          </div>
        </div>
        <div className="flex gap-1 px-4 pb-3 md:hidden">
          {COLUMNS.map((c) => {
            const n = visible.filter((o) => o.status === c.status).length;
            return (
              <button key={c.status} type="button" onClick={() => setTab(c.status)} className={['min-h-10 flex-1 rounded-full text-sm font-semibold', tab === c.status ? 'bg-lime text-espresso' : 'bg-milk/10'].join(' ')}>
                {c.title} · {n}
              </button>
            );
          })}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3 md:p-6">
        {COLUMNS.map((col) => {
          const list = visible.filter((o) => o.status === col.status);
          return (
            <section key={col.status} className={[tab === col.status ? 'block' : 'hidden', 'md:block'].join(' ')} aria-labelledby={`col-${col.status}`}>
              <h2 id={`col-${col.status}`} className="mb-3 hidden items-baseline justify-between md:flex">
                <span className="font-display text-2xl font-extrabold">{col.title}</span>
                <span className="text-sm text-milk/50">{list.length}</span>
              </h2>
              <ul className="space-y-3">
                {list.length === 0 && <li className="rounded-[18px] border border-dashed border-milk/15 p-6 text-center text-sm text-milk/40">Nothing here.</li>}
                {list.map((o) => {
                  const fresh = now - new Date(o.createdAt).getTime() < 90_000 && o.status === 'received';
                  return (
                    <li key={o.id} className={['rounded-[18px] bg-milk p-4 text-espresso transition-shadow', fresh ? 'shadow-[0_0_0_3px_var(--color-lime)]' : ''].join(' ')}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-display text-3xl font-extrabold leading-none">{padOrderNumber(o.number)}</p>
                          <p className="mt-1 text-xs text-grind">
                            {getLocation(o.locationId)?.name} · placed {minutesAgo(o.createdAt, now)}
                          </p>
                          <p className="mt-2 inline-flex rounded-full bg-toast px-3 py-1 text-sm font-semibold">{o.isAsap ? `ASAP · ${istTime(o.pickupAt)}` : `For ${istTime(o.pickupAt)}`}</p>
                        </div>
                        <NameSticker name={o.nameOnCup} className="w-20 shrink-0" />
                      </div>
                      <ul className="mt-4 space-y-2 border-t border-line pt-3">
                        {o.lines.map((l, i) => (
                          <li key={i}>
                            <p className="font-semibold">
                              <span className="tabular-nums">{l.qty} ×</span> {l.name}
                            </p>
                            {l.summary.length > 0 && <p className="text-sm text-grind">{l.summary.join(' · ')}</p>}
                            {l.note && <p className="mt-0.5 rounded bg-lime/40 px-1.5 py-0.5 text-sm">“{l.note}”</p>}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-3 text-sm">
                        <span className="text-grind">
                          ₹{o.total} at pickup{o.rewardUsed ? ' · free usual' : ''} · ••{o.phoneLast4}
                        </span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        {col.next && (
                          <button type="button" disabled={busy === o.id} onClick={() => move(o.id, col.next!.to)} className="min-h-12 flex-1 rounded-full bg-espresso font-semibold text-milk disabled:opacity-50">
                            {col.next.label}
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={busy === o.id}
                          onClick={() => {
                            if (window.confirm(`Cancel order ${padOrderNumber(o.number)} for ${o.nameOnCup}?`)) move(o.id, 'cancelled');
                          }}
                          className="min-h-12 rounded-full border border-line-strong px-4 text-sm disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
