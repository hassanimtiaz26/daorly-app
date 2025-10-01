import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { FC, PropsWithChildren } from 'react';
import { ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';

const createStyles = (colors: MD3Colors) => StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.primary,
    padding: 20,
    borderBottomEndRadius: 16,
    borderBottomStartRadius: 16,
  },
})

const ThemedHeader: FC<ViewProps & PropsWithChildren> = ({ style, children, ...props }) => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  );
}

export default ThemedHeader;
