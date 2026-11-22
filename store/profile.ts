'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { LineInput } from '@/lib/pricing';

export type SavedUsual = { lines: LineInput[]; locationId: string; savedAt: string };
export type PastOrder = { id: string; number: number; createdAt: string; total: number; lines: LineInput[]; locationId: string };

type ProfileState = {
  name: string;
  phone: string;
  usual: SavedUsual | null;
  history: PastOrder[];
  setName: (name: string) => void;
  setPhone: (phone: string) => void;
  saveUsual: (u: SavedUsual) => void;
  clearUsual: () => void;
  addOrder: (o: PastOrder) => void;
};

export const useProfile = create<ProfileState>()(
  persist(
    (set) => ({
      name: '',
      phone: '',
      usual: null,
      history: [],
      setName: (name) => set({ name }),
      setPhone: (phone) => set({ phone }),
      saveUsual: (usual) => set({ usual }),
      clearUsual: () => set({ usual: null }),
      addOrder: (o) => set((s) => ({ history: [o, ...s.history.filter((h) => h.id !== o.id)].slice(0, 12) })),
    }),
    { name: 'the-usual:profile', version: 1, storage: createJSONStorage(() => localStorage) },
  ),
);
