import { TOrder, TOrderOffer } from '@core/types/order.type';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { FC, useEffect } from 'react';
import { z } from 'zod';
import { syrianPhoneNumberRegex } from '@core/utils/helpers.util';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Text } from 'react-native-paper';
import ThemedTextInput from '@components/ui/inputs/ThemedTextInput';
import ThemedInputError from '@components/ui/inputs/ThemedInputError';
import { ApiRoutes } from '@core/constants/ApiRoutes';
import { useFetch } from '@core/hooks/useFetch';
import { useBottomSheet } from '@core/hooks/useBottomSheet';
import { useDialog } from '@core/hooks/useDialog';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import ThemedButton from '@components/ui/buttons/ThemedButton';

type Props = {
  order: TOrder;
  onCancelOrder?: (response: any) => void;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
  }
});

const OrderCancelContent: FC<Props> = ({ order, onCancelOrder }) => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const { post, error, loading } = useFetch();
  const { close } = useBottomSheet();
  const { showDialog } = useDialog();

  const formSchema = z.object({
    cancellationReason: z.string().trim().min(3, t('order.cancel.reason.required')),
  });
  type FormType = z.infer<typeof formSchema>;
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    trigger,
    setValue,
    reset,
  } = useForm<FormType>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (error) {
      showDialog({
        variant: 'error',
        message: error,
      });
    }
  }, [error]);

  const handleTextChange = (inputControl: any) => {
    trigger(inputControl).then();
  };

  const onSubmit = (data: FormType)=> {
    if (!isValid) return;

    post(ApiRoutes.orders.cancel(order.id), data)
      .subscribe({
        next: (response) => {
          if (response.success) {
            onCancelOrder(response);
            close();
          }
        }
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title} variant={'titleLarge'}>{t('order.cancel.title')}</Text>

      <View style={{ gap: 6 }}>
        <Text style={{ textAlign: 'center' }}>{t('order.cancel.message')}</Text>
      </View>

      <Controller
        control={control}
        name={'cancellationReason'}
        render={({ field: { onChange, onBlur, value }, fieldState: { error }}) => (
          <View>
            <ThemedTextInput
              onBlur={onBlur}
              onChangeText={(e) => {
                onChange(e);
                handleTextChange('description');
              }}
              value={value}
              error={!!error}
              disabled={loading || isSubmitting}
              autoHeight={true}
              style={{ minHeight: 100 }}
              numberOfLines={5}
              multiline={true}
              placeholder={t('order.cancel.reason.placeholder')}
              label={t('order.cancel.reason.label')} />
            {errors.cancellationReason && (
              <ThemedInputError text={errors.cancellationReason?.message} />
            )}
          </View>
        )} />


      <View style={{ flexDirection: 'row', gap: 36, alignItems: 'center', justifyContent: 'center', paddingVertical: 20 }}>
        <View style={{ flex: 1 }}>
          <ThemedButton
            onPress={handleSubmit(onSubmit)}
            paddingVertical={2}
            mode={'contained-tonal'}
            compact={true}
            icon={({ color, size }) => (
              <MaterialIcon
                color={color}
                name={'check'}
                size={size} />
            )}
            disabled={loading || !isValid || isSubmitting}>{t('general.confirm')}</ThemedButton>
        </View>

        <View style={{ flex: 1 }}>
          <ThemedButton
            onPress={() => close()}
            paddingVertical={2}
            mode={'contained-tonal'}
            buttonStyle={'error'}
            icon={({ color, size }) => (
              <MaterialIcon
                color={color}
                name={'close'}
                size={size} />
            )}
            disabled={loading || isSubmitting}>{t('general.close')}</ThemedButton>
        </View>
      </View>

    </View>
  );
};

export default OrderCancelContent;
