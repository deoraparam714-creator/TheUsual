'use client';

import { useEffect, useState } from 'react';
import { normalizePhone } from '@/lib/format';
import type { SlotPlan } from '@/lib/slots';

export type Regular = { stamps: number; rewardAvailable: boolean; totalOrders: number };

/** Tally for a phone number, fetched once it's a valid number. */
export function useRegular(phone: string | undefined) {
  const n = phone ? normalizePhone(phone) : null;
  const [data, setData] = useState<{ phone: string; regular: Regular } | null>(null);
  useEffect(() => {
    if (!n) return;
    let alive = true;
    fetch(`/api/regulars?phone=${n}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: Regular | null) => alive && d && setData({ phone: n, regular: d }))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [n]);
  return n && data?.phone === n ? data.regular : null;
}

export type SlotsResponse = SlotPlan & { locationId: string; prep: number; now: string };

/** Pickup plan for a location, refreshed every minute. */
export function useSlots(locationId: string, prep: number) {
  const [data, setData] = useState<SlotsResponse | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch(`/api/slots?location=${locationId}&prep=${prep}`, { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((d: SlotsResponse) => {
          if (alive) {
            setData(d);
            setError(false);
          }
        })
        .catch(() => alive && setError(true));
    load();
    const t = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [locationId, prep]);
  return { plan: data?.locationId === locationId ? data : null, error };
}
