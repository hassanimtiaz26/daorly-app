import { TextInput, TextInputProps } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { FC } from 'react';
import { Config } from '@core/constants/Config';

type ThemedTextInputProps = TextInputProps & {
  autoHeight?: boolean;
}

const ThemedTextInput: FC<ThemedTextInputProps> = ({ style, autoHeight, ...props }) => {
  return (
    <TextInput mode={'outlined'} style={[{
      width: '100%',
      minHeight: autoHeight ? Config.inputHeight : null,
      height: autoHeight ? null : Config.inputHeight,
    }, style]} {...props} />
  )
};

const styles = StyleSheet.create({

})

export default ThemedTextInput;
