import { FC, ReactNode } from 'react';
import { Pressable, PressableProps, View, ViewStyle } from 'react-native';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';

type Props = {
  children: ReactNode;
}

const ThemedCard: FC<ViewProps & PressableProps & Props> = ({ children, style, ...props }) => {
  const { colors } = useAppTheme();

  return (
    <Pressable
      style={[
      {
        backgroundColor: colors.surface,
        elevation: 1,
        borderRadius: 12,
      },
      style,
    ]}
      {...props}>
      {children}
    </Pressable>
  )
}

export default ThemedCard;
