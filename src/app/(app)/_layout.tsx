import { Stack } from 'expo-router';
import ColoredStatusBar from '@components/ui/ColoredStatusBar';
import { View } from 'react-native';

export default function AppLayout() {
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
        <Stack initialRouteName={'(tabs)'} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="services" options={{ animation: 'fade_from_bottom' }} />
          <Stack.Screen name="notifications" options={{ animation: 'fade_from_bottom' }} />
        </Stack>
      </View>
    </ColoredStatusBar>
  );
}
