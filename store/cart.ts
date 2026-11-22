'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { lineKey, MAX_QTY_PER_LINE, type LineInput } from '@/lib/pricing';
import { DEFAULT_LOCATION_ID } from '@/lib/site';

export type CartLine = LineInput & { key: string };

type CartState = {
  lines: CartLine[];
  locationId: string;
  add: (line: LineInput) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  replace: (lines: LineInput[]) => void;
  clear: () => void;
  setLocation: (id: string) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      locationId: DEFAULT_LOCATION_ID,
      add: (line) =>
        set((s) => {
          const key = lineKey(line);
          const existing = s.lines.find((l) => l.key === key);
          if (existing) {
            return { lines: s.lines.map((l) => (l.key === key ? { ...l, qty: Math.min(MAX_QTY_PER_LINE, l.qty + line.qty) } : l)) };
          }
          return { lines: [...s.lines, { ...line, key }] };
        }),
      setQty: (key, qty) =>
        set((s) => ({
          lines: qty <= 0 ? s.lines.filter((l) => l.key !== key) : s.lines.map((l) => (l.key === key ? { ...l, qty: Math.min(MAX_QTY_PER_LINE, qty) } : l)),
        })),
      remove: (key) => set((s) => ({ lines: s.lines.filter((l) => l.key !== key) })),
      replace: (lines) => set({ lines: lines.map((l) => ({ ...l, key: lineKey(l) })) }),
      clear: () => set({ lines: [] }),
      setLocation: (id) => set({ locationId: id }),
    }),
    { name: 'the-usual:cart', version: 1, storage: createJSONStorage(() => localStorage) },
  ),
);

export const cartCount = (lines: CartLine[]) => lines.reduce((s, l) => s + l.qty, 0);
