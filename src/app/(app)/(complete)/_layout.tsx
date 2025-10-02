import { Stack } from 'expo-router';
import ColoredStatusBar from '@components/ui/ColoredStatusBar';
import { View } from 'react-native';

export default function CompleteLayout() {
  /*const renderStack = useCallback(() => {
    console.log('user', user);
    switch (user.role) {
      case 'client':
        return (
          <Stack
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="client/(tabs)" />
            <Stack.Screen name="client/services" />
            <Stack.Screen name="common/notifications" />
          </Stack>
        );
      case 'provider':
        return (
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="provider/(tabs)" />
            <Stack.Screen name="common/notifications" />
          </Stack>
        );
    }
  }, [user.role]);*/

  return (
    <ColoredStatusBar>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="business" />
          <Stack.Screen name="profile" />
        </Stack>
      </View>
    </ColoredStatusBar>
  );
}
