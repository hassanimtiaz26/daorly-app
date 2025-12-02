import { FC } from 'react';
import { Button, ButtonProps } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { useAppTheme } from '@core/hooks/useAppTheme';

type AdditionalButtonProps = {
  buttonStyle?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'surface';
  paddingVertical?: number;
}

const ThemedButton: FC<ButtonProps & AdditionalButtonProps> = ({ children, buttonStyle, style, labelStyle, mode = 'contained', paddingVertical = 6, ...props}) => {
  const { colors } = useAppTheme();

  const buttonColors = {
    contained: {
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
        surface: colors.error,
        onSurface: colors.onError,
      },
      surface: {
        surface: colors.surfaceVariant,
        onSurface: colors.onSurfaceVariant,
      },
    },
    outlined: {
      primary: {
        surface: colors.surface,
        onSurface: colors.primary,
        outline: colors.primary,
      },
      secondary: {
        surface: colors.surface,
        onSurface: colors.secondary,
        outline: colors.secondary,
      },
      tertiary: {
        surface: colors.surface,
        onSurface: colors.tertiary,
        outline: colors.tertiary,
      },
      error: {
        surface: colors.surface,
        onSurface: colors.error,
        outline: colors.error,
      },
      surface: {
        surface: colors.surface,
        onSurface: colors.surfaceVariant,
        outline: colors.surfaceVariant,
      },
    },
    elevated: {
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
        surface: colors.error,
        onSurface: colors.onError,
      },
      surface: {
        surface: colors.surfaceVariant,
        onSurface: colors.onSurfaceVariant,
      },
    },
    'contained-tonal': {
      primary: {
        surface: colors.primaryContainer,
        onSurface: colors.onPrimaryContainer,
      },
      secondary: {
        surface: colors.secondaryContainer,
        onSurface: colors.onSecondaryContainer,
      },
      tertiary: {
        surface: colors.tertiaryContainer,
        onSurface: colors.onTertiaryContainer,
      },
      error: {
        surface: colors.errorContainer,
        onSurface: colors.onErrorContainer,
      },
      surface: {
        surface: colors.surfaceVariant,
        onSurface: colors.onSurfaceVariant,
      },
    },
  };

  return (
    <Button
      mode={mode}
      style={[
        styles.button,
        mode === 'outlined' && {
          borderColor: buttonStyle ? buttonColors[mode][buttonStyle].outline : colors.outline,
        },
        style,
      ]}
      buttonColor={buttonStyle ? buttonColors[mode][buttonStyle].surface : colors.primary}
      labelStyle={[
        styles.buttonLabel,
        {
          color: buttonStyle ? buttonColors[mode][buttonStyle].onSurface : colors.onPrimary,
          paddingVertical,
        },
        labelStyle,
      ]}
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
  },
});

export default ThemedButton;
