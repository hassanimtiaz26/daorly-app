import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { syrianPhoneNumberRegex } from '@core/utils/helpers.util';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { TOrder, TOrderOffer } from '@core/types/order.type';
import { FC, useEffect } from 'react';
import { Text, TextInput } from 'react-native-paper';
import ThemedTextInput from '@components/ui/inputs/ThemedTextInput';
import ThemedInputError from '@components/ui/inputs/ThemedInputError';
import { useFetch } from '@core/hooks/useFetch';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import { t } from 'i18next';
import { useBottomSheet } from '@core/hooks/useBottomSheet';
import { ApiRoutes } from '@core/constants/ApiRoutes';
import { useDialog } from '@core/hooks/useDialog';

type Props = {
  order: TOrder;
  onAcceptOrder?: (response: any) => void;
  offer?: TOrderOffer | null;
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
})

const OrderAcceptContent: FC<Props> = ({ order, offer, onAcceptOrder }) => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const { post, error, loading } = useFetch();
  const { close } = useBottomSheet();
  const { showDialog } = useDialog();

  const formSchema = z.object({
    phoneNumber: z.string().trim().regex(syrianPhoneNumberRegex, t('errors.phone.invalid')),
    message: z.string().trim(),
    price: z.string().trim(),
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
    if (offer) {
      reset({
        phoneNumber: offer.phoneNumber,
        price: offer.price.toString(),
        message: offer.message
      })
    }
  }, [reset, offer]);

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

    post(ApiRoutes.orders.makeOffer(order.id), data)
      .subscribe({
        next: (response) => {
          if (response.success) {
            onAcceptOrder(response);
            close();
          }
        }
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title} variant={'titleLarge'}>{offer ? t('order.offer.edit') : t('order.accept')}</Text>

      <View style={{ gap: 6 }}>
        <Text style={{ textAlign: 'center' }}>{t('order.offer.acceptPrompt')}</Text>
      </View>

      <Text style={{ textAlign: 'center' }}>{t('order.offer.fillDetails')}</Text>

      <Controller
        control={control}
        name={'message'}
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
              placeholder={t('order.offer.form.message')}
              label={t('general.description')} />
            {errors.message && (
              <ThemedInputError text={errors.message?.message} />
            )}
          </View>
        )} />

      <Controller
        control={control}
        name={'price'}
        render={({ field: { onChange, onBlur, value }, fieldState: { error }}) => (
          <View>
            <ThemedTextInput
              onBlur={onBlur}
              onChangeText={(e) => {
                onChange(e);
                handleTextChange('price');
              }}
              right={
                <TextInput.Icon
                  icon={({ color, size }) => <MaterialIcon color={color} size={size} name={'attach-money'} />} />
              }
              keyboardType={'numeric'}
              value={value}
              error={!!error}
              disabled={loading || isSubmitting}
              placeholder={t('order.offer.form.price')}
              label={t('general.price')} />
            {errors.price && (
              <ThemedInputError text={errors.price?.message} />
            )}
          </View>
        )} />

      <Controller
        control={control}
        name={'phoneNumber'}
        render={({ field: { onChange, onBlur, value }, fieldState: { error }}) => (
          <View>
            <ThemedTextInput
              onBlur={onBlur}
              onChangeText={(e) => {
                onChange(e);
                handleTextChange('phoneNumber');
              }}
              right={
                <TextInput.Icon
                  icon={({ color, size }) => <MaterialIcon color={color} size={size} name={'phone'} />} />
              }
              keyboardType={'number-pad'}
              value={value}
              error={!!error}
              disabled={loading || isSubmitting}
              placeholder={t('order.offer.form.phoneNumber')}
              label={t('general.phoneNumber')} />
            {errors.phoneNumber && (
              <ThemedInputError text={errors.phoneNumber?.message} />
            )}
          </View>
        )} />

      <View style={{ flexDirection: 'row', gap: 36, alignItems: 'center', justifyContent: 'center', paddingVertical: 20 }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleSubmit(onSubmit)}
          disabled={loading || !isValid || isSubmitting}
          style={{
            backgroundColor: colors.primaryContainer,
            borderRadius: 10,
            elevation: 3,
            padding: 6,
            flexDirection: 'row',
            gap: 4,
            alignItems: 'center',
          }}>
          <MaterialIcon
            color={colors.onPrimaryContainer}
            name={'check'}
            size={20} />
          <Text style={{ color: colors.onPrimaryContainer }}>{t('general.confirm')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => close()}
          disabled={loading || isSubmitting}
          style={{
            backgroundColor: colors.secondaryContainer,
            borderRadius: 10,
            elevation: 3,
            padding: 6,
            flexDirection: 'row',
            gap: 4,
            alignItems: 'center',
          }}>
          <MaterialIcon
            color={colors.onSecondaryContainer}
            name={'close'}
            size={20} />
          <Text style={{ color: colors.onSecondaryContainer }}>{t('general.close')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default OrderAcceptContent;
