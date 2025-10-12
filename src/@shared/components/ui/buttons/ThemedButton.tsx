import { FC } from 'react';
import { Button, ButtonProps } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useAppTheme } from '@core/hooks/useAppTheme';

type AdditionalButtonProps = {
  buttonStyle?: 'primary' | 'secondary' | 'tertiary' | 'error';
}

const ThemedButton: FC<ButtonProps & AdditionalButtonProps> = ({ children, buttonStyle, style, ...props}) => {
  const { colors } = useAppTheme();

  const buttonColors = {
    primary: {
      surface: colors.primary,
      onSurface: colors.onPrimary,
    },
    secondary: {
      surface: colors.secondary,
      onSurface: colors.onSecondary,
    },
    tertiary: {
      surface: colors.tertiary,
      onSurface: colors.onTertiary,
    },
    error: {
      surface: colors.errorContainer,
      onSurface: colors.onErrorContainer,
    },
  };

  return (
    <Button
      mode={'contained'}
      style={[styles.button, style]}
      buttonColor={buttonStyle ? buttonColors[buttonStyle].surface : colors.primary}
      labelStyle={[styles.buttonLabel, { color: buttonStyle ? buttonColors[buttonStyle].onSurface : colors.onPrimary }]}
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
