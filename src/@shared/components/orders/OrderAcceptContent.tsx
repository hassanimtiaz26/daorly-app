import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { stripCountryCode, syrianPhoneNumberRegex } from '@core/utils/helpers.util';
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
import ThemedButton from '@components/ui/buttons/ThemedButton';
import { useAuth } from '@core/hooks/useAuth';

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
});

const OrderAcceptContent: FC<Props> = ({ order, offer, onAcceptOrder }) => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const { post, error, loading } = useFetch();
  const { close } = useBottomSheet();
  const { showDialog } = useDialog();
  const { user } = useAuth();

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
    defaultValues: {
      phoneNumber: user.phoneNumber,
    }
  });

  useEffect(() => {
    if (offer) {
      reset({
        phoneNumber: stripCountryCode(offer.phoneNumber),
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

    const number = '+963' + stripCountryCode(data.phoneNumber);

    const formData = {
      ...data,
      phoneNumber: number,
    }

    console.log(JSON.stringify(formData, null, 2));

    // post(ApiRoutes.orders.makeOffer(order.id), formData)
    //   .subscribe({
    //     next: (response) => {
    //       if (response && response.success) {
    //         onAcceptOrder(response);
    //         close();
    //       }
    //     }
    //   });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title} variant={'titleLarge'}>{offer ? t('order.offer.edit') : t('order.accept.title')}</Text>

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
              left={<TextInput.Affix text={'+963'} />}
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
        <View style={{ flex: 1 }}>
          <ThemedButton
            onPress={handleSubmit(onSubmit)}
            paddingVertical={2}
            mode={'contained-tonal'}
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
}

export default OrderAcceptContent;
