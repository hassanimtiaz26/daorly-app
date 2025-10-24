import { create } from 'zustand';
import { ReactNode } from 'react';

type DrawerState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useDrawer = create<DrawerState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
