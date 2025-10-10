import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useFetch } from '@core/hooks/useFetch';
import { ApiRoutes } from '@core/constants/ApiRoutes';
import { TService } from '@core/types/service.type';
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@core/hooks/useAppTheme';
import ThemedHeader from '@components/ui/elements/ThemedHeader';
import ServiceSlider from '@components/services/ServiceSlider';
import { Checkbox, FAB, Text, TextInput } from 'react-native-paper';
import ThemedTextInput from '@components/ui/inputs/ThemedTextInput';
import Feather from '@expo/vector-icons/Feather';
import SyriaFlag from '@/assets/icons/syria.svg';
import ThemedSelect from '@components/ui/inputs/ThemedSelect';
import { TCity, TSelectValues } from '@core/types/general.type';
import ThemedButton from '@components/ui/buttons/ThemedButton';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { DateTime } from 'luxon';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { syrianPhoneNumberRegex } from '@core/utils/helpers.util';
import ThemedInputError from '@components/ui/inputs/ThemedInputError';
import ThemedPhotoPicker from '@components/ui/pickers/ThemedPhotoPicker';
import { ImagePickerAsset } from 'expo-image-picker/src/ImagePicker.types';
import axios, { AxiosInstance } from 'axios';
import { Config } from '@core/constants/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { File } from 'expo-file-system';

