import { TOrder } from '@core/types/order.type';

export type TNotification = {
  id: number;
  data: TNotificationData;
  readAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TNotificationData = {
  title: string;
  message: string;
  action: string;
  icon: any;
  order: TOrder;
}
