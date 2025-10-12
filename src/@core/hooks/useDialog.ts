import { create } from 'zustand';
import { ReactNode } from 'react';

type DialogVariant = 'info' | 'success' | 'error';
type DialogType = 'alert' | 'confirmation';

interface DialogOptions {
  title?: string;
  message: string | ReactNode;
  messageBackground?: boolean;
  variant?: DialogVariant;
  type?: DialogType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface DialogState extends DialogOptions {
  isOpen: boolean;
  showDialog: (options: DialogOptions) => void;
  hideDialog: () => void;
}

const initialState = {
  isOpen: false,
  title: '',
  message: '',
  messageBackground: false,
  variant: 'info' as DialogVariant,
  type: 'alert' as DialogType,
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
      type: options.type || 'alert',
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      onConfirm: options.onConfirm,
      onCancel: options.onCancel,
    });
  },
  hideDialog: () => {
    set({ ...initialState })
  },
}));
