import { Stack } from 'expo-router';
import ColoredStatusBar from '@components/ui/ColoredStatusBar';
import { View } from 'react-native';

export default function AppLayout() {
  return (
    <ColoredStatusBar>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <Stack initialRouteName={'index'} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(complete)" />
          <Stack.Screen name="contact" options={{ animation: 'fade_from_bottom' }} />
          <Stack.Screen name="page" options={{ animation: 'fade_from_bottom' }} />
          <Stack.Screen name="services" options={{ animation: 'fade_from_bottom' }} />
          <Stack.Screen name="order" options={{ animation: 'fade_from_bottom' }} />
          <Stack.Screen name="notifications" options={{ animation: 'fade_from_bottom' }} />
        </Stack>
      </View>
    </ColoredStatusBar>
  );
}
