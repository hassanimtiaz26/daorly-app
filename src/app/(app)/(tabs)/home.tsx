import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { useAppTheme } from '@core/hooks/useAppTheme';
import ThemedSearchBar from '@components/ui/inputs/ThemedSearchBar';
import { useCallback, useEffect, useState } from 'react';
import HomeSlider from '@components/home/HomeSlider';
import HomeCategoryCarousel from '@components/home/HomeCategoryCarousel';
import { useFetch } from '@core/hooks/useFetch';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import ThemedCard from '@components/ui/elements/ThemedCard';
import ThemedHeader from '@components/ui/elements/ThemedHeader';
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from '@core/hooks/useAuth';
import HomeScreenShimmer from '@components/shimmers/HomeScreenShimmer';
import { useDialog } from '@core/hooks/useDialog';
import ThemedButton from '@components/ui/buttons/ThemedButton';
import { TCategory } from '@core/types/category.type';
import { TMainSlider } from '@core/types/general.type';

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
  },
  header: {
    paddingBottom: 48,
    marginBottom: -40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawerContainer: {
    height: '100%',
    width: '80%',
    maxWidth: 300,
    paddingTop: 50,
  },
});

type THomeResponse = {
  sliders: TMainSlider[];
  categories: TCategory[];
  subCategories: TCategory[];
  orders: any[];
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { get, loading } = useFetch();
  const { navigate, push } = useRouter();
  const { user, logout } = useAuth();

  const [refreshing, setRefreshing] = useState(false);
  const [sliderData, setSliderData] = useState<TMainSlider[]>([]);
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [subCategories, setSubCategories] = useState<TCategory[]>([]);

  const { showDialog } = useDialog();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(() => {
    get('client/home').subscribe({
      next: (response) => {
        if (response && 'data' in response) {
          const data: THomeResponse = response.data;
          setSliderData(data.sliders);
          setCategories(data.categories);
          setSubCategories(data.subCategories);
        }
      },
      complete: () => {
        setRefreshing(false);
      }
    })
  }, [get]);

  const onRefreshData = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData, setRefreshing]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefreshData}
        />
      }
      style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
      <ThemedHeader style={styles.header}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
          paddingHorizontal: 6,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Feather name={'map-pin'} size={24} color={colors.onPrimary} />
            <Text style={{ color: colors.onPrimary }} variant={'bodyMedium'}>{user.profile.address}</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <Feather
              onPress={() => {
                navigate('/(app)/notifications')
              }}
              name={'bell'} size={24} color={colors.onPrimary} />
            <Feather
              onPress={() => logout()}
              name={'log-out'} size={24} color={colors.onPrimary} />
            {/*<FAB
              mode={'flat'}
              variant={'surface'}
              size={'small'}
              onPress={() => {
                navigate('/(app)/notifications')
              }}
              icon={({ size, color }) => <Feather name={'bell'} size={size} color={color} />} />

            <FAB
              mode={'flat'}
              variant={'surface'}
              size={'small'}
              onPress={() => logout()}
              icon={({ size, color }) => <Feather name={'log-out'} size={size} color={color} />} />*/}
          </View>
        </View>

        <ThemedSearchBar  />
      </ThemedHeader>

      { loading ? <HomeScreenShimmer /> : (
        <>
          {
            sliderData.length > 0 && (
              <View style={[styles.innerContentContainer]}>
                <HomeSlider data={sliderData} />
              </View>
            )
          }

          {/*<ThemedButton onPress={() => {
            showDialog({
              variant: 'error',
              title: t('general.welcome'),
              message: t('dialog.welcomeMessage', { name: user.name }),
            })
          }}>Open Dialog</ThemedButton>*/}

          {
            categories.length > 0 && (
              <View style={[styles.innerContentContainer]}>
                <HomeCategoryCarousel data={categories} />
              </View>
            )
          }

          {
            subCategories.length > 0 && (
              <View style={[styles.innerContentContainer, { paddingHorizontal: 20, paddingBottom: 20, gap: 8 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ color: colors.secondary }} variant={'titleLarge'}>{t('general.services')}</Text>
                  <Pressable onPress={() => {
                    push({
                      pathname: '/(app)/services',
                      params: { type: 'categories' },
                    })
                  }}>
                    <Text style={{ color: colors.outline }}>{t('general.viewAll')}</Text>
                  </Pressable>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, }}>
                  {subCategories.map((item: TCategory) => (
                    <ThemedCard
                      onPress={() => {
                        push({
                          pathname: '/(app)/services',
                          params: { type: 'services', subCategory: item.id },
                        })
                      }}
                      style={{
                        width: '31%',
                        aspectRatio: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 14,
                        gap: 10,
                      }}
                      key={item.id}>

                      <View style={{ width: 60, height: 60, borderRadius: 12, overflow: 'hidden' }}>
                        <Image style={{ width: '100%', height: '100%' }} contentFit={'cover'} source={item.image.media.url} />
                      </View>
                      <Text style={{ alignItems: 'center', textAlign: 'center' }} variant={'bodySmall'}>{item.name}</Text>
                    </ThemedCard>
                  ))}
                </View>

              </View>
            )
          }
        </>
      ) }
    </ScrollView>
  );
}

