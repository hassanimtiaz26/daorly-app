import { ActivityIndicator } from 'react-native-paper';
import { View } from 'react-native';
import { useAppTheme } from '@core/hooks/useAppTheme';

const ElementLoader = () => {
  const { colors } = useAppTheme();

  return (
    <View style={{
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      backgroundColor: colors.surface,
      opacity: 0.7,
      zIndex: 999,
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <ActivityIndicator />
    </View>
  )
};

export default ElementLoader;
