import { StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { Image } from 'expo-image';
import ThemedTextInput from '@components/ui/ThemedTextInput';
import ThemedButton from '@components/ui/ThemedButton';
import { Link } from 'expo-router';

const createStyles = (colors: MD3Colors) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
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
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 16,
    gap: 24,
    marginTop: 'auto',
  },
});

export default function RegisterScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Image
          style={styles.logo}
          contentFit={'contain'}
          source={require('@/assets/images/daorly-logo.png')} />
        <Text style={styles.title} variant={'titleMedium'}>Welcome to Daorly!</Text>

        <View style={styles.textInputContainer}>
          <ThemedTextInput
            mode={'outlined'}
            label={'Phone Number'}
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
          mode={'contained'}
          buttonStyle={'secondary'}>Continue</ThemedButton>

        <Link href={'../'}>
          <Text>Already have an account? <Text style={{ color: colors.secondary }}>Sign In</Text></Text>
        </Link>
      </View>
    </SafeAreaView>
  )
}
