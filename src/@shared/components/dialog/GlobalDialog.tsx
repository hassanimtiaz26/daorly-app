// src/components/GlobalDialog.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
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
    messageBackground,
    variant,
    type,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    hideDialog,
    content,
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
    error: {
      icon: 'error-outline',
      color: theme.colors.error,
      surface: theme.colors.errorContainer,
      onSurface: theme.colors.onErrorContainer,
    },
    success: {
      icon: 'check-circle-outline',
      color: theme.colors.primary,
      surface: theme.colors.primaryContainer,
      onSurface: theme.colors.onPrimaryContainer,
    },
    info: {
      icon: 'info-outline',
      color: theme.colors.secondary,
      surface: theme.colors.secondaryContainer,
      onSurface: theme.colors.onSecondaryContainer,
    },
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
        <Dialog.Content style={{
          gap: 12,
        }}>
          <View style={{
            backgroundColor: dialogDetails[variant].surface,
            padding: 12,
            borderLeftColor: dialogDetails[variant].color,
            borderLeftWidth: 4,
          }}>
            <Text style={{ color: dialogDetails[variant].onSurface, textAlign: 'center' }} variant="bodyMedium">{message}</Text>
          </View>
          {content}
        </Dialog.Content>
        <Dialog.Actions style={{ justifyContent: 'center', gap: 24 }}>
          <Button
            theme={{ roundness: 2 }}
            mode={'elevated'}
            rippleColor={theme.colors.surfaceDisabled}
            buttonColor={dialogDetails[variant].surface}
            labelStyle={{ color: dialogDetails[variant].onSurface }}
            onPress={handleConfirm}>
            {type === 'confirmation' ? confirmText : t('general.dismiss')}
          </Button>
          {type === 'confirmation' && (
            <Button
              theme={{ roundness: 2 }}
              mode={'elevated'}
              rippleColor={theme.colors.surfaceDisabled}
              labelStyle={{ color: dialogDetails[variant].onSurface }}
              onPress={handleCancel}>
              {cancelText}
            </Button>
          )}
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
