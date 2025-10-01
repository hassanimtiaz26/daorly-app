import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BaseTheme } from '@core/config/theme.config';
import { StyleSheet, View } from 'react-native';
import { SplashScreen, Stack, useSegments } from 'expo-router';
import { useAuthStore } from '@shared/store/useAuthStore';
import { useCallback, useEffect } from 'react';
import '@core/localization/i18n';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { checkNotifications, requestNotifications, RESULTS } from 'react-native-permissions';
import { useFetch } from '@core/hooks/useFetch';
import { switchMap } from 'rxjs';
import ThemedSplashScreen from '@components/ui/screens/Splash';
import { useFirebase } from '@core/hooks/useFirebase';

const createStyles = (colors: MD3Colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  }
});

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });
  const { isLoading, isAuthenticated, setIsLoading, login } = useAuthStore();
  const segments = useSegments();

  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const { firebaseToken } = useFirebase();

  const { get } = useFetch();

  useEffect(() => {
    console.log('Current route segments:', segments);
  }, [segments]);

  useEffect(() => {
    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 3000)
    // console.log('isLoading', isLoading);
    get('auth/get-profile').subscribe({
      next: (response) => {
        console.log('getProfile', response);
        if (response && 'data' in response) {
          if ('user' in response.data) {
            login(response.data.user);
          }
        }
      },
      complete: () => {
        console.log('getProfile Complete')
        setIsLoading(false);
      },
    })
  }, []);

  useEffect(() => {
    console.log('Firebase Token:', firebaseToken);
  }, [firebaseToken]);

  const checkNotificationPermissions = useCallback(async () => {
    const { status } = await checkNotifications();

    if (status === RESULTS.DENIED || status === RESULTS.LIMITED) {
      const notificationsRequestResult = await requestNotifications([
        'alert',
        'sound',
        'badge',
      ]);
      console.log('notificationsRequestResult', notificationsRequestResult);
    }
  }, []);

  useEffect(() => {
    checkNotificationPermissions().then();
  }, [checkNotificationPermissions]);

  useEffect(() => {
    // console.log('loaded', loaded, 'isLoading', isLoading);
    if (loaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isLoading]);


  if (!loaded || isLoading) {
    // Async font loading only occurs in development.
    return <ThemedSplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={BaseTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={!isAuthenticated}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>

          <Stack.Protected guard={isAuthenticated}>
            <Stack.Screen name="(app)" />
          </Stack.Protected>

          <Stack.Screen name="+not-found" />
        </Stack>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

