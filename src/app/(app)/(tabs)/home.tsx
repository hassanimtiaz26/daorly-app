import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, FAB, Text } from 'react-native-paper';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { useAppTheme } from '@core/hooks/useAppTheme';
import ThemedSearchBar from '@components/ui/inputs/ThemedSearchBar';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import HomeSlider from '@components/ui/home/HomeSlider';
import HomeCategoryCarousel from '@components/ui/home/HomeCategoryCarousel';
import { useFetch } from '@core/hooks/useFetch';
import { useTranslation } from 'react-i18next';
import { Link, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import ThemedCard from '@components/ui/elements/ThemedCard';
import ThemedHeader from '@components/ui/elements/ThemedHeader';
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from '@core/hooks/useAuth';
import ThemedIconButton from '@components/ui/buttons/ThemedIconButton';
import HomeScreenShimmer from '@components/shimmers/HomeScreenShimmer';

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

export default function HomeScreen() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { get, loading } = useFetch();
  const { navigate, push } = useRouter();
  const { user, logout } = useAuth();

  const [refreshing, setRefreshing] = useState(false);
  const [sliderData, setSliderData] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [subCategories, setSubCategories] = useState<any>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(() => {
    get('client/home').subscribe({
      next: (response) => {
        if (response && 'data' in response) {
          const data = response.data;
          if ('sliders' in data) {
            setSliderData(data.sliders);
          }
          if ('main_categories' in data) {
            setCategories(data.main_categories);
          }
          if ('sub_categories' in data) {
            setSubCategories(data.sub_categories);
          }
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
            <Text style={{ color: colors.onPrimary }} variant={'bodyMedium'}>{user.address}</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <FAB
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
              icon={({ size, color }) => <Feather name={'log-out'} size={size} color={color} />} />

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
                  {subCategories.map((item: any) => (
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
                        <Image style={{ width: '100%', height: '100%' }} contentFit={'cover'} source={item.image} />
                      </View>
                      <Text style={{ alignItems: 'center' }} variant={'bodySmall'}>{item.name}</Text>
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

