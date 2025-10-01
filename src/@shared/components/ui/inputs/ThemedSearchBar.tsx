import { TextInput, TextInputProps } from 'react-native-paper';
import ThemedTextInput from '@components/ui/inputs/ThemedTextInput';
import Feather from '@expo/vector-icons/Feather';
import { FC, useCallback, useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Href } from 'expo-router/build/types';

type Props = {
  replaceSearch?: boolean;
}

const ThemedSearchBar: FC<TextInputProps & Props> = ({ style, replaceSearch, ...props }) => {
  const [value, setValue] = useState('');
  const { searchQuery } = useLocalSearchParams();
  const { push, replace } = useRouter();

  useEffect(() => {
    setValue(searchQuery as string);
  }, [searchQuery]);

  const onSearch = useCallback(() => {
    if (!value) return;

    const path: Href = {
      pathname: '/(app)/services',
      params: {
        type: 'services',
        searchQuery: value,
      }
    };

    if (replaceSearch) {
      replace(path);
    } else {
      push(path);
    }
  }, [replaceSearch, value]);

  return (
    <ThemedTextInput
      outlineColor={'transparent'}
      style={[{
        height: 48,
        fontSize: 14,
        borderColor: 'white',
      }, style]}
      theme={{
        roundness: 10,
      }}
      value={value}
      onChangeText={text => setValue(text)}
      onSubmitEditing={onSearch}
      returnKeyType={'search'}
      left={<TextInput.Icon
        size={20}
        icon={({ size, color }) => (
          <Feather name="search" size={size} color={color} />
        )}
      /> }
      placeholder={'How can I help you?'}
      {...props}
    />
  );
}

export default ThemedSearchBar;
