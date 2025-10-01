import { View } from 'react-native';
import React, { FC } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  children?: React.ReactNode;
}

const ColoredStatusBar: FC<Props> = ({ children }) => {
  const { colors } = useAppTheme();

  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary]}
      style={{ flex: 1 }}>
      <StatusBar style={'light'} />
      <SafeAreaView style={{ flex: 1 }}>
        {children}
      </SafeAreaView>
    </LinearGradient>
  )
}

export default ColoredStatusBar;
