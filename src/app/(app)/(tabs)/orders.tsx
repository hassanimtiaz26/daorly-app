import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { Divider, List, Text } from 'react-native-paper';
import ThemedSearchBar from '@components/ui/inputs/ThemedSearchBar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ThemedHeader from '@components/ui/elements/ThemedHeader';
import { Image } from 'expo-image';
import { useFetch } from '@core/hooks/useFetch';
import { ApiRoutes } from '@core/constants/ApiRoutes';
import { TOrder, TOrderStatus, TOrderStatusItem } from '@core/types/order.type';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import ServicesScreenShimmer from '@components/shimmers/ServicesScreenShimmer';
import { DateTime } from 'luxon';
import ThemedButton from '@components/ui/buttons/ThemedButton';
import { useTranslation } from 'react-i18next';
import { useDialog } from '@core/hooks/useDialog';
import OrderItem from '@components/orders/OrderItem';

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
});



export default function OrderScreen() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const { get, post, loading } = useFetch();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statuses, setStatuses] = useState<TOrderStatusItem[]>([
    { key: 'pending', label: 'Pending', icon: 'schedule' },
    { key: 'waiting_confirmation', label: 'Waiting Confirmation', icon: 'hourglass-top' },
    { key: 'confirmed', label: 'Confirmed', icon: 'check-circle-outline' },
    { key: 'canceled', label: 'Canceled', icon: 'cancel' },
    { key: 'done', label: 'Done', icon: 'check' },
  ]);
  const [status, setStatus] = useState<TOrderStatus>('pending');
  const [orders, setOrders] = useState<TOrder[]>([]);
  const { showDialog } = useDialog();

  useEffect(() => {
    getOrders();
  }, [status]);

  const getOrders = useCallback(() => {
    setIsLoading(true);
    get(ApiRoutes.orders.withStatus(status))
      .subscribe({
        next: (response) => {
          console.log('response', response);
          if (response.success) {
            setOrders(response.data.orders);
          }
        },
        complete: () => {
          setRefreshing(false);
          setIsLoading(false);
        }
      });
  }, [status, setIsLoading]);

  const onRefreshData = useCallback(() => {
    setRefreshing(true);
    getOrders();
  }, [setRefreshing]);



  const renderItems = () => {
    if (isLoading) {
      return (
        <View style={{ paddingHorizontal: 20, gap: 10, marginTop: 10 }}>
          <ServicesScreenShimmer />
        </View>
      );
    }

    if (orders && orders.length > 0) {
      return (
        <List.Section style={{ paddingHorizontal: 20, gap: 10 }}>
          {orders.map((order) => (
            <OrderItem
              key={order.id}
              order={order}
              onRefreshOrders={() => getOrders()} />
          ))}
        </List.Section>
      );
    }

    return (
      <View style={{ paddingHorizontal: 20, marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>
        <Text>No orders found...</Text>
      </View>
    )
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefreshData}
        />
      }
      style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
      <ThemedHeader>
        <ThemedSearchBar  />
      </ThemedHeader>

      <View style={styles.innerContentContainer}>

        <ScrollView
          horizontal={true}
          contentContainerStyle={{
            gap: 16,
            paddingHorizontal: 20,
          }}
          style={{
            paddingVertical: 8,
            height: 'auto',
          }}>
          {statuses && statuses.map((item, index) => (
            <TouchableOpacity
              key={item.key}
              activeOpacity={0.9}
              onPress={() => {
                setStatus(item.key);
              }}>
              <View style={{
                backgroundColor: item.key === status ? colors.primary : colors.surface,
                borderRadius: 10,
                elevation: 3,
                padding: 6,
                flexDirection: 'row',
                gap: 4,
                alignItems: 'center',
              }}>
                <MaterialIcon
                  color={item.key === status ? colors.onPrimary : colors.onSurface}
                  name={item.icon}
                  size={16} />
                <Text style={{ color: item.key === status ? colors.onPrimary : colors.onSurface }}>{item.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {renderItems()}
      </View>
    </ScrollView>
  );
}
