import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { Text } from 'react-native-paper';
import ThemedHeader from '@components/ui/elements/ThemedHeader';
import { useAuth } from '@core/hooks/useAuth';
import EditProfile from '@components/ui/screens/EditProfile';
import ThemedButton from '@components/ui/buttons/ThemedButton';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const createStyles = (colors: MD3Colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContentContainer: {
    gap: 12,
  },
  innerContentContainer: {
    padding: 20,
    flex: 1,
    width: '100%',
    gap: 36,
  },
});

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { user } = useAuth();

  const onProfileSaved = useCallback(() => {
    console.log('Profile saved');
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContentContainer}>
      <ThemedHeader>
        <Text
          style={{ color: colors.onPrimary }}
          variant={'titleLarge'}>Hello{' '}
          <Text style={{ color: colors.onPrimary, fontWeight: 'bold' }}>{user.profile.firstName}!</Text>
        </Text>
      </ThemedHeader>

      <EditProfile
        fetchProfile={true}
        onSave={onProfileSaved}
        buttonText={t('general.save')}
        style={styles.innerContentContainer} />
    </ScrollView>
  );
}
