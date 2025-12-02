import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import ThemedHeader from '@components/ui/elements/ThemedHeader';
import Feather from '@expo/vector-icons/Feather';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { useState } from 'react';
import ChangePassword from '@components/ui/screens/ChangePassword';

const createStyles = (colors: MD3Colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContentContainer: {
    // gap: 12,
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
  select: {
    borderRadius: 10,
    elevation: 3,
    padding: 6,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
});

type TabItems = 'changePassword';

const SecurityScreen = () => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const { canGoBack, back, replace } = useRouter();
  const [activeTab, setActiveTab] = useState<TabItems>('changePassword');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'changePassword':
        return <ChangePassword />;
    }
  }

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

          <Text variant={'titleLarge'} style={styles.title}>Security</Text>
        </View>

      </ThemedHeader>

      <View style={{
        flexDirection: 'row',
        gap: 16,
        paddingHorizontal: 16,
        alignItems: 'center',
        // justifyContent: 'center',
        paddingTop: 20,
      }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setActiveTab('changePassword');
          }}>
          <View style={{
            ...styles.select,
            backgroundColor: activeTab === 'changePassword' ? colors.primary : colors.surface,
          }}>
            <Text style={{ color: activeTab === 'changePassword' ? colors.onPrimary : colors.onSurface }}>Change Password</Text>
          </View>
        </TouchableOpacity>
      </View>

      {renderActiveTab()}
    </ScrollView>
  );
}

export default SecurityScreen;
