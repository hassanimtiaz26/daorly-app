import { useAuth } from '@core/hooks/useAuth';
import HomeProvider from '@components/home/HomeProvider';
import HomeClient from '@components/home/HomeClient';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { useFetch } from '@core/hooks/useFetch';
import { ApiRoutes } from '@core/constants/ApiRoutes';

export default function HomeScreen() {
  const { get } = useFetch();
  const { setUser, user } = useAuth();

  useFocusEffect(
    useCallback(() => {
      get(ApiRoutes.user.index)
        .subscribe({
          next: (response) => {
            if (response && 'data' in response) {
              setUser(response.data.user);
              console.log('HomeScreen.SetUser');
            }
          },
        });
      return () => {};
    }, [])
  );

  if (user.role === 'provider') {
    return <HomeProvider />;
  }

  return <HomeClient />;
}

