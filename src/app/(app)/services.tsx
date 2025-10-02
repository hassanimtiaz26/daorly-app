import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import ThemedSearchBar from '@components/ui/inputs/ThemedSearchBar';
import ThemedBackButton from '@components/ui/buttons/ThemedBackButton';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useFetch } from '@core/hooks/useFetch';
import { TCategory } from '@core/types/category.type';
import { TService } from '@core/types/service.type';
import { ActivityIndicator, Text } from 'react-native-paper';
import ThemedCard from '@components/ui/elements/ThemedCard';
import { Image } from 'expo-image';
import { Href } from 'expo-router/build/types';
import ThemedCloseButton from '@components/ui/buttons/ThemedCloseButton';
import ThemedHeader from '@components/ui/elements/ThemedHeader';
import ServicesScreenShimmer from '@components/shimmers/ServicesScreenShimmer';
import { useBottomSheet } from '@core/hooks/useBottomSheet';
import ServiceDetail from '@components/services/ServiceDetail';

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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

type ServiceScreenParams = {
  subCategory?: string;
  type?: 'services' | 'categories';
  searchQuery?: string;
}

const ServicesScreen = () => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { push } = useRouter();

  const { get, loading } = useFetch();
  const { subCategory, type, searchQuery } = useLocalSearchParams<ServiceScreenParams>();
  const [autoFocus, setAutoFocus] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [items, setItems] = useState<Array<TCategory | TService>>([]);

  const bottomSheet = useBottomSheet();

  useEffect(() => {
    console.log('subCategory', subCategory);
    console.log('type', type);
    switch (type) {
      case 'services':
        fetchServices();
        break;
      case 'categories':
        fetchCategories();
        break;
    }
  }, [subCategory, type]);

  const fetchServices = useCallback(() => {
    let url = 'client/home/services';
    if (searchQuery) {
      url += `?search_value=${encodeURIComponent(searchQuery)}`;
    } else if (subCategory) {
      url += `?sub_category_id=${subCategory}`;
    }

    get(url).subscribe({
        next: (response) => {
          if (response && 'data' in response) {
            setItems(response.data as TService[]);
          }
        },
        complete: () => {
          setRefreshing(false);
        }
      });
  }, [get, setItems, setRefreshing]);

  const fetchCategories = useCallback(() => {
    get('client/home').subscribe({
      next: (response) => {
        if (response && 'data' in response) {
          const data = response.data;
          if ('sub_categories' in data) {
            setItems(data.sub_categories as TCategory[]);
          }
        }
      },
      complete: () => {
        setRefreshing(false);
      }
    });
  }, [get, setItems, setRefreshing]);

  const onRefreshData = useCallback(() => {
    setRefreshing(true);

    switch (type) {
      case 'services':
        fetchServices();
        break;
      case 'categories':
        fetchCategories();
        break;
    }
  }, [setRefreshing, type]);

  const onServicePress = useCallback((item: TCategory | TService) => {
    if (type === 'categories') {
      push({
        pathname: '/(app)/services',
        params: { type: 'services', subCategory: item.id }
      });
      return;
    }

    if (type === 'services') {
      bottomSheet.open(<ServiceDetail service={item as TService} />)
    }
  }, [bottomSheet, type, push]);

  const renderItems = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.innerContentContainer}>
          <ServicesScreenShimmer />
        </View>
      );
    }

    if (items.length > 0) {

      return (
        <View style={styles.innerContentContainer}>
          {items.map((item, index) => {
            let sourceImage = null;

            if ('images' in item && item.images.length > 0) {
              sourceImage = { uri: item.images[0] };
            } else if ('image' in item && item.image) {
              sourceImage = { uri: item.image };
            } else {
              sourceImage = require('@/assets/images/placeholder.png');
            }

            return (
              <ThemedCard
                onPress={() => onServicePress(item)}
                key={index}
                style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ height: 56, width: 56, borderRadius: 8, overflow: 'hidden' }}>
                  <Image
                    style={{ height: '100%', width: '100%' }}
                    contentFit={'fill'}
                    source={sourceImage} />
                </View>
                <View style={{ flex: 1, padding: 8, gap: 4 }}>
                  <Text variant={'titleMedium'}>{item.name}</Text>
                  <Text style={{ color: colors.onSurfaceVariant  }} variant={'bodySmall'} numberOfLines={1}>{item.description}</Text>
                </View>
              </ThemedCard>
            )
          })}
        </View>
      );
    }

    return null;
  }, [items, loading]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefreshData}
        />
      }
      style={styles.container} contentContainerStyle={styles.scrollContentContainer}>

      <ThemedHeader style={{ flexDirection: 'row', alignItems: 'center', gap: 8}}>
        {/*<ThemedBackButton />*/}

        <ThemedSearchBar
          style={{ flex: 1 }}
          autoFocus={autoFocus}
          replaceSearch={true} />

        <ThemedCloseButton />
      </ThemedHeader>

      {renderItems()}

    </ScrollView>
  );
}

export default ServicesScreen;
