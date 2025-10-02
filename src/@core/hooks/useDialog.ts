import { create } from 'zustand';
import { ReactNode } from 'react';

type DialogVariant = 'info' | 'success' | 'error' | 'confirmation';

// Define the properties the showDialog function will accept
interface DialogOptions {
  title?: string;
  message: string | ReactNode;
  variant?: DialogVariant;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

// Define the full state of the store
interface DialogState extends DialogOptions {
  isOpen: boolean;
  showDialog: (options: DialogOptions) => void;
  hideDialog: () => void;
}

const initialState = {
  isOpen: false,
  title: '',
  message: '',
  variant: 'info' as DialogVariant,
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  onConfirm: undefined,
  onCancel: undefined,
};

export const useDialog = create<DialogState>((set) => ({
  ...initialState,
  showDialog: (options) => {
    set({
      isOpen: true,
      title: options.title,
      message: options.message,
      variant: options.variant || 'info',
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      onConfirm: options.onConfirm,
      onCancel: options.onCancel,
    });
  },
  hideDialog: () => set({ ...initialState }),
}));
