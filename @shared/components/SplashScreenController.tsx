import { useAuthStore } from '@shared/store/useAuthStore';
import { SplashScreen } from 'expo-router';

export default function SplashScreenController() {
  // const isLoading = useAuthStore((state) => state.isLoading);
  const { isLoading } = useAuthStore();

  if (!isLoading) {
    SplashScreen.hideAsync();
  }

  return null;
}
