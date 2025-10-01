import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { Text } from 'react-native-paper';
import ThemedHeader from '@components/ui/elements/ThemedHeader';
import { useAuthStore } from '@shared/store/useAuthStore';
import EditProfile from '@components/ui/screens/EditProfile';
import ThemedButton from '@components/ui/buttons/ThemedButton';

const createStyles = (colors: MD3Colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContentContainer: {
    gap: 12,
  },
  innerContentContainer: {
    flex: 1,
    width: '100%',
    gap: 12,
  },
});

export default function ProfileScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { user } = useAuthStore();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContentContainer}>
      <ThemedHeader>
        <Text
          style={{ color: colors.onPrimary }}
          variant={'titleLarge'}>Hello{' '}
          <Text style={{ color: colors.onPrimary, fontWeight: 'bold' }}>{user.f_name}!</Text>
        </Text>
      </ThemedHeader>

      <View style={{ flex: 1, padding: 20, gap: 36}}>
        <EditProfile style={styles.innerContentContainer} />

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 36 }}>
          <ThemedButton onPress={() => {}}>Save</ThemedButton>
        </View>
      </View>
    </ScrollView>
  );
}
