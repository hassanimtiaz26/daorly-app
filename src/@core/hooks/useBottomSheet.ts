import { ReactNode } from 'react';
import { create } from 'zustand';

type BottomSheetState = {
  isOpen: boolean;
  content: ReactNode | null;
  open: (content: ReactNode) => void;
  close: () => void;
}

export const useBottomSheet = create<BottomSheetState>((set) => ({
  isOpen: false,
  content: null,
  open: (content: ReactNode) => set({ isOpen: true, content }),
  close: () => set({ isOpen: false, content: null }),
}));
