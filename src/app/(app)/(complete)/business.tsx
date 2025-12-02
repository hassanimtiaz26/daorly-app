import { ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Text, TextInput } from 'react-native-paper';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { useFetch } from '@core/hooks/useFetch';
import { useAuth } from '@core/hooks/useAuth';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { TArea, TSelectValues } from '@core/types/general.type';
import ThemedSelect from '@components/ui/inputs/ThemedSelect';
import ThemedTextInput from '@components/ui/inputs/ThemedTextInput';
import Feather from '@expo/vector-icons/Feather';
import ThemedInputError from '@components/ui/inputs/ThemedInputError';
import ThemedButton from '@components/ui/buttons/ThemedButton';
import { ApiRoutes } from '@core/constants/ApiRoutes';
import { TService } from '@core/types/service.type';
import { useRouter } from 'expo-router';
import EditBusiness from '@components/ui/screens/EditBusiness';

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

const BusinessAccount = () => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { replace } = useRouter();

  const onSubmit = () => {
    replace('/(app)/(tabs)/home');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContentContainer}>
      <View style={styles.contentContainer}>
        <Image
          style={styles.logo}
          contentFit={'contain'}
          source={require('@/assets/images/daorly-logo.png')} />
        <Text variant={'titleLarge'}>{t('auth.register.title')}</Text>
        <Text style={styles.title} variant={'titleMedium'}>{t('auth.business.title')}</Text>

        <EditBusiness
          style={styles.innerContentContainer}
          onSave={onSubmit} />
      </View>

    </ScrollView>
  );
}

export default BusinessAccount;
