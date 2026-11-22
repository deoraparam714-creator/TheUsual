'use client';

import { useState } from 'react';
import { Logo } from '@/components/brand/Logo';

/** The tally card, front and back (p.20). Tap the back to add visits. */
export function TallyCard() {
  const [count, setCount] = useState(3);
  const full = count >= 5;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="on-dark grid aspect-[1.6] place-items-center rounded-[18px] bg-espresso text-milk shadow-[0_24px_60px_-30px_rgb(28_26_23_/_0.6)]">
        <Logo variant="stacked" className="w-[42%] text-milk" />
      </div>
      <div className="flex aspect-[1.6] flex-col justify-between rounded-[18px] bg-foam p-5 shadow-[0_24px_60px_-30px_rgb(28_26_23_/_0.35)] md:p-6">
        <p className="font-display text-xl font-extrabold tracking-[-0.02em] md:text-2xl">
          Your usual, <span className="accent font-normal">counted</span>
          <span className="dot" aria-hidden />
        </p>
        <div className="relative">
          <ol className="grid grid-cols-5 gap-2" aria-label={`${count} of 5 visits`}>
            {Array.from({ length: 5 }, (_, i) => (
              <li key={i} className="grid aspect-[0.85] place-items-center rounded-[10px] border-2 border-toast">
                <span className={['block h-[55%] w-[6px] rounded-full bg-espresso transition-transform duration-500 ease-[var(--ease-out-expo)]', i < count ? 'scale-y-100' : 'scale-y-0'].join(' ')} />
              </li>
            ))}
          </ol>
          <span
            aria-hidden
            className={[
              'pointer-events-none absolute left-[-3%] right-[-3%] top-1/2 h-[7px] -translate-y-1/2 -rotate-[11deg] rounded-full bg-lime transition-transform duration-700 ease-[var(--ease-out-expo)] origin-left',
              full ? 'scale-x-100' : 'scale-x-0',
            ].join(' ')}
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-grind" aria-live="polite">
            {full ? 'Five. The next one’s on us.' : 'Fill five, the next one’s on us.'}
          </p>
          <button
            type="button"
            onClick={() => setCount((c) => (c >= 5 ? 0 : c + 1))}
            className="min-h-11 shrink-0 rounded-full border border-espresso px-4 text-xs font-semibold transition-colors hover:bg-espresso hover:text-milk"
          >
            {full ? 'Start again' : 'Add a visit'}
          </button>
        </div>
      </div>
    </div>
  );
}
