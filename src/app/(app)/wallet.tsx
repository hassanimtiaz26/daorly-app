import ThemedHeader from '@components/ui/elements/ThemedHeader';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { useRouter } from 'expo-router';
import { Text } from 'react-native-paper';
import { useAuth } from '@core/hooks/useAuth';

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
    backgroundColor: colors.surface,
  },

  title: {
    color: colors.onPrimary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

const WalletScreen = () => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { canGoBack, back } = useRouter();
  const { user } = useAuth();

  return (
    <View
      style={styles.container}>
      <ThemedHeader>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24, }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              if (canGoBack()) {
                back();
              }
            }}>
            <Feather
              name={'arrow-left-circle'} size={24} color={colors.onPrimary} />
          </TouchableOpacity>

          <Text variant={'titleMedium'} style={styles.title}>Hello {user.profile.firstName}!</Text>
        </View>
      </ThemedHeader>
    </View>
  )
};

export default WalletScreen;
