import { Divider, List, Text } from 'react-native-paper';
import { TOrder, TOrderOffer, TOrderStatus } from '@core/types/order.type';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { FC, useMemo, useState } from 'react';
import { Image } from 'expo-image';
import { TouchableOpacity, View } from 'react-native';
import OrderListItem from '@components/orders/OrderListITem';
import { DateTime } from 'luxon';
import { useDialog } from '@core/hooks/useDialog';
import { ApiRoutes } from '@core/constants/ApiRoutes';
import { useFetch } from '@core/hooks/useFetch';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import { t } from 'i18next';
import { useSnackbar } from '@core/hooks/useSnackbar';
import { useBottomSheet } from '@core/hooks/useBottomSheet';
import OrderAcceptContent from './OrderAcceptContent';
import OrderCancelContent from '@components/orders/OrderCancelContent';

type Props = {
  order: TOrder;
  onRefreshOrders: () => void;
  hasIcon?: boolean;
}

const OrderItemProvider: FC<Props> = ({ order, onRefreshOrders, hasIcon }) => {
  const { colors } = useAppTheme();
  const editableStatuses: TOrderStatus[] = useMemo(() => ['pending', 'waiting_confirmation'], []);
  const { showDialog } = useDialog();
  const { open } = useBottomSheet();
  const snackbar = useSnackbar();

  const { post } = useFetch();
  const offers = useMemo(() => (
    order.offers && order.offers.filter((offer) => offer.status !== 'rejected') || []
  ), [order.offers]);

  const acceptedOffer: TOrderOffer | null = useMemo(() => (
    order.offers && order.offers.find((offer) => offer.status === 'accepted') || null
  ), [order.offers]);

  const onCancelOrder = () => {
    open(
      <OrderCancelContent
        order={order}
        onCancelOrder={(response) => {
          onRefreshOrders();
          snackbar.show({ message: response.message });
        }}
      />
    );
  };

  const onAcceptOrder = () => {
    open(
      <OrderAcceptContent
        order={order}
        onAcceptOrder={(response) => {
          onRefreshOrders();
          snackbar.show({ message: response.message });
        }}
      />
    );
  }

  const onCompleteOrder = () => {
    showDialog({
      variant: 'success',
      type: 'confirmation',
      title: t('order.complete.title'),
      message: t('order.complete.message'),
      onConfirm: () => {
        post(ApiRoutes.orders.completeOrder(order.id), { orderId: order.id })
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

  const onRejectOrder = () => {
    showDialog({
      variant: 'error',
      type: 'confirmation',
      title: t('order.reject.title'),
      message: t('order.reject.message'),
      onConfirm: () => {
        post(ApiRoutes.orders.rejectOrder(order.id), { orderId: order.id })
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

  const onEditOffer = () => {
    open(
      <OrderAcceptContent
        order={order}
        offer={order.businessOffer}
        onAcceptOrder={(response) => {
          onRefreshOrders();
          snackbar.show({ message: response.message });
        }}
      />
    )
  }

  const address = useMemo(() => `${order.address}, ${order.area.name}, ${order.area.city.name}`, [order]);

  const renderImage = (props) => {
    if (hasIcon) {
      return null;
    }

    return (
      <Image
        style={{ width: 54, height: 54, borderRadius: 12 }}
        source={order.service.image ? { uri: order.service.image.media.url } : require('@/assets/images/placeholder.png')} />
    );
  };

  const renderTitle = () => {
    if (hasIcon) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          {order.businessOffer ? <MaterialIcon name={'hourglass-top'} size={18} /> : <MaterialIcon name={'schedule'} size={18} />}
          <Text>{order.service.name}</Text>
        </View>
      )
    }

    return <Text>{order.service.name}</Text>;
  }

  return (
    <List.Accordion
      style={{
        paddingVertical: 0,
        paddingHorizontal: 8,
        elevation: 3,
        borderRadius: 12,
        backgroundColor: colors.surface,
      }}
      titleStyle={{ paddingBottom: 4 }}
      title={renderTitle()}
      description={order.description}
      descriptionNumberOfLines={1}
      titleNumberOfLines={1}
      left={renderImage}>
      <View style={{
        backgroundColor: colors.secondaryContainer,
        borderRadius: 12,
        elevation: 3,
        marginTop: 8,
        paddingVertical: 12,
        paddingLeft: 12,
        paddingRight: 12,
      }}>

        {
          ['confirmed', 'done', 'canceled'].includes(order.status) ?
            <OrderListItem text={order.user.profile.firstName} icon={'person'} /> :
            <OrderListItem text={order.service.name} icon={'build'} />
        }

        <Divider style={{ marginVertical: 8 }} />
        <OrderListItem text={order.description} icon={'description'} />
        <Divider style={{ marginVertical: 8 }} />
        <OrderListItem text={DateTime.fromJSDate(new Date(order.scheduleAt)).toLocaleString()} icon={'calendar-month'} />
        <Divider style={{ marginVertical: 8 }} />
        <OrderListItem text={address} icon={'location-pin'} />
        {['confirmed', 'done', 'canceled'].includes(order.status) && (
          <>
            <Divider style={{ marginVertical: 8 }} />
            <OrderListItem text={order.user.phoneNumber} icon={'phone'} />
          </>
        )}

        {'businessOffer' in order && order.businessOffer && (
          <>
            <Divider style={{ marginVertical: 12 }} bold={true} />
            <OrderListItem text={order.businessOffer.message} icon={'description'} />
            <Divider style={{ marginVertical: 8 }} />
            <OrderListItem text={order.businessOffer.price.toLocaleString('en-US') + ' SP'} icon={'attach-money'} />
            <Divider style={{ marginVertical: 8 }} />
            <OrderListItem text={order.businessOffer.phoneNumber} icon={'phone'} />

            {editableStatuses.includes(order.status) && (
              <View style={{ marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => {
                    onEditOffer();
                  }}
                  style={{
                    backgroundColor: colors.surfaceVariant,
                    borderRadius: 10,
                    elevation: 3,
                    padding: 6,
                    flexDirection: 'row',
                    gap: 4,
                    alignItems: 'center',
                  }}>
                  <MaterialIcon
                    color={colors.onSurfaceVariant}
                    name={'edit'}
                    size={20} />
                  <Text style={{ color: colors.onSurfaceVariant }}>{t('order.offer.edit')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {order.status === 'canceled' && (
          <>
            <Divider style={{ marginVertical: 8 }} />
            <OrderListItem text={order.cancellationReason || (order.cancelledBy === 'provider' ? t('order.canceled.you') : t('order.canceled.client'))} icon={'close'} />
          </>
        )}

        {editableStatuses.includes(order.status) && !order.businessOffer && (
          <View style={{ flexDirection: 'row', gap: 24, marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                onRejectOrder();
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
              <Text style={{ color: colors.onErrorContainer }}>{t('general.reject')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                onAcceptOrder();
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
              <Text style={{ color: colors.onPrimary }}>{t('general.accept')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {order.status === 'confirmed' && (
          <View style={{ flexDirection: 'row', gap: 24, marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                onCancelOrder();
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

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                onCompleteOrder();
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
              <Text style={{ color: colors.onPrimary }}>{t('order.complete.title')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </List.Accordion>
  );
}

export default OrderItemProvider;
