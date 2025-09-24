import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BaseTheme } from '@core/config/theme.config';
import { StyleSheet, View } from 'react-native';
import { SplashScreen, Stack } from 'expo-router';
import { useAuthStore } from '@shared/store/useAuthStore';
import { useEffect } from 'react';
import '@core/localization/i18n';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { useAppTheme } from '@core/hooks/useAppTheme';

const createStyles = (colors: MD3Colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  }
});

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const { isLoading, isAuthenticated, setIsLoading } = useAuthStore();

  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000)
  }, []);

  useEffect(() => {
    if (loaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isLoading]);


  if (!loaded && isLoading) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={BaseTheme}>
        <SafeAreaView style={styles.container}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={!isAuthenticated}>
              <Stack.Screen name="(auth)" />
            </Stack.Protected>

            <Stack.Protected guard={isAuthenticated}>
              <Stack.Screen name="(app)" />
            </Stack.Protected>

            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar
            style="dark" />
        </SafeAreaView>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

