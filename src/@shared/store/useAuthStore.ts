import { create } from 'zustand';
import { useFetch } from '@core/hooks/useFetch';
import { firstValueFrom, Observable, switchMap } from 'rxjs';

type AuthState = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isAuthenticated: boolean;
  user: any;
  authenticate: () => Observable<any>;
  login: (user: any) => void;
  logout: () => void;
  updateUser: (user: any) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: true,
  isAuthenticated: false,
  user: null,
  authenticate: () => {
    const { get } = useFetch();

    return get('auth/get-profile').pipe(
      switchMap((user) => {
        set({ isAuthenticated: true, user });
        return user;
      })
    );
  },
  login: (user: any) => set({ isAuthenticated: true, user }),
  logout: () => set({ isAuthenticated: false, user: null }),
  updateUser: (user: any) => set((state) => ({ user: { ...state.user, ...user } })),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
}));
