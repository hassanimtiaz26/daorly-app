import { useAuth } from '@core/hooks/useAuth';
import { SplashScreen } from 'expo-router';

export default function SplashScreenController() {
  // const isLoading = useAuthStore((state) => state.isLoading);
  const { isLoading } = useAuth();

  if (!isLoading) {
    SplashScreen.hideAsync();
  }

  return null;
}
