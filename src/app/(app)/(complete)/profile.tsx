import { ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Text, TextInput } from 'react-native-paper';
import ThemedTextInput from '@components/ui/inputs/ThemedTextInput';
import SyriaFlag from '@/assets/icons/syria.svg';
import ThemedButton from '@components/ui/buttons/ThemedButton';
import { Link, useRouter } from 'expo-router';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { useTranslation } from 'react-i18next';
import Feather from '@expo/vector-icons/Feather';
import { useCallback, useEffect, useState } from 'react';
import { TCity } from '@core/types/general.type';
import { useFetch } from '@core/hooks/useFetch';
import EditProfile from '@components/ui/screens/EditProfile';
import { useAuth } from '@core/hooks/useAuth';
import { ApiRoutes } from '@core/constants/ApiRoutes';

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
    marginTop: 8,
  },
  logo: {
    width: 200,
    height: 80,
  },
  innerContentContainer: {
    padding: 20,
    flex: 1,
    width: '100%',
    gap: 36,
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
  const { get } = useFetch();
  const { setUser } = useAuth();
  const { replace } = useRouter();


  const onSubmit = useCallback(() => {
    get(ApiRoutes.user.index).subscribe({
      next: (response) => {
        if (response && 'data' in response) {
          if ('user' in response.data) {
            const user = response.data.user;
            setUser(user);

            if (user.role === 'provider') {
              replace('/(app)/(complete)/business');
            } else {
              replace('/(app)/(tabs)/home');
            }

          }
        }
      },
    });
  }, [get, setUser, replace]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContentContainer}>
      <View style={styles.contentContainer}>
        <Image
          style={styles.logo}
          contentFit={'contain'}
          source={require('@/assets/images/daorly-logo.png')} />
        <Text variant={'titleLarge'}>{t('auth.register.title')}</Text>
        <Text style={styles.title} variant={'titleMedium'}>{t('auth.profile.title')}</Text>
      </View>

      <EditProfile
        style={styles.innerContentContainer}
        onSave={onSubmit} />
    </ScrollView>
  );
}

export default CompleteProfile;
