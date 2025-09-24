import { FC, useCallback, useState } from 'react';
import { TextInput, TextInputProps } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import ThemedTextInput from '@components/ui/inputs/ThemedTextInput';

const ThemedInputPassword: FC<TextInputProps> = ({ style, ...props }) => {
  const [hidden, setHidden] = useState(true);

  const toggleHidden = useCallback(() => {
    setHidden(!hidden);
  }, [hidden]);

  return (
    <ThemedTextInput
      secureTextEntry={hidden}
      right={
        <TextInput.Icon
          onPress={toggleHidden}
          size={18}
          icon={hidden ? 'eye' : 'eye-off'} />
      }
      {...props}
    />
  )
}

export default ThemedInputPassword;
