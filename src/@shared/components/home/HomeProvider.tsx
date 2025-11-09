import { Pressable, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { useFetch } from '@core/hooks/useFetch';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAuth } from '@core/hooks/useAuth';
import { TMainSlider } from '@core/types/general.type';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { TCategory } from '@core/types/category.type';
import { TOrder } from '@core/types/order.type';
import { ApiRoutes } from '@core/constants/ApiRoutes';
import Feather from '@expo/vector-icons/Feather';
import { Badge, Divider, List, Text } from 'react-native-paper';
import ThemedHeader from '@components/ui/elements/ThemedHeader';
import HomeSlider from '@components/home/HomeSlider';
import OrderItemProvider from '@components/orders/OrderItemProvider';
import { useDrawer } from '@core/hooks/useDrawer';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NotificationButton from '@components/ui/NotificationButton';

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

type TProviderHomeResponse = {
  sliders: TMainSlider[];
  orders: TOrder[];
}

const HomeProvider = () => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { get, loading } = useFetch();
  const { navigate, push } = useRouter();
  const { user, logout } = useAuth();

  const [refreshing, setRefreshing] = useState(false);
  const [sliderData, setSliderData] = useState<TMainSlider[]>([]);
  const [orders, setOrders] = useState<TOrder[]>([]);
  const drawer = useDrawer();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(() => {
    get(ApiRoutes.provider.home).subscribe({
      next: (response) => {
        if (response && 'data' in response) {
          const data: TProviderHomeResponse = response.data;
          setSliderData(data.sliders);
          setOrders(data.orders);
        }
      },
      complete: () => {
        setRefreshing(false);
      }
    })
  }, [setSliderData, setOrders, get]);

  // useFocusEffect(
  //   useCallback(() => {
  //     loadData();
  //     return () => {};
  //   }, [loadData])
  // );

  const onRefreshData = () => {
    setRefreshing(true);
    loadData();
  };

  const getOrders = () => {}

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
            <NotificationButton />
            <Feather
              onPress={() => drawer.open()}
              name={'menu'} size={24} color={colors.onPrimary} />
          </View>
        </View>

        <View style={{ paddingHorizontal: 6 }}>
          <Text
            style={{ color: colors.onPrimary }}
            variant={'titleLarge'}>{t('general.hello')} <Text style={{ fontWeight: 'bold', color: colors.onPrimary }}>{user.profile.firstName}</Text></Text>
        </View>
      </ThemedHeader>

      {
        sliderData.length > 0 && (
          <View style={[styles.innerContentContainer]}>
            <HomeSlider data={sliderData} />
          </View>
        )
      }

      {
        orders.length > 0 && (
          <View style={{ marginTop: 12 }}>
            <View style={{ paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MaterialCommunityIcons name={'clipboard-text-outline'} size={20} />
              <Text variant={'titleMedium'}>{t('general.newOrders')}</Text>
            </View>
            <List.Section style={{ paddingHorizontal: 20, gap: 10 }}>
              {orders.map((order) => (
                <OrderItemProvider
                  hasIcon={true}
                  key={order.id}
                  order={order}
                  onRefreshOrders={() => loadData()} />
              ))}
            </List.Section>
          </View>
        )
      }
    </ScrollView>
  );
};

export default HomeProvider;
