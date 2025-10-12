import { MD3LightTheme, MD3Theme } from 'react-native-paper';

type ThemeConfig = MD3Theme & {};

export const BaseTheme: ThemeConfig = {
  ...MD3LightTheme,
  roundness: 12,
  colors: {
    // Primary color: #4174BA
    primary: 'rgb(15, 179, 167)',
    onPrimary: 'rgb(255, 255, 255)',
    // primaryContainer: 'rgb(112, 247, 233)',
    // onPrimaryContainer: 'rgb(0, 32, 29)',
    primaryContainer: 'rgb(204, 251, 241)',
    onPrimaryContainer: 'rgb(19, 78, 74)',
    // secondary: 'rgb(15, 179, 167)',
    // onSecondary: 'rgb(255, 255, 255)',
    // secondaryContainer: 'rgb(112, 247, 233)',
    // onSecondaryContainer: 'rgb(0, 32, 29)',

    // Secondary color: #0FB3A7
    secondary: 'rgb(65, 116, 186)',
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: 'rgb(216, 226, 255)',
    onSecondaryContainer: 'rgb(0, 28, 56)',
    // primary: 'rgb(65, 116, 186)',
    // onPrimary: 'rgb(255, 255, 255)',
    // primaryContainer: 'rgb(216, 226, 255)',
    // onPrimaryContainer: 'rgb(0, 28, 56)',

    // A complementary tertiary color
    tertiary: 'rgb(125, 82, 96)',
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(255, 216, 226)',
    onTertiaryContainer: 'rgb(49, 17, 29)',

    // Standard error colors
    error: 'rgb(179, 38, 29)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(249, 222, 220)',
    onErrorContainer: 'rgb(65, 14, 11)',

    // Background and surface colors
    background: 'rgb(245, 247, 249)',
    onBackground: 'rgb(27, 27, 30)',
    surface: 'rgb(255, 255, 255)',
    onSurface: 'rgb(27, 27, 30)',
    surfaceVariant: 'rgb(225, 227, 232)',
    onSurfaceVariant: 'rgb(68, 71, 75)',

    // Outline and shadow
    outline: 'rgb(116, 119, 123)',
    outlineVariant: 'rgb(196, 198, 203)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',

    // Inverse colors for dark elements on light backgrounds
    inverseSurface: 'rgb(47, 48, 51)',
    inverseOnSurface: 'rgb(241, 240, 244)',
    inversePrimary: 'rgb(174, 198, 255)',

    // Elevation levels (tints of primary on surface)
    elevation: {
      level0: 'transparent',
      level1: 'rgb(248, 248, 251)', // 5% overlay
      level2: 'rgb(242, 244, 250)', // 8% overlay
      level3: 'rgb(237, 240, 249)', // 11% overlay
      level4: 'rgb(235, 239, 248)', // 12% overlay
      level5: 'rgb(231, 236, 247)', // 14% overlay
    },

    // Disabled states
    surfaceDisabled: 'rgba(27, 27, 30, 0.12)',
    onSurfaceDisabled: 'rgba(27, 27, 30, 0.38)',
    backdrop: 'rgba(46, 48, 52, 0.4)',
  },
};

export type AppTheme = typeof BaseTheme;
