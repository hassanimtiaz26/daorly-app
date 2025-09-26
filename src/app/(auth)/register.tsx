import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { Image } from 'expo-image';
import ThemedTextInput from '@components/ui/inputs/ThemedTextInput';
import ThemedButton from '@components/ui/buttons/ThemedButton';
import { Link } from 'expo-router';
import SyriaFlag from '@/assets/icons/syria.svg';
import { useTranslation } from 'react-i18next';

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
  const styles = createStyles(colors);

  return (
    // <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContentContainer}>
        <View style={styles.contentContainer}>
          <Image
            style={styles.logo}
            contentFit={'contain'}
            source={require('@/assets/images/daorly-logo.png')} />
          <Text style={styles.title} variant={'titleMedium'}>{t('general.welcome')}</Text>

          <View style={styles.textInputContainer}>
            <ThemedTextInput
              label={t('general.phoneNumber')}
              left={<TextInput.Icon
                size={34}
                icon={({ size, color }) => (
                  <SyriaFlag width={size} height={size} fill={color} />
                )}
              />}
              right={<TextInput.Icon size={18} icon={'phone'} />} />

            <ThemedTextInput
              mode={'outlined'}
              secureTextEntry={true}
              autoCapitalize="none"
              label={'Password'}
              right={<TextInput.Icon size={18} icon={'eye'} />} />

            <ThemedTextInput
              mode={'outlined'}
              secureTextEntry={true}
              autoCapitalize="none"
              label={'Confirm Password'}
              right={<TextInput.Icon size={18} icon={'eye'} />} />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <ThemedButton
            onPress={() => {}}
            buttonStyle={'secondary'}>{t('general.continue')}</ThemedButton>

          <ThemedButton
            onPress={() => {}}
            mode={'contained'}>{t('general.continueAsBusiness')}</ThemedButton>

          <Link href={'../'}>
            <Text>{t('auth.register.haveAccount')} <Text style={{ color: colors.secondary }}>{t('general.signIn')}</Text></Text>
          </Link>
        </View>
      </ScrollView>
    // </SafeAreaView>
  )
}
