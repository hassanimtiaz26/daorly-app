import { Divider, List, Text } from 'react-native-paper';
import { TOrder, TOrderOffer, TOrderStatus } from '@core/types/order.type';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { FC, useEffect, useMemo, useState } from 'react';
import { Image } from 'expo-image';
import { RefreshControl, TouchableOpacity, View } from 'react-native';
import OrderListItem from '@components/orders/OrderListITem';
import { DateTime } from 'luxon';
import ServicesScreenShimmer from '@components/shimmers/ServicesScreenShimmer';
import { useDialog } from '@core/hooks/useDialog';
import { ApiRoutes } from '@core/constants/ApiRoutes';
import { useFetch } from '@core/hooks/useFetch';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import { t } from 'i18next';
import { useSnackbar } from '@core/hooks/useSnackbar';

type Props = {
  order: TOrder;
  onRefreshOrders: () => void;
}

const OrderItemClient: FC<Props> = ({ order, onRefreshOrders }) => {
  const { colors } = useAppTheme();
  const cancelableStatuses: TOrderStatus[] = useMemo(() => ['pending', 'waiting_confirmation'], []);
  const { showDialog } = useDialog();
  const snackbar = useSnackbar();

  const { post } = useFetch();
  const offers = useMemo(() => (
    order.offers && order.offers.filter((offer) => offer.status !== 'rejected') || []
  ), [order.offers]);

  const acceptedOffer: TOrderOffer | null = useMemo(() => (
    order.offers && order.offers.find((offer) => offer.status === 'accepted') || null
  ), [order.offers]);

  const onCancelOrder = (orderId: any) => {
    showDialog({
      variant: 'error',
      type: 'confirmation',
      title: 'Cancel Order',
      message: 'Are you sure you want to cancel this order?',
      onConfirm: () => {
        post(ApiRoutes.orders.cancel(orderId), { orderId })
          .subscribe({
            next: (response) => {
              if (response.success) {
                onRefreshOrders();
                snackbar.show({ message: response.message });
              }
            }
          })
      },
    })
  };

  const onAcceptOffer = (offerId: any) => {
    showDialog({
      variant: 'success',
      type: 'confirmation',
      title: 'Accept Offer',
      message: 'Are you sure you want to confirm this order?',
      onConfirm: () => {
        post(ApiRoutes.orders.acceptOffer(order.id, offerId), { offerId })
          .subscribe({
            next: (response) => {
              if (response.success) {
                onRefreshOrders();
                snackbar.show({ message: response.message });
              }
            }
          })
      },
    })
  }

  const address = useMemo(() => `${order.address}, ${order.area.name}, ${order.area.city.name}`, [order]);

  return (
    <List.Accordion
      style={{
        paddingVertical: 0,
        paddingHorizontal: 8,
        elevation: 3,
        borderRadius: 12,
        backgroundColor: colors.surface,
      }}
      title={order.service.name}
      description={order.description}
      descriptionNumberOfLines={1}
      titleNumberOfLines={1}
      left={props => (
        <Image
          style={{ width: 54, height: 54, borderRadius: 12 }}
          source={order.service.image ? { uri: order.service.image.media.url } : require('@/assets/images/placeholder.png')} />
      )}>
      <View style={{
        backgroundColor: colors.secondaryContainer,
        borderRadius: 12,
        elevation: 3,
        marginTop: 8,
        paddingVertical: 12,
        paddingLeft: 12,
        paddingRight: 12,
      }}>
        <OrderListItem text={order.service.name} icon={'build'} />
        <Divider style={{ marginVertical: 8 }} />
        <OrderListItem text={order.description} icon={'description'} />
        <Divider style={{ marginVertical: 8 }} />
        <OrderListItem text={DateTime.fromJSDate(new Date(order.scheduleAt)).toLocaleString()} icon={'calendar-month'} />
        <Divider style={{ marginVertical: 8 }} />
        <OrderListItem text={address} icon={'location-pin'} />

        {acceptedOffer && (
          <>
            <Divider style={{ marginVertical: 8 }} />
            <OrderListItem text={acceptedOffer.business.name} icon={'person'} />
            <Divider style={{ marginVertical: 8 }} />
            <OrderListItem text={acceptedOffer.message} icon={'description'} />
            <Divider style={{ marginVertical: 8 }} />
            <OrderListItem text={`$ ${acceptedOffer.price.toLocaleString('en-US')}`} icon={'attach-money'} />
            <Divider style={{ marginVertical: 8 }} />
            <OrderListItem text={acceptedOffer.phoneNumber} icon={'phone'} />
          </>
        )}

        {order.status === 'canceled' && (
          <>
            <Divider style={{ marginVertical: 8 }} />
            <OrderListItem text={order.cancellationReason || (order.cancelledBy === 'client' ? t('order.canceled.you') : t('order.canceled.provider'))} icon={'close'} />
          </>
        )}

        {cancelableStatuses.includes(order.status) && (
          <View style={{ marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                onCancelOrder(order.id);
              }}
              style={{
                backgroundColor: colors.errorContainer,
                borderRadius: 10,
                elevation: 3,
                padding: 6,
                flexDirection: 'row',
                gap: 4,
                alignItems: 'center',
              }}>
              <MaterialIcon
                color={colors.onErrorContainer}
                name={'close'}
                size={20} />
              <Text style={{ color: colors.onErrorContainer }}>{t('order.cancel.title')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {cancelableStatuses.includes(order.status) && offers.length > 0 && offers.map((offer) => (
        <View
          key={offer.id}
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            elevation: 3,
            marginTop: 8,
            paddingVertical: 12,
            paddingLeft: 12,
            paddingRight: 12,
          }}>
          <OrderListItem text={offer.business.name} icon={'person'} />
          <Divider style={{ marginVertical: 8 }} />
          <OrderListItem text={offer.message} icon={'description'} />
          <Divider style={{ marginVertical: 8 }} />
          <OrderListItem text={`$ ${offer.price.toLocaleString('en-US')}`} icon={'attach-money'} />

          {cancelableStatuses.includes(order.status) && (
            <View style={{ marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  onAcceptOffer(offer.id);
                }}
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 10,
                  elevation: 3,
                  padding: 6,
                  flexDirection: 'row',
                  gap: 4,
                  alignItems: 'center',
                }}>
                <MaterialIcon
                  color={colors.onPrimary}
                  name={'check'}
                  size={20} />
                <Text style={{ color: colors.onPrimary }}>{t('order.offer.accept')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
    </List.Accordion>
  );
}

export default OrderItemClient;
