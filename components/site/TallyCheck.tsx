'use client';

import { useId, useState } from 'react';
import { Tally } from '@/components/brand/Tally';
import { Button } from '@/components/ui/Button';
import { normalizePhone } from '@/lib/format';
import { tallyMessage } from '@/lib/tally';
import { useHydrated } from '@/hooks/useHydrated';
import { useProfile } from '@/store/profile';

type Result = { stamps: number; rewardAvailable: boolean; totalOrders: number };

export function TallyCheck() {
  const hydrated = useHydrated();
  const savedPhone = useProfile((s) => s.phone);
  const [phone, setPhone] = useState<string | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');
  const id = useId();
  const value = phone ?? (hydrated ? savedPhone : '');

  async function check(e: React.FormEvent) {
    e.preventDefault();
    const n = normalizePhone(value);
    if (!n) {
      setError('That doesn’t look like a 10-digit mobile number.');
      setState('error');
      return;
    }
    setState('loading');
    setError('');
    try {
      const res = await fetch(`/api/regulars?phone=${n}`, { cache: 'no-store' });
      if (!res.ok) throw new Error();
      setResult(await res.json());
      setState('done');
    } catch {
      setError('That didn’t go through. Not you, us. Try again?');
      setState('error');
    }
  }

  return (
    <div className="rounded-[18px] bg-foam p-6 md:p-10">
      <form onSubmit={check} className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor={id} className="t-label text-grind">
            Your mobile number
          </label>
          <div className="mt-2 flex items-center rounded-[10px] border border-line-strong bg-milk focus-within:border-espresso">
            <span className="pl-4 text-grind">+91</span>
            <input
              id={id}
              inputMode="numeric"
              autoComplete="tel-national"
              value={value}
              onChange={(e) => setPhone(e.target.value.replace(/[^\d +]/g, '').slice(0, 14))}
              placeholder="98765 43210"
              className="min-h-12 w-full bg-transparent px-3 text-base focus:outline-none"
              aria-invalid={state === 'error'}
              aria-describedby={`${id}-msg`}
            />
          </div>
        </div>
        <Button type="submit" variant="espresso" disabled={state === 'loading'}>
          {state === 'loading' ? 'Counting…' : 'Check my tally'}
        </Button>
      </form>
      <div id={`${id}-msg`} aria-live="polite" className="min-h-6">
        {state === 'error' && <p className="mt-4 text-sm text-error">{error}</p>}
        {state === 'done' && result && (
          <div className="mt-8 flex items-center gap-6 border-t border-line pt-8">
            <Tally count={result.rewardAvailable ? 5 : result.stamps} ghost className="w-16 shrink-0" />
            <div>
              <p className="t-subhead">{tallyMessage(result.stamps, result.rewardAvailable)}</p>
              <p className="mt-1 text-sm text-grind">
                {result.totalOrders === 0 ? 'Your first order starts the count.' : `${result.totalOrders} ${result.totalOrders === 1 ? 'visit' : 'visits'} so far. Not that we’re counting. (We are.)`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
