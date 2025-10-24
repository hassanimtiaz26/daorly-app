import { ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Text, TextInput } from 'react-native-paper';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { useFetch } from '@core/hooks/useFetch';
import { useAuth } from '@core/hooks/useAuth';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { TArea, TSelectValues } from '@core/types/general.type';
import ThemedSelect from '@components/ui/inputs/ThemedSelect';
import ThemedTextInput from '@components/ui/inputs/ThemedTextInput';
import Feather from '@expo/vector-icons/Feather';
import ThemedInputError from '@components/ui/inputs/ThemedInputError';
import ThemedButton from '@components/ui/buttons/ThemedButton';
import { ApiRoutes } from '@core/constants/ApiRoutes';
import { TService } from '@core/types/service.type';
import { useRouter } from 'expo-router';

const createStyles = (colors: MD3Colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    gap: 32,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingTop: 32,
  },
  title: {
    marginTop: 8,
  },
  logo: {
    width: 200,
    height: 80,
  },
  innerContentContainer: {
    padding: 20,
    flex: 1,
    width: '100%',
    gap: 36,
  },
  textInputContainer: {
    width: '100%',
    paddingHorizontal: 16,
    gap: 16,
    marginTop: 24,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 16,
    gap: 16,
    marginTop: 'auto',
  },
});

const BusinessAccount = () => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const { get, post, loading } = useFetch();
  const { setUser } = useAuth();
  const { replace } = useRouter();

  const editBusinessSchema = z.object({
    name: z.string().trim().min(3, { message: t('errors.minLength', { length: 3 }) }),
    services: z.array(z.any()).min(1, 'At least one Service is required'),
    areas: z.array(z.any()).min(1, 'At least one Area is required'),
  });
  type EditBusinessFormType = z.infer<typeof editBusinessSchema>;
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    trigger,
    reset,
  } = useForm<EditBusinessFormType>({
    resolver: zodResolver(editBusinessSchema),
  });

  const [services, setServices] = useState<TSelectValues>({
    value: '',
    list: [],
    selectedList: [],
    error: '',
  });
  const [areas, setAreas] = useState<TSelectValues>({
    value: '',
    list: [],
    selectedList: [],
    error: '',
  });

  useEffect(() => {
    register('services');
    register('areas');
  }, [register]);

  useEffect(() => {
    get(ApiRoutes.complete.data)
      .subscribe({
        next: (response) => {
          if (response && 'data' in response) {
            const servicesData: TService[] = response.data.services;
            const mappedServices = servicesData.map((item) => ({
              _id: item.id.toString(),
              value: item.name,
            }));
            setServices({
              value: '',
              list: mappedServices,
              selectedList: [],
              error: '',
            });

            const areasData: TArea[] = response.data.areas;
            const mappedAreas = areasData.map((item) => ({
              _id: item.id.toString(),
              value: item.name,
            }));
            setAreas({
              value: '',
              list: mappedAreas,
              selectedList: [],
              error: '',
            });
          }
        }
      })
  }, []);

  const handleTextChange = useCallback((inputControl: any) => {
    trigger(inputControl).then();
  }, [trigger]);

  const onServicesChange = (value: any) => {
    console.log('Services Changed');
    console.log(JSON.stringify(value, null, 2));

    setServices({
      ...services,
      value: value.text,
      selectedList: value.selectedList,
    });

    const selectedServices = value.selectedList;
    setValue('services', selectedServices.map((item: any) => parseInt(item._id)), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onAreasChange = (value: any) => {
    console.log('Areas Changed');
    console.log(JSON.stringify(value, null, 2));
    setAreas({
      ...areas,
      value: value.text,
      selectedList: value.selectedList,
    });

    const selectedAreas = value.selectedList;
    setValue('areas', selectedAreas.map((item: any) => parseInt(item._id)), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  const onSubmit = (data: EditBusinessFormType) => {
    if (!isValid) return;

    post(ApiRoutes.complete.business, data)
      .subscribe({
        next: (response) => {
          console.log('Register Response', response);
          if (response && 'data' in response) {
            if ('user' in response.data) {
              const user = response.data.user;
              setUser(user);
              replace('/(app)/(tabs)/home');
            }
          }
        }
      });
    console.log(data);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollViewContentContainer}>
      <View style={styles.contentContainer}>
        <Image
          style={styles.logo}
          contentFit={'contain'}
          source={require('@/assets/images/daorly-logo.png')} />
        <Text variant={'titleLarge'}>{t('auth.register.title')}</Text>
        <Text style={styles.title} variant={'titleMedium'}>{t('auth.business.title')}</Text>

        <View style={styles.textInputContainer}>

            <Controller
              control={control}
              name={'name'}
              render={({
                         field: { onChange, onBlur, value },
                         fieldState: { error },
                       }) => (
                <View>
                  <ThemedTextInput
                    disabled={loading}
                    onBlur={onBlur}
                    onChangeText={(e) => {
                      onChange(e);
                      handleTextChange('name');
                    }}
                    value={value}
                    error={!!error}
                    label={t('general.businessName')}
                    right={<TextInput.Icon
                      icon={({ size, color }) => (
                        <Feather name="user" size={size} color={color} />
                      )}
                    />} />
                  {errors.name && (
                    <ThemedInputError text={errors.name?.message} />
                  )}
                </View>
              )}
            />

            <ThemedSelect
              disabled={loading}
              label={t('general.services')}
              arrayList={services.list}
              selectedArrayList={services.selectedList}
              multiEnable={true}
              value={services.value}
              onSelection={onServicesChange} />

            <ThemedSelect
              disabled={loading}
              label={t('general.availableAreas')}
              arrayList={areas.list}
              selectedArrayList={areas.selectedList}
              multiEnable={true}
              value={areas.value}
              onSelection={onAreasChange} />


        </View>
      </View>

      <View style={styles.buttonContainer}>
        <ThemedButton
          disabled={!isValid || loading}
          loading={loading}
          onPress={handleSubmit(onSubmit)}
          buttonStyle={'secondary'}>{t('general.register')}</ThemedButton>
      </View>


    </ScrollView>
  );
}

export default BusinessAccount;
