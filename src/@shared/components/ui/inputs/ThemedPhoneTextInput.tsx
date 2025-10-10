import { useState } from 'react';
import { getCountryByCode, PhoneNumberInput } from '@artmajeur/react-native-paper-phone-number-input';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { StyleSheet } from 'react-native';
import { Config } from '@core/constants/Config';

const includeCountries = ['AZ', 'BD', 'CA', 'GB', 'IN', 'NZ', 'US', 'TR'];

export default function ThemedPhoneTextInput() {
  const theme = useAppTheme();
  const [countryCode, setCountryCode] = useState<string>('BD'); // Default country code
  const [phoneNumber, setPhoneNumber] = useState<string>();

  const { name, flag, dialCode } = getCountryByCode(countryCode); // Get country details

  return (
    <PhoneNumberInput
      style={styles.input}
      code={countryCode}
      setCode={setCountryCode}
      phoneNumber={phoneNumber}
      setPhoneNumber={setPhoneNumber}
      includeCountries={includeCountries}
      mode={'outlined'}
      label={'Phone Number'}
      theme={theme}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: Config.inputHeight,
  },
})
