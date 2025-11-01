import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { Text } from 'react-native-paper';
import ThemedHeader from '@components/ui/elements/ThemedHeader';
import { useAuth } from '@core/hooks/useAuth';
import EditProfile from '@components/ui/screens/EditProfile';
import ThemedButton from '@components/ui/buttons/ThemedButton';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import EditBusiness from '@components/ui/screens/EditBusiness';
import { useSnackbar } from '@core/hooks/useSnackbar';

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
  select: {
    borderRadius: 10,
    elevation: 3,
    padding: 6,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  }
});

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const [activeTab, setActiveTab] = useState<'profile' | 'business'>('profile');
  const { user } = useAuth();
  const snackbar = useSnackbar();

  const onProfileSaved = useCallback(() => {
    console.log('Profile saved');
    snackbar.show({ message: 'Personal details updated successfully' });
  }, []);

  const onBusinessSaved = () => {
    snackbar.show({ message: 'Business details updated successfully' });
  };

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

      {user.role === 'provider' && (
        <View style={{
          flexDirection: 'row',
          gap: 16,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 20,
        }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              setActiveTab('profile');
            }}>
            <View style={{
              ...styles.select,
              backgroundColor: activeTab === 'profile' ? colors.primary : colors.surface,
            }}>
              <Text style={{ color: activeTab === 'profile' ? colors.onPrimary : colors.onSurface }}>Personal Details</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              setActiveTab('business');
            }}>
            <View style={{
              ...styles.select,
              backgroundColor: activeTab === 'business' ? colors.primary : colors.surface,
            }}>
              <Text style={{ color: activeTab === 'business' ? colors.onPrimary : colors.onSurface }}>Business Details</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {activeTab === 'profile' && (
        <EditProfile
          isEdit={true}
          onSave={onProfileSaved}
          buttonText={t('general.save')}
          style={styles.innerContentContainer} />
      )}

      {user.role === 'provider' && activeTab === 'business' && (
        <EditBusiness
          isEdit={true}
          onSave={onBusinessSaved}
          buttonText={t('general.save')}
          style={styles.innerContentContainer} />
      )}
    </ScrollView>
  );
}
