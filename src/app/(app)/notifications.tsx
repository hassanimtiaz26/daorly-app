import { List, Text } from 'react-native-paper';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { useTranslation } from 'react-i18next';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import ThemedHeader from '@/src/@shared/components/ui/elements/ThemedHeader';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';

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
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
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

const NotificationScreen = () => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { canGoBack, back } = useRouter();

  return (
    <ScrollView
      style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
      <ThemedHeader>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, }}>
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

          <Text variant={'titleLarge'} style={styles.title}>Notifications</Text>
        </View>

      </ThemedHeader>
      <View>
        <List.Item
          title="First Item"
          description="Item description"
          style={{
            backgroundColor: colors.surface,
            elevation: 2,
          }}
        />
        <List.Item
          title="Second Item"
          description="Item description"
          style={{
            backgroundColor: colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: colors.outline
          }}
        />
        <List.Item
          title="Third Item"
          description="Item description"
          style={{
            backgroundColor: colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: colors.outline
          }}
        />
      </View>
    </ScrollView>
  )
}

export default NotificationScreen;
