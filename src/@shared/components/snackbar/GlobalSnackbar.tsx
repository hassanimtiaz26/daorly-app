import { Snackbar } from 'react-native-paper';
import { useSnackbar } from '@core/hooks/useSnackbar';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';

const GlobalSnackbar = () => {
  const { isVisible, message, icon, duration, onDismiss, hide } = useSnackbar();

  const defaultIcon = ({ size, color }) => (
    <MaterialIcon
      name={'close'}
      size={size}
      color={color} />
  );

  return (
    <Snackbar
      visible={isVisible}
      onDismiss={onDismiss || hide}
      duration={duration}
      icon={icon || defaultIcon}
      onIconPress={onDismiss || hide}
    >
      {message}
    </Snackbar>
  );
};

export default GlobalSnackbar;
