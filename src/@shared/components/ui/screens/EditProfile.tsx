import ThemedTextInput from '@components/ui/inputs/ThemedTextInput';
import { TextInput } from 'react-native-paper';
import Feather from '@expo/vector-icons/Feather';
import SyriaFlag from '@/assets/icons/syria.svg';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { FC, useCallback, useEffect, useState } from 'react';
import { ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';
import ThemedButton from '@components/ui/buttons/ThemedButton';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFetch } from '@core/hooks/useFetch';
import ThemedSelect from '@components/ui/inputs/ThemedSelect';
import ThemedInputError from '@components/ui/inputs/ThemedInputError';
import { useAuth } from '@core/hooks/useAuth';
import { ApiRoutes } from '@core/constants/ApiRoutes';
import { TCity, TSelectValues } from '@core/types/general.type';

type Props = ViewProps & {
  buttonText?: string;
  onSave: () => void;
  fetchProfile?: boolean;
};

const styles = StyleSheet.create({
  innerContainer: {
    width: '100%',
    gap: 16,
  }
});

const EditProfile: FC<Props> = ({ buttonText, onSave, fetchProfile, ...props }) => {
  const { t } = useTranslation();
  const { get, post, loading } = useFetch();
  const { user } = useAuth();

  const editProfileSchema = z.object({
    firstName: z.string().trim().min(3, { message: t('errors.minLength', { length: 3 }) }),
    lastName: z.string().trim().min(3, { message: t('errors.minLength', { length: 3 }) }),
    area: z.any(),
    address: z.string().trim().min(3, { message: t('errors.minLength', { length: 3 }) }),
  });
  type EditProfileFormType = z.infer<typeof editProfileSchema>;
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    trigger,
    reset,
  } = useForm<EditProfileFormType>({
    resolver: zodResolver(editProfileSchema),
  });

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

  useEffect(() => {
    console.log('register area');
    register('area');
  }, [register]);

  useEffect(() => {
    if (user && fetchProfile) {
      reset({
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        area: user.profile.areaId || '',
        address: user.profile.address || '',
      });
    }
  }, [user, reset, fetchProfile]);

  useEffect(() => {
    getCities();
  }, []);

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

        if (user && fetchProfile) {
          const userArea = user?.profile?.area;
          const userCityId = userArea?.cityId;

          if (userArea && userCityId) {
            const selectedCity = mappedCities.find(c => c._id === userCityId.toString());

            if (selectedCity) {
              setCities(prev => ({
                ...prev,
                value: selectedCity.value,
                selectedList: [selectedCity],
              }));

              get(ApiRoutes.location.areas(selectedCity._id)).subscribe({
                next: (areaResponse) => {
                  if (!areaResponse.data) return;

                  const areasData = areaResponse.data.areas;
                  const mappedAreas = areasData.map((item: any) => ({
                    _id: item.id.toString(),
                    value: item.name,
                  }));
                  const selectedArea = mappedAreas.find(a => a._id === userArea.id.toString());

                  if (selectedArea) {
                    setAreas({
                      value: selectedArea ? selectedArea.value : '',
                      list: mappedAreas,
                      selectedList: [selectedArea],
                      error: '',
                    });
                    setValue('area', selectedArea._id);
                  }
                  setAreaDisabled(false);
                },
                error: (error) => console.error('Error fetching areas for pre-population:', error),
              });
            }
          }
        }
      },
      error: (error) => console.error('Error fetching cities:', error),
    });
  }, [get, fetchProfile, user, setAreas, setCities, setValue]);

  const handleTextChange = useCallback((inputControl: any) => {
    trigger(inputControl).then();
  }, [trigger]);

  const onCityChange = useCallback((value: any) => {
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
              setValue('area', '', { shouldValidate: true });
              setAreaDisabled(false);
            }
          },
          error: (error) => {
            console.error('Error fetching areas:', error);
          },
        });
    }
  }, [cities, get, setAreas]);

  const onAreaChange = useCallback((value: any) => {
    console.log(value);
    setAreas({
      ...areas,
      value: value.text,
      selectedList: value.selectedList,
    });
    const selectedArea = value.selectedList[0];
    if (selectedArea) {
      console.log('setting area', selectedArea._id);
      setValue('area', selectedArea._id, {
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
  }, [areas, setAreas, setValue, trigger]);

  const onSubmit = useCallback((data: EditProfileFormType) => {
    // if (!isValid) return;
    console.log(data);
    const formData = {
      firstName: data.firstName,
      lastName: data.lastName,
      areaId: data.area,
      address: data.address,
    };

    post(ApiRoutes.user.update, formData)
      .subscribe({
        next: async (response) => {
          onSave();
        },
        error: (error) => {
          console.log('Error updating profile:', error);
        },
      })
  }, [isValid, post, onSave]);

  return (
    <View {...props}>
      <View style={styles.innerContainer}>
        <Controller
          control={control}
          name={'firstName'}
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
                  handleTextChange('firstName');
                }}
                value={value}
                error={!!error}
                label={t('general.firstName')}
                right={<TextInput.Icon
                  icon={({ size, color }) => (
                    <Feather name="user" size={size} color={color} />
                  )}
                />} />
              {errors.firstName && (
                <ThemedInputError text={errors.firstName?.message} />
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name={'lastName'}
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
                  handleTextChange('lastName');
                }}
                value={value}
                error={!!error}
                label={t('general.lastName')}
                right={<TextInput.Icon
                  icon={({ size, color }) => (
                    <Feather name="user" size={size} color={color} />
                  )}
                />} />
              {errors.lastName && (
                <ThemedInputError text={errors.lastName?.message} />
              )}
            </View>
          )}
        />

        <ThemedTextInput
          disabled={loading}
          readOnly={true}
          label={t('general.country')}
          value={t('general.syria')}
          left={<TextInput.Icon
            size={34}
            icon={({ size, color }) => (
              <SyriaFlag width={size} height={size} fill={color} />
            )}
          />}
          right={<TextInput.Icon
            icon={({ size, color }) => (
              <Feather name="chevron-down" size={size} color={color} />
            )}
          />} />

        <ThemedSelect
          disabled={loading}
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
                  handleTextChange('address');
                }}
                value={value}
                error={!!error}
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
          )}
        />

      </View>

      <ThemedButton
        disabled={!isValid || loading}
        loading={loading}
        onPress={handleSubmit(onSubmit)}
        buttonStyle={'secondary'}>{buttonText || t('general.continue')}</ThemedButton>
    </View>
  );
}

export default EditProfile;
