import { useAuth } from '@core/hooks/useAuth';
import HomeProvider from '@components/home/HomeProvider';
import HomeClient from '@components/home/HomeClient';

export default function HomeScreen() {
  const { user } = useAuth();

  if (user.role === 'provider') {
    return <HomeProvider />;
  }

  return <HomeClient />;
}

