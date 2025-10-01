import { List, Text } from 'react-native-paper';
import { View } from 'react-native';
import { useAppTheme } from '@core/hooks/useAppTheme';

const NotificationScreen = () => {
  const { colors } = useAppTheme();

  return (
    <View>
      <View style={{ backgroundColor: colors.primary, padding: 20 }}>
        <Text style={{ color: colors.onPrimary }} variant={'titleLarge'}>Notifications</Text>
      </View>
      <List.Item
        title="First Item"
        description="Item description"
        style={{
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.outline
        }}
      />
      <List.Item
        title="Second Item"
        description="Item description"
        style={{
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.outline
        }}
      />
      <List.Item
        title="Third Item"
        description="Item description"
        style={{
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.outline
        }}
      />
    </View>
  )
}

export default NotificationScreen;
