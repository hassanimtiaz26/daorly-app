import ThemedTextInput from '@components/ui/inputs/ThemedTextInput';
import { TextInput } from 'react-native-paper';
import Feather from '@expo/vector-icons/Feather';
import SyriaFlag from '@/assets/icons/syria.svg';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { FC } from 'react';
import { ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';

const EditProfile: FC<ViewProps> = (props) => {
  const { t } = useTranslation();

  return (
    <View {...props}>
      <ThemedTextInput
        label={t('general.firstName')}
        right={<TextInput.Icon
          icon={({ size, color }) => (
            <Feather name="user" size={size} color={color} />
          )}
        />} />

      <ThemedTextInput
        label={t('general.lastName')}
        right={<TextInput.Icon
          icon={({ size, color }) => (
            <Feather name="user" size={size} color={color} />
          )}
        />} />

      <ThemedTextInput
        readOnly={true}
        label={t('general.country')}
        value={t('general.syria')}
        left={<TextInput.Icon
          size={34}
          icon={({ size, color }) => (
            <SyriaFlag width={size} height={size} fill={color} />
          )}
        />}
        right={<TextInput.Icon
          icon={({ size, color }) => (
            <Feather name="chevron-down" size={size} color={color} />
          )}
        />} />

      <ThemedTextInput
        readOnly={true}
        label={t('general.city')}
        right={<TextInput.Icon
          icon={({ size, color }) => (
            <Feather name="chevron-down" size={size} color={color} />
          )}
        />} />

      <ThemedTextInput
        readOnly={true}
        label={t('general.area')}
        right={<TextInput.Icon
          icon={({ size, color }) => (
            <Feather name="chevron-down" size={size} color={color} />
          )}
        />} />

      <ThemedTextInput
        label={t('general.address')}
        right={<TextInput.Icon
          icon={({ size, color }) => (
            <Feather name="map-pin" size={size} color={color} />
          )}
        />} />
    </View>
  );
}

export default EditProfile;
