import { StyleSheet, View } from 'react-native';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import ThemedInputPassword from '@components/ui/inputs/ThemedInputPassword';
import ThemedInputError from '@components/ui/inputs/ThemedInputError';
import { useFetch } from '@core/hooks/useFetch';
import { useCallback, useEffect } from 'react';
import ThemedButton from '@components/ui/buttons/ThemedButton';
import { ApiRoutes } from '@core/constants/ApiRoutes';
import { useDialog } from '@core/hooks/useDialog';

const styles = StyleSheet.create({
  textInputContainer: {
    width: '100%',
    padding: 16,
    gap: 16,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 16,
    gap: 16,
    marginTop: 'auto',
  },
});

type TChangePasswordForm = {
  currentPassword: string;
  newPassword: string;
}

const ChangePassword = () => {
  const { t } = useTranslation();

  const formSchema = z.object({
    currentPassword: z.string().trim(),
    password: z.string().trim().min(8, t('errors.password.minLength')),
    confirmPassword: z.string().trim(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('errors.password.notMatch'),
    path: ['confirmPassword'],
  })
  type FormType = z.infer<typeof formSchema>;
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    reset,
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { post, loading, error } = useFetch();
  const { showDialog } = useDialog();

  useEffect(() => {
    if (error) {
      showDialog({
        variant: 'error',
        message: error,
      })
    }
  }, [error]);

  const handleTextChange = (inputControl: any) => {
    trigger(inputControl).then();
  };

  const onSubmit = (data: FormType) => {
    if (!isValid) return;

    const formData: TChangePasswordForm = {
      currentPassword: data.currentPassword,
      newPassword: data.password,
    }

    post(ApiRoutes.user.changePassword, formData)
      .subscribe({
        next: (response) => {
          if (response && response.success) {
            showDialog({
              variant: 'success',
              message: response.message || 'Password changed successfully.',
            });
            reset();
          }
        }
      })
  };

  return (
    <View style={styles.textInputContainer}>
      <Controller
        control={control}
        name={'currentPassword'}
        render={({
                   field: { onChange, onBlur, value },
                   fieldState: { error },
                 }) => (
          <View>
            <ThemedInputPassword
              disabled={loading}
              onBlur={onBlur}
              onChangeText={(e) => {
                onChange(e);
                handleTextChange('currentPassword');
              }}
              value={value}
              error={!!error}
              label={t('general.currentPassword')} />
            {errors.currentPassword && (
              <ThemedInputError text={errors.currentPassword?.message} />
            )}
          </View>
        )} />

      <Controller
        control={control}
        name={'password'}
        render={({
                   field: { onChange, onBlur, value },
                   fieldState: { error },
                 }) => (
          <View>
            <ThemedInputPassword
              disabled={loading}
              onBlur={onBlur}
              onChangeText={(e) => {
                onChange(e);
                handleTextChange('password');
              }}
              value={value}
              error={!!error}
              label={t('general.password')} />
            {errors.password && (
              <ThemedInputError text={errors.password?.message} />
            )}
          </View>
        )} />

      <Controller
        control={control}
        name={'confirmPassword'}
        render={({
                   field: { onChange, onBlur, value },
                   fieldState: { error },
                 }) => (
          <View>
            <ThemedInputPassword
              disabled={loading}
              onBlur={onBlur}
              onChangeText={(e) => {
                onChange(e);
                handleTextChange('confirmPassword');
              }}
              value={value}
              error={!!error}
              label={t('general.confirmPassword')} />
            {errors.confirmPassword && (
              <ThemedInputError text={errors.confirmPassword?.message} />
            )}
          </View>
        )} />

      <View style={styles.buttonContainer}>
        <ThemedButton
          disabled={!isValid || loading}
          loading={loading}
          onPress={handleSubmit(onSubmit)}
          buttonStyle={'secondary'}>{t('general.changePassword')}</ThemedButton>
      </View>
    </View>
  );
};

export default ChangePassword;
