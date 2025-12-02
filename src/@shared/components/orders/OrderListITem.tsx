import { useAppTheme } from '@core/hooks/useAppTheme';
import { View } from 'react-native';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import { Text } from 'react-native-paper';

type OrderListItemProps = {
  text: string;
  icon: any;
}

const OrderListItem = ({ text, icon }) => {
  const { colors } = useAppTheme();

  return (
    <View style={{
      flexDirection: 'row',
      width: '100%',
      gap: 10,
      alignItems: 'center',
    }}>
      <MaterialIcon color={colors.onSecondaryContainer} style={{ flexGrow: 0 }} name={icon} size={18} />
      <Text style={{ color: colors.onSecondaryContainer, flex: 1 }}>{text}</Text>
    </View>
  )
}

export default OrderListItem;
