import { ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Text, TextInput } from 'react-native-paper';
import ThemedTextInput from '@components/ui/inputs/ThemedTextInput';
import SyriaFlag from '@/assets/icons/syria.svg';
import ThemedButton from '@components/ui/buttons/ThemedButton';
import { Link } from 'expo-router';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { useTranslation } from 'react-i18next';
import Feather from '@expo/vector-icons/Feather';
import { useEffect, useState } from 'react';
import { TCity } from '@core/types/general.type';
import { useFetch } from '@core/hooks/useFetch';

const createStyles = (colors: MD3Colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    gap: 32,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingTop: 32,
  },
  title: {
    marginBottom: 8,
  },
  logo: {
    width: 200,
    height: 80,
  },
  textInputContainer: {
    width: '100%',
    paddingHorizontal: 16,
    gap: 16,
    marginTop: 24,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 16,
    gap: 16,
    marginTop: 'auto',
  },
});

const CompleteProfile = () => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();
  const [cities, setCities] = useState<TCity[]>([]);

  const { get, loading } = useFetch();

  useEffect(() => {
    get('cities')
      .subscribe({
        next: (response) => {
          console.log(response.data);
          setCities(response.data);
        },
        error: (error) => {
          console.error('Error fetching cities:', error);
        },
      })
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContentContainer}>
      <View style={styles.contentContainer}>
        <Image
          style={styles.logo}
          contentFit={'contain'}
          source={require('@/assets/images/daorly-logo.png')} />
        <Text style={styles.title} variant={'titleMedium'}>{t('general.welcome')}</Text>
        <Text variant={'titleLarge'}>{t('auth.register.title')}</Text>

        <View style={styles.textInputContainer}>
          <ThemedTextInput
            label={t('general.firstName')}
            right={<TextInput.Icon
              icon={({ size, color }) => (
                <Feather name="user" size={size} color={color} />
              )}
            />} />

          <ThemedTextInput
            label={t('general.lastName')}
            right={<TextInput.Icon
              icon={({ size, color }) => (
                <Feather name="user" size={size} color={color} />
              )}
            />} />

          <ThemedTextInput
            readOnly={true}
            label={t('general.country')}
            value={t('general.syria')}
            left={<TextInput.Icon
              size={34}
              icon={({ size, color }) => (
                <SyriaFlag width={size} height={size} fill={color} />
              )}
            />}
            right={<TextInput.Icon
              icon={({ size, color }) => (
                <Feather name="chevron-down" size={size} color={color} />
              )}
            />} />

        </View>
      </View>

      <View style={styles.buttonContainer}>
        <ThemedButton
          loading={loading}
          disabled={loading}
          onPress={() => {}}
          buttonStyle={'secondary'}>{t('general.continue')}</ThemedButton>
      </View>
    </ScrollView>
  );
}

export default CompleteProfile;
