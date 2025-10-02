// src/components/GlobalDialog.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Button,
  Dialog,
  Portal,
  Text,
} from 'react-native-paper';
import { useDialog } from '@core/hooks/useDialog';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@core/hooks/useAppTheme';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import ThemedButton from '@components/ui/buttons/ThemedButton';

const GlobalDialog = () => {
  const { t } = useTranslation();
  const {
    isOpen,
    title,
    message,
    variant,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    hideDialog,
  } = useDialog();

  const theme = useAppTheme();

  const handleConfirm = () => {
    onConfirm?.();
    hideDialog();
  };

  const handleCancel = () => {
    onCancel?.();
    hideDialog();
  };

  // Determine icon and color based on variant
  const dialogDetails: any = {
    error: { icon: 'error-outline', color: theme.colors.error },
    success: { icon: 'check-circle-outline', color: theme.colors.primary },
    info: { icon: 'info-outline', color: theme.colors.tertiary },
    confirmation: { icon: 'help-outline', color: theme.colors.tertiary },
  };

  return (
    <Portal>
      <Dialog
        theme={{
          ...theme,
          roundness: 2
        }}
        visible={isOpen}
        onDismiss={hideDialog}>
        <Dialog.Icon
          size={64}
          icon={({ size, color }) => (
            <MaterialIcon name={dialogDetails[variant].icon} size={size} color={color} />
          )}
          color={dialogDetails[variant].color} />
        {title && <Dialog.Title style={styles.title}>{title}</Dialog.Title>}
        <Dialog.Content>
          <Text variant="bodyMedium">{message}</Text>
        </Dialog.Content>
        <Dialog.Actions style={{ justifyContent: 'center'}}>
          {variant === 'confirmation' && (
            <Button mode={'outlined'} onPress={handleCancel}>{cancelText}</Button>
          )}
          <Button mode={'contained-tonal'} onPress={handleConfirm}>
            {variant === 'confirmation' ? confirmText : t('general.dismiss')}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
});

export default GlobalDialog;
