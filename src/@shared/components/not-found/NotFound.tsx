import { Text } from 'react-native-paper';
import { FC } from 'react';

type Props = {
  message: string;
}

const NotFound: FC<Props> = ({ message }) => {
  return (
    <Text style={{ textAlign: 'center' }}>{message}</Text>
  );
};

export default NotFound;
