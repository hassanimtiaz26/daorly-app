import { Text } from 'react-native-paper';
import { Redirect } from 'expo-router';

export default function AppIndexScreen() {
  return (
    <Redirect href={'/(app)/(tabs)/home'} />
  )
};
