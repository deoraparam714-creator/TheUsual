'use client';

import { create } from 'zustand';

type UI = {
  cartOpen: boolean;
  locationOpen: boolean;
  setCartOpen: (v: boolean) => void;
  setLocationOpen: (v: boolean) => void;
};

export const useOrderUI = create<UI>((set) => ({
  cartOpen: false,
  locationOpen: false,
  setCartOpen: (cartOpen) => set({ cartOpen }),
  setLocationOpen: (locationOpen) => set({ locationOpen }),
}));
