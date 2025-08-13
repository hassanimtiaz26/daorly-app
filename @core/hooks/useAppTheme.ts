import { useTheme } from 'react-native-paper';
import { AppTheme } from '@core/config/theme.config';

export const useAppTheme = () => useTheme<AppTheme>();
