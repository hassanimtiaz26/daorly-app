import Feather from '@expo/vector-icons/Feather';
import { Button, FAB } from 'react-native-paper';
import { useRouter } from 'expo-router';

const ThemedBackButton = () => {
  const { back, canGoBack } = useRouter();
  return (
    <FAB
      onPress={() => canGoBack() && back()}
      variant={'surface'}
      size={'small'}
      icon={({ size, color }) => <Feather name='arrow-left' size={size} color={color} />}></FAB>
  )
}

export default ThemedBackButton;
