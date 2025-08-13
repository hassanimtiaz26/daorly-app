import { TextInput, TextInputProps } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { FC } from 'react';

const ThemedTextInput: FC<TextInputProps> = ({ style, ...props }) => {
  return (
    <TextInput style={[styles.input, style]} {...props} />
  )
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 64,
  },
})

export default ThemedTextInput;
