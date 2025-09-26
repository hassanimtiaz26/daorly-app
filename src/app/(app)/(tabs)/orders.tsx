import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { ScrollView, StyleSheet } from 'react-native';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { Text } from 'react-native-paper';

const createStyles = (colors: MD3Colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default function OrderScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text variant={'titleSmall'}>Order Screen</Text>
    </ScrollView>
  );
}
