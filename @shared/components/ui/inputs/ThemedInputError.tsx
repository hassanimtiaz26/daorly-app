import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { Text } from 'react-native-paper';
import { FC } from 'react';

type Props = {
  text?: any;
  style?: StyleProp<TextStyle>;
}

const createStyles = (colors: MD3Colors) =>
  StyleSheet.create({
    error: {
      color: colors.error,
      fontSize: 12,
      marginTop: 6,
    },
  });

const InputError: FC<Props> = ({ text, style }) => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <Text style={[styles.error, style]}>
      {text}
    </Text>
  );
};

export default InputError;
