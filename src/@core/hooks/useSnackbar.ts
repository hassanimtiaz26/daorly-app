import { create } from 'zustand';
import type { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

interface SnackbarOptions {
  message: string;
  icon?: IconSource;
  duration?: number;
  onIconPress?: () => void;
  onDismiss?: () => void;
}

interface SnackbarState extends SnackbarOptions {
  isVisible: boolean;
  show: (options: SnackbarOptions) => void;
  hide: () => void;
}

const initialState = {
  isVisible: false,
  message: '',
  icon: undefined,
  duration: 5000,
  onIconPress: undefined,
  onDismiss: undefined,
};

export const useSnackbar = create<SnackbarState>((set) => ({
  ...initialState,
  show: (options) => {
    set({
      isVisible: true,
      message: options.message,
      icon: options.icon,
      duration: options.duration,
      onIconPress: options.onDismiss,
      onDismiss: options.onDismiss,
    });
  },
  hide: () => {
    set({ ...initialState })
  },
}));
