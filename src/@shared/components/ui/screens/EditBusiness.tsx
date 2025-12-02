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
import { FC, useCallback, useEffect, useState } from 'react';
import { TArea, TSelectValues } from '@core/types/general.type';
import ThemedSelect from '@components/ui/inputs/ThemedSelect';
import ThemedTextInput from '@components/ui/inputs/ThemedTextInput';
import Feather from '@expo/vector-icons/Feather';
import ThemedInputError from '@components/ui/inputs/ThemedInputError';
import ThemedButton from '@components/ui/buttons/ThemedButton';
import { ApiRoutes } from '@core/constants/ApiRoutes';
import { TService } from '@core/types/service.type';
import { useRouter } from 'expo-router';
import { ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';
import { TBusinessAccount } from '@core/types/user.type';

type Props = ViewProps & {
  buttonText?: string;
  onSave: () => void;
  isEdit?: boolean;
};

const styles = StyleSheet.create({
  innerContainer: {
    width: '100%',
    gap: 16,
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

const EditBusiness: FC<Props> = ({ buttonText, onSave, isEdit, ...props }) => {
  const { t } = useTranslation();
  const { get, post, loading } = useFetch();
  const { setUser } = useAuth();
  const { replace } = useRouter();
  const { user } = useAuth();

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
  const [business, setBusiness] = useState<TBusinessAccount>();

  useEffect(() => {
    register('services');
    register('areas');
  }, [register]);

  useEffect(() => {
    getData();
  }, []);

  const getData = useCallback(() => {
    // console.log('EditBusiness.getData.user', JSON.stringify(user, null, 2));
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
              selectedList: [],
              value: '',
              list: mappedServices,
              error: '',
            });

            const areasData: TArea[] = response.data.areas;
            const mappedAreas = areasData.map((item) => ({
              _id: item.id.toString(),
              value: item.name,
            }));
            setAreas({
              selectedList: [],
              value: '',
              list: mappedAreas,
              error: '',
            });

            if (user && user.businessAccounts.length > 0 && isEdit) {
              const businessAccount = user.businessAccounts[0];
              get(ApiRoutes.business.index)
                .subscribe({
                  next: (response) => {
                    if (response && 'data' in response) {
                      const businessAccount: TBusinessAccount = response.data.business;
                      // console.log(JSON.stringify(businessAccount, null, 2))

                      setBusiness(businessAccount);

                      const selectedAreas = businessAccount.areas;
                      const selectedServices = businessAccount.categories;

                      reset({
                        name: businessAccount.name,
                        areas: selectedAreas.map(a => a.id),
                        services: selectedServices.map(s => s.id),
                      });

                      console.log(selectedAreas.map((a) => a.name).join(', '));

                      setAreas(prevAreas => ({
                        ...prevAreas,
                        selectedList: selectedAreas.map((a) => ({
                          _id: a.id.toString(),
                          value: a.name
                        })),
                        value: selectedAreas.map((a) => a.name).join(', ')
                      }));
                      setServices(prevServices => ({
                        ...prevServices,
                        selectedList: selectedServices.map((s) => ({
                          _id: s.id.toString(),
                          value: s.name
                        })),
                        value: selectedServices.map((a) => a.name).join(', ')
                      }));
                    }
                  }
                });
            }
          }
        }
      })
  }, [get, user, isEdit, setBusiness, setServices, setAreas]);

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

    post(ApiRoutes.complete.business, {
      name: data.name,
      areas: data.areas,
      categories: data.services,
    })
      .subscribe({
        next: (response) => {
          console.log('Register Response', response);
          if (response && 'data' in response) {
            // console.log('EditBusiness.onSubmit.response', JSON.stringify(response.data, null, 2));
            setUser(response.data.user);
            onSave();
          }
        }
      });
    console.log(data);
  }

  return (
    <View {...props}>
      <View style={styles.innerContainer}>

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

      <View style={styles.buttonContainer}>
        <ThemedButton
          disabled={!isValid || loading}
          loading={loading}
          onPress={handleSubmit(onSubmit)}
          buttonStyle={'secondary'}>{buttonText || t('general.register')}</ThemedButton>
      </View>
    </View>
  );
}

export default EditBusiness;
