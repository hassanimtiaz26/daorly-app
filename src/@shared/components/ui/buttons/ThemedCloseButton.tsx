import Feather from '@expo/vector-icons/Feather';
import { Button, FAB } from 'react-native-paper';
import { useRouter } from 'expo-router';

const ThemedCloseButton = () => {
  const { back, canGoBack } = useRouter();
  return (
    <FAB
      onPress={() => canGoBack() && back()}
      variant={'surface'}
      size={'small'}
      icon={({ size, color }) => <Feather name='x' size={size} color={color} />}></FAB>
  )
}

export default ThemedCloseButton;
