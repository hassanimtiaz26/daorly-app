import { PaperSelect } from 'react-native-paper-select';
import { StyleSheet } from 'react-native';
import { FC } from 'react';
import { PaperSelectProps } from 'react-native-paper-select/src/interface/paperSelect.interface';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { TextInput } from 'react-native-paper';
import Feather from '@expo/vector-icons/Feather';

const createStyles = (colors: MD3Colors) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    marginBottom: -14,
  },
  select: {
    width: '100%',
    height: 64,
    borderColor: colors.outline,
    margin: 0,
  },
});

const ThemedSelect: FC<PaperSelectProps> = ({ containerStyle, ...props }) => {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  return (
    <PaperSelect
      textInputMode={'outlined'}
      textInputStyle={styles.select}
      dialogStyle={{
        backgroundColor: colors.surfaceVariant,
      }}
      textInputProps={{
        right: <TextInput.Icon icon={({ size, color }) => (
          <Feather name="chevron-down" size={size} color={color} />
        )} />
      }}
      containerStyle={styles.container}
      {...props} />
  )
}

export default ThemedSelect;
