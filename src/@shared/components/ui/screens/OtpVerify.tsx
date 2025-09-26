import { FC, useCallback, useState } from 'react';
import { Image } from 'expo-image';
import { Text } from 'react-native-paper';
import { ScrollView, StyleSheet, View } from 'react-native';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@core/hooks/useAppTheme';
import ThemedOtpTextInput from '@components/ui/inputs/ThemedOtpTextInput';
import ThemedButton from '@components/ui/buttons/ThemedButton';
import { Link } from 'expo-router';

type OtpVerifyScreenProps = {
  callback?: () => void;
  title?: string;
};

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
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 24,
  },
  logo: {
    width: 200,
    height: 80,
  },
  textInputContainer: {
    width: '100%',
    paddingHorizontal: 16,
    gap: 16,
    // justifyContent: 'center',
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

const OtpVerifyScreen: FC<OtpVerifyScreenProps> = ({ callback, title }) => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const [otp, setOtp] = useState('');

  const handleOtpChange = useCallback((otp: string) => {
    setOtp(otp);
  }, []);

  const handleSubmit = useCallback(() => {
    console.log(otp);
  }, [otp]);

  const handleResend = useCallback(() => {
    console.log('Resend OTP');
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContentContainer}>
      <View style={styles.contentContainer}>
        <Image
          style={styles.logo}
          contentFit={'contain'}
          source={require('@/assets/images/daorly-logo.png')} />
        {title && <Text style={styles.title} variant={'titleLarge'}>{title}</Text>}

        <View style={styles.textInputContainer}>
          <Text style={{ textAlign: 'center' }} variant={'titleMedium'}>{t('auth.otp.title')}</Text>
          <Text style={{ textAlign: 'center', marginBottom: 14 }}>{t('auth.otp.message')}</Text>
          <ThemedOtpTextInput maxLength={4} onPinChange={handleOtpChange} />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <ThemedButton
          // disabled={!isValid || loading}
          // loading={loading}
          onPress={handleResend}
          mode={'contained'}>{t('general.resendCode')}</ThemedButton>

        <ThemedButton
          // disabled={!isValid || loading}
          // loading={loading}
          onPress={handleSubmit}
          mode={'contained'}
          buttonStyle={'secondary'}>{t('general.continue')}</ThemedButton>
      </View>
    </ScrollView>
  )
};

export default OtpVerifyScreen;