const createStyles = (colors: MD3Colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContentContainer: {
    gap: 12,
  },
  innerContentContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  header: {
    paddingBottom: 82,
    marginBottom: -72,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

type OrderSearchParams = {
  serviceId: string;
}

const OrderScreen = () => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { canGoBack, back } = useRouter();

  const formSchema = z.object({
    description: z.string().trim().min(1, 'Description is required'),
    date: z.string().trim().min(1, 'Date is required'),
    photos: z.array(z.any()).min(1, 'At least one photo is required'),
    discountCode: z.string().trim().optional(),
    useProfileDetails: z.boolean(),
    phoneNumber: z.string().trim().optional(),
    city: z.string().trim().optional(),
    area: z.string().trim().optional(),
    address: z.string().trim().optional(),
  })
    .superRefine((data, ctx) => {
      if (!data.useProfileDetails) {
        if (!data.phoneNumber) {
          ctx.addIssue({
            code: 'custom',
            path: ['phoneNumber'],
            message: 'Phone number is required',
          });
        } else if (!syrianPhoneNumberRegex.test(data.phoneNumber)) {
          ctx.addIssue({
            code: 'custom',
            path: ['phoneNumber'],
            message: t('errors.phone.invalid'),
          })
        }
        if (!data.area) {
          ctx.addIssue({
            code: 'custom',
            path: ['area'],
            message: 'Area is required',
          });
        }
        if (!data.address) {
          ctx.addIssue({
            code: 'custom',
            path: ['address'],
            message: 'Address is required',
          });
        }
      }
    });
  type FormValues = z.infer<typeof formSchema>;
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
    trigger,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      date: '',
      photos: [],
      useProfileDetails: false,
      phoneNumber: '',
      city: '',
      area: '',
      address: '',
    },
  });

  const useProfileDetails = watch('useProfileDetails');

  const { get, post, loading } = useFetch();
  const { serviceId } = useLocalSearchParams<OrderSearchParams>();
  const [service, setService] = useState<TService | null>(null);
  // const [checked, setChecked] = useState(false);

  const [cities, setCities] = useState<TSelectValues>({
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
  const [areaDisabled, setAreaDisabled] = useState(true);

  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState(DateTime.now().toJSDate());
  const [minDate, setMinDate] = useState(DateTime.now().plus({ day: 2 }).toJSDate());
  const [maxDate, setMaxDate] = useState(DateTime.now().plus({ day: 30 }).toJSDate());

  useEffect(() => {
    getCities();
  }, []);

  useEffect(() => {
    if (serviceId) {
      getService(serviceId);
    }
  }, [serviceId]);

  const getService = useCallback((id: string) => {
    get(ApiRoutes.services.show(id))
      .subscribe({
        next: (response) => {
          if ('data' in response) {
            setService(response.data.service);
          }
        },
      });
  }, [get]);

  const getCities = useCallback(() => {
    get(ApiRoutes.location.cities).subscribe({
      next: (response) => {
        if (!response.data) return;

        const citiesData: TCity[] = response.data.cities;
        const mappedCities = citiesData.map((item) => ({
          _id: item.id.toString(),
          value: item.name,
        }));

        setCities({
          value: '',
          list: mappedCities,
          selectedList: [],
          error: '',
        });
      },
      error: (error) => console.error('Error fetching cities:', error),
    });
  }, [get, setAreas, setCities]);

  const onCityChange = (value: any) => {
    console.log(value);
    setAreaDisabled(true);

    setCities({
      ...cities,
      value: value.text,
      selectedList: value.selectedList,
    });

    const selectedCity = value.selectedList[0];

    if (selectedCity) {
      get(ApiRoutes.location.areas(selectedCity._id))
        .subscribe({
          next: (response) => {
            if ('data' in response) {
              const data = response.data.areas;
              setAreas({
                value: '',
                list: data.map((item: any) => ({
                  _id: item.id,
                  value: item.name,
                })),
                selectedList: [],
                error: '',
              });
              setValue('city', selectedCity._id.toString(), {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              });
              trigger('city').then();
              setValue('area', '', { shouldValidate: true });
              setAreaDisabled(false);
            }
          },
          error: (error) => {
            console.error('Error fetching areas:', error);
          },
        });
    }
  };

  const onAreaChange = (value: any) => {
    console.log(value);
    setAreas({
      ...areas,
      value: value.text,
      selectedList: value.selectedList,
    });
    const selectedArea = value.selectedList[0];
    if (selectedArea) {
      console.log('setting area', selectedArea._id);
      setValue('area', selectedArea._id.toString(), {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    } else {
      setValue('area', '', {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
    trigger('area').then();
  };

  const handleTextChange = (inputControl: any) => {
    trigger(inputControl).then();
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    console.log('selectedDateEvent', event);
    console.log('selectedDate', selectedDate);
    if (selectedDate) {
      setValue('date', selectedDate ? DateTime.fromJSDate(selectedDate).toLocaleString() : '', {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      });
    }
    trigger('date').then();
    setShowCalendar(false);
  };

  const onPhotosChange = (photos: ImagePickerAsset[]) => {
    console.log('photos', photos);
    setValue('photos', photos, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
    trigger('photos').then();
  }

  const onSubmit = async (data: FormValues) => {
    // if (!isValid) return;

    // console.log('data', JSON.stringify(data, null, 2));
    const formData = new FormData();
    formData.append('serviceId', serviceId as string);
    formData.append('description', data.description);
    formData.append('date', data.date);
    formData.append('useProfileDetails', String(data.useProfileDetails));

    if (!data.useProfileDetails) {
      formData.append('phoneNumber', data.phoneNumber);
      formData.append('area', data.area);
      formData.append('address', data.address);
    }

    data.photos.forEach((photo, index) => {
      // formData.append('photos', {
      //   uri: photo.uri,
      //   name: photo.fileName,
      //   type: photo.type,
      // } as any);
      formData.append('photos', new File(photo.uri));
    });

    console.log('formData', formData);

    // try {
    //   const token = await AsyncStorage.getItem(Config.tokenStoreKey);
    //   // const axiosInstance: AxiosInstance = axios.create({
    //   //   baseURL: new URL(Config.baseUrlContext, Config.baseUrl).toString(),
    //   //   headers: {
    //   //     'Content-Type': 'multipart/form-data',
    //   //     'Authorization': `Bearer ${token}`,
    //   //   },
    //   // });
    //   //
    //   // const request = await axiosInstance.post(ApiRoutes.orders.create, formData, {
    //   //   transformRequest: (data: any, headers) => {
    //   //     return data;
    //   //   }
    //   // });
    //   // console.log('Order Response', request.data);
    //
    //   const url = new URL(Config.baseUrlContext, Config.baseUrl).toString() + '/' + ApiRoutes.orders.create;
    //   const response = await fetch(url, {
    //     method: 'POST',
    //     body: formData,
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //     },
    //   });
    //
    //   const data = await response.json();
    //   console.log('Upload success:', data);
    // } catch (formError) {
    //   console.error('formError', JSON.stringify(formError, null, 2));
    // }

    post(
      ApiRoutes.orders.create,
      formData,
    )
      .subscribe({
        next: (response) => {
          console.log('Order Response', response);
        }
      });
  };

  return (
    <ScrollView
      style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
      <ThemedHeader style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              if (canGoBack()) {
                back();
              }
            }}>
            <Feather
              name={'x'} size={24} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </ThemedHeader>

      {service && (
        <View style={styles.innerContentContainer}>
          <ServiceSlider data={service.images} />

          <View style={{ flex: 1, width: '100%', gap: 12 }}>
            <Text style={{ color: colors.secondary, fontWeight: 'bold', textAlign: 'center' }} variant={'titleLarge'}>{service.name}</Text>
            <Text style={{ fontWeight: 'bold', textAlign: 'center' }} variant={'bodyMedium'}>{t('order.subTitle')}</Text>
          </View>

          <View style={{ flex: 1, width: '100%', gap: 12 }}>
            <Controller
              control={control}
              name={'description'}
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
                    placeholder={t('order.form.description')}
                    label={t('general.description')} />
                  {errors.description && (
                    <ThemedInputError text={errors.description?.message} />
                  )}
                </View>
              )} />


            <Controller
              control={control}
              name={'date'}
              render={({ field: { value }, fieldState: { error }}) => (
                <View>
                  <ThemedTextInput
                    value={value}
                    error={!!error}
                    disabled={loading || isSubmitting}
                    readOnly={true}
                    right={
                      <TextInput.Icon
                        onPress={() => setShowCalendar(true)}
                        icon={'calendar'} />
                    }
                    label={t('order.form.date')} />
                  {errors.date && (
                    <ThemedInputError text={errors.date?.message} />
                  )}
                </View>
              )} />


            {showCalendar && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={'date'}
                is24Hour={true}
                onChange={onDateChange}
                minimumDate={minDate}
              />
            )}

            <View>
              <ThemedPhotoPicker loading={loading} onChange={onPhotosChange} />
              {errors.photos && (
                <ThemedInputError text={errors.photos?.message} />
              )}
            </View>

            <ThemedTextInput
              disabled={loading || isSubmitting}
              label={t('order.form.discount')} />

            <Controller
              control={control}
              name={'useProfileDetails'}
              render={({ field: { onChange, value }}) => (
                <Checkbox.Item
                  disabled={loading || isSubmitting}
                  label={t('order.form.existingProfile')}
                  status={value ? 'checked' : 'unchecked'}
                  onPress={() =>  onChange(!value)}
                />
              )} />


            {!useProfileDetails && (
              <>
                <Controller
                  control={control}
                  name={'phoneNumber'}
                  render={({ field: { onChange, onBlur, value }, fieldState: { error }}) => (
                    <View>
                      <ThemedTextInput
                        keyboardType={'numeric'}
                        onBlur={onBlur}
                        onChangeText={(e) => {
                          onChange(e);
                          handleTextChange('phoneNumber');
                        }}
                        value={value}
                        error={!!error}
                        label={t('general.phoneNumber')}
                        left={<TextInput.Icon
                          size={34}
                          icon={({ size, color }) => (
                            <SyriaFlag width={size} height={size} fill={color} />
                          )}
                        />}
                        right={<TextInput.Icon size={18} icon={'phone'} />} />
                      {errors.phoneNumber && (
                        <ThemedInputError text={errors.phoneNumber?.message} />
                      )}
                    </View>
                  )} />


                <ThemedSelect
                  disabled={loading || isSubmitting}
                  label={t('general.city')}
                  arrayList={cities.list}
                  selectedArrayList={cities.selectedList}
                  multiEnable={false}
                  value={cities.value}
                  onSelection={onCityChange} />

                <ThemedSelect
                  disabled={areaDisabled || loading}
                  label={t('general.area')}
                  arrayList={areas.list}
                  selectedArrayList={areas.selectedList}
                  multiEnable={false}
                  value={areas.value}
                  onSelection={onAreaChange} />

                <Controller
                  control={control}
                  name={'address'}
                  render={({ field: { onChange, onBlur, value }, fieldState: { error }}) => (
                    <View>
                      <ThemedTextInput
                        onBlur={onBlur}
                        onChangeText={(e) => {
                          onChange(e);
                          handleTextChange('address');
                        }}
                        value={value}
                        error={!!error}
                        disabled={loading || isSubmitting}
                        label={t('general.address')}
                        right={<TextInput.Icon
                          icon={({ size, color }) => (
                            <Feather name="map-pin" size={size} color={color} />
                          )}
                        />} />
                      {errors.address && (
                        <ThemedInputError text={errors.address?.message} />
                      )}
                    </View>
                  )} />

              </>
            )}

            <ThemedButton
              disabled={!isValid || loading || isSubmitting}
              loading={loading}
              onPress={handleSubmit(onSubmit)}
              buttonStyle={'secondary'}>{t('general.confirm')}</ThemedButton>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

export default OrderScreen;
