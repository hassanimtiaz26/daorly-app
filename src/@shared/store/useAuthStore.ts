import { create } from 'zustand';

type AuthState = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isAuthenticated: boolean;
  user: any;
  login: (user: any) => void;
  logout: () => void;
  updateUser: (user: any) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: true,
  isAuthenticated: false,
  user: null,
  login: (user: any) => set({ isAuthenticated: true, user }),
  logout: () => set({ isAuthenticated: false, user: null }),
  updateUser: (user: any) => set((state) => ({ user: { ...state.user, ...user } })),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
}));
