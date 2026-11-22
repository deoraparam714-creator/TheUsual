'use client';

import { AnimatePresence, motion } from 'motion/react';
import { create } from 'zustand';

// ── Toast ───────────────────────────────────────────────
type ToastState = { msg: string | null; id: number; show: (msg: string) => void };
export const useToast = create<ToastState>((set) => ({
  msg: null,
  id: 0,
  show: (msg) => {
    const id = Date.now();
    set({ msg, id });
    setTimeout(() => set((s) => (s.id === id ? { msg: null } : s)), 2400);
  },
}));

export function Toaster({ raised = false }: { raised?: boolean }) {
  const { msg, id } = useToast();
  return (
    <div className={['pointer-events-none fixed inset-x-0 z-[80] flex justify-center px-4', raised ? 'bottom-[calc(5.5rem+env(safe-area-inset-bottom))] lg:bottom-8' : 'bottom-8'].join(' ')} aria-live="polite">
      <AnimatePresence>
        {msg && (
          <motion.p
            key={id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="on-dark flex items-center gap-2 rounded-full bg-espresso px-5 py-3 text-sm font-medium text-milk shadow-lg"
          >
            <span className="size-2 rounded-full bg-lime" aria-hidden />
            {msg}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Quantity stepper ───────────────────────────────────
export function Stepper({ value, onChange, min = 1, max = 20, label, size = 'md' }: { value: number; onChange: (v: number) => void; min?: number; max?: number; label: string; size?: 'sm' | 'md' }) {
  const btn = size === 'sm' ? 'size-9' : 'size-11';
  return (
    <div className="inline-flex items-center rounded-full border border-line-strong" role="group" aria-label={label}>
      <button type="button" className={`${btn} grid place-items-center rounded-full transition-colors hover:bg-foam disabled:opacity-30`} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={value <= 1 && min === 0 ? 'Remove' : 'One less'}>
        {value <= 1 && min === 0 ? (
          <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M3 8h10" strokeLinecap="round" />
          </svg>
        )}
      </button>
      <span className={['min-w-6 text-center font-semibold tabular-nums', size === 'sm' ? 'text-sm' : ''].join(' ')} aria-live="polite">
        {value}
      </span>
      <button type="button" className={`${btn} grid place-items-center rounded-full transition-colors hover:bg-foam disabled:opacity-30`} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="One more">
        <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M8 3v10M3 8h10" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

export function BagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M5 8h14l-1 12H6L5 8Z" strokeLinejoin="round" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" strokeLinecap="round" />
    </svg>
  );
}

export function Chevron({ className, dir = 'down' }: { className?: string; dir?: 'down' | 'left' | 'right' }) {
  const rot = dir === 'left' ? 'rotate-90' : dir === 'right' ? '-rotate-90' : '';
  return (
    <svg viewBox="0 0 16 16" className={[className, rot].filter(Boolean).join(' ')} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
