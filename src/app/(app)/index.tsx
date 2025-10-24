import { Text } from 'react-native-paper';
import { Redirect } from 'expo-router';
import { useAuth } from '@core/hooks/useAuth';
import { useEffect } from 'react';

export default function AppIndexScreen() {
  const { user } = useAuth();

  useEffect(() => {
    console.log('app/index rendered');
  }, []);

  if (!user.profileCompletedAt) {
    return (
      <Redirect href={'/(app)/(complete)/profile'} />
    );
  }

  if (user.role === 'provider' && !user.businessAccountCompletedAt) {
    return (
      <Redirect href={'/(app)/(complete)/business'} />
    );
  }

  return (
    <Redirect href={'/(app)/(tabs)/home'} />
  );
};
