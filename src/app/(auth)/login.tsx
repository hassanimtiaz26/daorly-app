import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import ThemedButton from '@components/ui/buttons/ThemedButton';
import ThemedTextInput from '@components/ui/inputs/ThemedTextInput';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { Link, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ThemedInputError from '@components/ui/inputs/ThemedInputError';
import { useCallback, useEffect, useState } from 'react';
import SyriaFlag from '@/assets/icons/syria.svg';
import ThemedInputPassword from '@components/ui/inputs/ThemedInputPassword';
import { useFetch } from '@core/hooks/useFetch';
import * as Device from 'expo-device';
import { Config } from '@core/constants/Config';
import OtpVerifyScreen from '@components/ui/screens/OtpVerify';
import { syrianPhoneNumberRegex } from '@core/utils/helpers.util';
import { useFirebase } from '@core/hooks/useFirebase';
import { useAuth } from '@core/hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TUser } from '@core/types/user.type';
import { useDialog } from '@core/hooks/useDialog';
import { ApiRoutes } from '@core/constants/ApiRoutes';
import { TLoginParams } from '@core/types/auth.type';
import { TResponse } from '@core/types/response.types';

const createStyles = (colors: MD3Colors) => StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
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
  },
  title: {
    fontWeight: 'bold',
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

export default function LoginScreen() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const { post, error, loading, statusCode } = useFetch();
  const { firebaseToken } = useFirebase();
  const { navigate } = useRouter();

  const { login } = useAuth();
  const { showDialog } = useDialog();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOtpScreen, setShowOtpScreen] = useState(false);

  const loginSchema = z.object({
    phoneNumber: z.string().trim().regex(syrianPhoneNumberRegex, t('errors.phone.invalid')),
    password: z.string().trim(),
  });
  type LoginFormType = z.infer<typeof loginSchema>;
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    console.log(error);
    if (error) {
      showDialog({
        variant: 'error',
        message: error,
      })
    }
  }, [error]);

  // useEffect(() => {
  //   console.log('useEffect:statusCode', statusCode);
  //   if (statusCode === 400) {
  //     setShowOtpScreen(true);
  //   }
  // }, [statusCode]);

  const handleTextChange = useCallback((inputControl: any) => {
    trigger(inputControl).then();
  }, [trigger]);

  const handleLogin = useCallback(async (data: any) => {
    console.log('data', JSON.stringify(data, null, 2));
    const user: TUser = data.user;

    if ('action' in data && data.action === 'CONFIRMATION_REQUIRED') {
      console.log('Confirmation required, showing OTP screen');
      setShowOtpScreen(true);
      return;
    }

    await AsyncStorage.setItem(Config.tokenStoreKey, data.token);
    login(data.user);
    if (!user.profileCompletedAt) {
      navigate('/(app)/(complete)/profile');
    } else if (user.role === 'provider' && !user.businessAccountCompletedAt) {
      navigate('/(app)/(complete)/business');
    } else {
      navigate('/(app)/(tabs)/home');
    }
  }, [navigate, login, setShowOtpScreen]);

  const onSubmit = useCallback((data: LoginFormType) => {
    if (!isValid) return;

    const number = '+963' + data.phoneNumber.replace(/^0/, '');
    setPhoneNumber(number);

    const formData: TLoginParams = {
      phoneNumber: number,
      password: data.password,
      firebaseToken,
    }

    console.log(JSON.stringify(formData, null, 2));

    post(ApiRoutes.auth.login, formData)
      .subscribe({
        next: async (response) => {
          console.log('Login Response', response);
          console.log('next:statusCode', statusCode);
          if (response && 'data' in response) {
            await handleLogin(response.data);
          }
        },
        error: (err) => {
          console.log('err:statusCode', statusCode);
          console.log('Login Error', err);
        }
      });
  }, [isValid, handleLogin, post, firebaseToken, statusCode]);

  const onOtpSubmit = useCallback((otp: string) => {
    const formData = {
      phoneNumber: phoneNumber,
      code: otp,
      // firebaseToken,
      type: 'confirmation'
    }
    post(ApiRoutes.auth.confirmCode, formData)
      .subscribe({
        next: async (response) => {
          if (response && 'data' in response) {
            await handleLogin(response.data);
          }
        }
      })
  }, [handleLogin, post, phoneNumber, firebaseToken]);

  if (showOtpScreen) {
    return (
      <OtpVerifyScreen
        type={'accountConfirmation'}
        title={t('auth.login.otpTitle')}
        loading={loading}
        onSubmit={onOtpSubmit} />
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContentContainer}>
      <View style={styles.contentContainer}>
        <Image
          style={styles.logo}
          contentFit={'contain'}
          source={require('@/assets/images/daorly-logo.png')} />
        <Text variant={'titleMedium'}>{t('general.welcome')}</Text>
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

        </View>
      </View>

      <View style={styles.buttonContainer}>
        <ThemedButton
          disabled={!isValid || loading}
          loading={loading}
          onPress={handleSubmit(onSubmit)}
          mode={'contained'}
          buttonStyle={'primary'}>{t('general.continue')}</ThemedButton>

        <Link href={'/(auth)/register'}>
          <Text>{t('auth.login.haveAccount')} <Text style={{ color: colors.primary }}>{t('general.signUp')}</Text></Text>
        </Link>
      </View>
    </ScrollView>
  )
}

