import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { Image } from 'expo-image';
import ThemedTextInput from '@components/ui/inputs/ThemedTextInput';
import ThemedButton from '@components/ui/buttons/ThemedButton';
import { Link, useRouter } from 'expo-router';
import SyriaFlag from '@/assets/icons/syria.svg';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { syrianPhoneNumberRegex } from '@core/utils/helpers.util';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ThemedInputPassword from '@components/ui/inputs/ThemedInputPassword';
import OtpVerifyScreen from '@components/ui/screens/OtpVerify';
import { useCallback, useEffect, useState } from 'react';
import ThemedInputError from '@components/ui/inputs/ThemedInputError';
import { useFetch } from '@core/hooks/useFetch';
import * as Device from 'expo-device';
import { Config } from '@core/constants/Config';
import { useAuth } from '@core/hooks/useAuth';
import { useFirebase } from '@core/hooks/useFirebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDialog } from '@core/hooks/useDialog';

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

export default function RegisterScreen() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const { navigate } = useRouter();
  const styles = createStyles(colors);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const { post, loading, error } = useFetch();
  const { setUser } = useAuth();
  const { firebaseToken } = useFirebase();

  const registerSchema = z.object({
    phoneNumber: z.string().trim().regex(syrianPhoneNumberRegex, t('errors.auth.invalidPhoneNumber')),
    password: z.string().trim().min(8, t('errors.auth.passwordMinLength')),
    confirmPassword: z.string().trim(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('errors.auth.passwordsDoNotMatch'),
    path: ['confirmPassword'],
  })
  type RegisterFormType = z.infer<typeof registerSchema>;
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm<RegisterFormType>({
    resolver: zodResolver(registerSchema),
  });

  const { login } = useAuth();
  const { showDialog } = useDialog();

  useEffect(() => {
    if (error) {
      showDialog({
        variant: 'error',
        message: error,
      })
    }
  }, [error]);

  const handleTextChange = useCallback((inputControl: any) => {
    trigger(inputControl).then();
  }, [trigger]);

  const onSubmit = useCallback((data: RegisterFormType) => {
    if (!isValid) return;

    const number = '+963' + data.phoneNumber.replace(/^0/, '');
    setPhoneNumber(number);

    const formData = {
      mobile: number,
      password: data.password,
      as_provider: false,
      device_token: firebaseToken, // Firebase token
      operating_system: Device.osName,
      version: Device.osVersion,
      brand: Device.brand,
      type: Device.deviceType?.toString(),
      model: Device.modelName,
      app_version: Config.appVersion,
    }

    console.log(JSON.stringify(formData, null, 2));

    post('auth/register', formData)
      .subscribe({
        next: (response) => {
          console.log('Register Response', response);
          if (response && 'data' in response) {
            setShowOtpScreen(true);
            setUser(response.data.user);
          }
        }
      });
  }, [isValid, post, firebaseToken]);

  const onOtpSubmit = useCallback((otp: string) => {
    const formData = {
      mobile: phoneNumber,
      code: otp,
      device_token: firebaseToken,
      type: 'account_confirmation'
    }
    post('auth/confirm-code', formData)
      .subscribe({
        next: async (response) => {
          if (response && 'data' in response) {
            const data = response.data;
            if ('user' in data && 'token' in data) {
              await AsyncStorage.setItem(Config.tokenStoreKey, data.token);
              login(data.user);
              // navigate('/(app)/(tabs)/home');
              navigate('/(app)/(complete)/profile');
            }
          }
        }
      })
  }, [navigate, post, phoneNumber, firebaseToken]);

  if (showOtpScreen) {
    return <OtpVerifyScreen
      type={'accountConfirmation'}
      onSubmit={onOtpSubmit}
      title={t('auth.register.title')}
      loading={loading} />;
  }

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
            <Controller
              control={control}
              name={'phoneNumber'}
              render={({
                         field: { onChange, onBlur, value },
                         fieldState: { error },
                       }) => (
                <View>
                  <ThemedTextInput
                    keyboardType={'numeric'}
                    disabled={loading}
                    onBlur={onBlur}
                    onChangeText={(e) => {
                      onChange(e);
                      handleTextChange('phoneNumber');
                    }}
                    value={value}
                    error={!!error}
                    label={t('general.phoneNumber')}
                    left={<TextInput.Icon
                      size={34}
                      icon={({ size, color }) => (
                        <SyriaFlag width={size} height={size} fill={color} />
                      )}
                    />}
                    right={<TextInput.Icon size={18} icon={'phone'} />} />
                  {errors.phoneNumber && (
                    <ThemedInputError text={errors.phoneNumber?.message} />
                  )}
                </View>
                )} />

            <Controller
              control={control}
              name={'password'}
              render={({
                         field: { onChange, onBlur, value },
                         fieldState: { error },
                       }) => (
                <View>
                  <ThemedInputPassword
                    disabled={loading}
                    onBlur={onBlur}
                    onChangeText={(e) => {
                      onChange(e);
                      handleTextChange('password');
                    }}
                    value={value}
                    error={!!error}
                    label={t('general.password')} />
                  {errors.password && (
                    <ThemedInputError text={errors.password?.message} />
                  )}
                </View>
              )} />

            <Controller
              control={control}
              name={'confirmPassword'}
              render={({
                         field: { onChange, onBlur, value },
                         fieldState: { error },
                       }) => (
                <View>
                  <ThemedInputPassword
                    disabled={loading}
                    onBlur={onBlur}
                    onChangeText={(e) => {
                      onChange(e);
                      handleTextChange('confirmPassword');
                    }}
                    value={value}
                    error={!!error}
                    label={t('general.confirmPassword')} />
                  {errors.confirmPassword && (
                    <ThemedInputError text={errors.confirmPassword?.message} />
                  )}
                </View>
              )} />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <ThemedButton
            disabled={!isValid || loading}
            loading={loading}
            onPress={handleSubmit(onSubmit)}
            buttonStyle={'secondary'}>{t('general.continue')}</ThemedButton>

          {/*<ThemedButton
            onPress={() => {}}
            mode={'contained'}>{t('general.continueAsBusiness')}</ThemedButton>*/}

          <Link href={'../'}>
            <Text>{t('auth.register.haveAccount')} <Text style={{ color: colors.secondary }}>{t('general.signIn')}</Text></Text>
          </Link>
        </View>
      </ScrollView>
  )
}
