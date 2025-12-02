import { create } from 'zustand';
import { useFetch } from '@core/hooks/useFetch';
import { firstValueFrom, Observable, switchMap } from 'rxjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Config } from '@core/constants/Config';
import { ApiRoutes } from '@core/constants/ApiRoutes';
import { TUser } from '@core/types/user.type';

type AuthState = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isAuthenticated: boolean;
  user: TUser;
  authenticate: () => Observable<any>;
  login: (user: any) => void;
  logout: () => void;
  setUser: (user: TUser) => void;
}

export const useAuth = create<AuthState>((set) => ({
  isLoading: true,
  isAuthenticated: false,
  user: null,
  authenticate: () => {
    const { get } = useFetch();

    return get(ApiRoutes.user.index).pipe(
      switchMap((user) => {
        set({ isAuthenticated: true, user });
        return user;
      })
    );
  },
  login: (user: any) => set({ isAuthenticated: true, user }),
  logout: () => {
    AsyncStorage.removeItem(Config.tokenStoreKey)
      .then(() => {
        set({ isAuthenticated: false, user: null });
      });
  },
  setUser: (user: TUser) => set((state) => ({ user })),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
}));
