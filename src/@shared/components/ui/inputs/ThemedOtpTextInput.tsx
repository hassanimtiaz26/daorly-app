import { FC, useCallback, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  TextInput as RNTextInput,
} from 'react-native';
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { TextInputProps } from 'react-native-paper';
import { useAppTheme } from '@core/hooks/useAppTheme';

type OtpInputProps = {
  maxLength: number;
  autoFocus?: boolean;
  onPinChange?: (pin: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  otpContainerStyle?: StyleProp<ViewStyle>;
  otpBoxStyle?: StyleProp<ViewStyle>;
  otpTextStyle?: StyleProp<TextStyle>;
  textInputProps?: TextInputProps;
};

const ThemedOtpTextInput: FC<OtpInputProps> = ({
                                   maxLength = 4,
                                   onPinChange,
                                   autoFocus = true,
                                   containerStyle,
                                   otpContainerStyle,
                                   otpBoxStyle,
                                   otpTextStyle,
                                   textInputProps,
                                 }) => {
  const { colors } = useAppTheme();
  const [isInputBoxFocused, setIsInputBoxFocused] =
    useState<boolean>(autoFocus);
  const [otp, setOtp] = useState<string>('');
  const ref = useRef<RNTextInput>(null);

  const handlePinChange = useCallback(
    (pin: string) => {
      setOtp(pin);
      if (onPinChange) {
        onPinChange(pin);
      }
    },
    [onPinChange]
  );

  const boxArray = new Array(maxLength).fill(0);
  const handleOnPress = () => {
    setIsInputBoxFocused(true);
    ref?.current?.focus();
  };

  const handleOnBlur = () => {
    setIsInputBoxFocused(false);
  };

  const containerStyleObject = StyleSheet.flatten([
    defaultStyles.container,
    containerStyle,
  ]);

  const otpContainerStylesObject = StyleSheet.flatten([
    defaultStyles.otpContainer,
    otpContainerStyle,
  ]);

  const otpBoxStyleObject = StyleSheet.flatten([
    defaultStyles.otpBox,
    otpBoxStyle,
  ]);

  const otpTextStyleObject = StyleSheet.flatten([
    defaultStyles.otpText,
    otpTextStyle,
  ]);
  return (
    <View style={containerStyleObject}>
      <TextInput
        mode="outlined"
        style={defaultStyles.textInput}
        theme={{
          roundness: 10,
        }}
        value={otp}
        onChangeText={handlePinChange}
        maxLength={maxLength}
        ref={ref}
        onBlur={handleOnBlur}
        keyboardType="numeric"
        autoFocus={autoFocus}
        {...textInputProps}
      />
      <Pressable style={otpContainerStylesObject} onPress={handleOnPress}>
        {boxArray.map((_, index) => {
          const isCurrentValue = index === otp.length;
          const isLastValue = index === maxLength - 1;
          const isCodeComplete = otp.length === maxLength;

          const isValueFocused =
            isCurrentValue || (isLastValue && isCodeComplete);

          return (
            <View
              key={index}
              style={{
                ...otpBoxStyleObject,
                borderColor:
                  isInputBoxFocused && isValueFocused
                    ? colors.primary
                    : colors.outline,
              }}
            >
              <Text style={otpTextStyleObject}>{otp[index] || ''}</Text>
            </View>
          );
        })}
      </Pressable>
    </View>
  );
}

const defaultStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  textInput: {
    position: 'absolute',
    opacity: 0,
  },
  otpContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  otpBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    maxWidth: 48,
    minWidth: 48,
    maxHeight: 48,
    minHeight: 48,
    justifyContent: 'center',
  },
  otpText: {
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
  },
});

export default ThemedOtpTextInput;
