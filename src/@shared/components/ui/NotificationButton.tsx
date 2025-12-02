import Feather from '@expo/vector-icons/Feather';
import { Badge } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { useAuth } from '@core/hooks/useAuth';

const NotificationButton = () => {
  const { colors } = useAppTheme();
  const { navigate } = useRouter();
  const { user } = useAuth();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        navigate('/(app)/notifications')
      }}
      style={{ position: 'relative' }}>
      <Feather
        name={'bell'} size={24} color={colors.onPrimary} />
      {'unreadNotificationCount' in user && user.unreadNotificationCount > 0 && (
        <Badge style={{ position: 'absolute', top: -10, right: -10 }}>{user.unreadNotificationCount}</Badge>
      )}
    </TouchableOpacity>
  )
};

export default NotificationButton;
