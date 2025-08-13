import { StyleSheet, View } from 'react-native';
import { BaseTheme } from '@core/config/theme.config';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
