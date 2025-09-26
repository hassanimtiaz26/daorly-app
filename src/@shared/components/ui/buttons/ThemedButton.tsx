import { FC } from 'react';
import { Button, ButtonProps } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useAppTheme } from '@core/hooks/useAppTheme';

type AdditionalButtonProps = {
  buttonStyle?: 'primary' | 'secondary' | 'tertiary';
}

const ThemedButton: FC<ButtonProps & AdditionalButtonProps> = ({ children, buttonStyle, style, ...props}) => {
  const { colors } = useAppTheme();

  return (
    <Button
      mode={'contained'}
      style={[styles.button, style]}
      buttonColor={buttonStyle ? colors[buttonStyle] : colors.primary}
      labelStyle={styles.buttonLabel}
      {...props}>
      {children}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    borderRadius: 14,
  },
  buttonLabel: {
    fontSize: 16,
    letterSpacing: 2,
    paddingVertical: 6,
  },
});

export default ThemedButton;
