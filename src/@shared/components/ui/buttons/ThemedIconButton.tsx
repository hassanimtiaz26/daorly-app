import { FAB, FABProps } from 'react-native-paper';
import Feather from '@expo/vector-icons/Feather';
import { FC } from 'react';

type Props = FABProps & {
  iconName: any;
}

const ThemedCloseButton: FC<Props> = ({ iconName, ...props }) => {
  return (
    <FAB

      icon={({ size, color }) => <Feather name={iconName} size={size} color={color} />}
      {...props} />
  )
}

export default ThemedCloseButton;
