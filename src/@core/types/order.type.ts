import { TMediaAttachment } from '@core/types/media.type';
import { TBusinessAccount, TUser } from '@core/types/user.type';
import { TService } from '@core/types/service.type';
import { TArea } from '@core/types/general.type';

export type TOrder = {
  id: number;
  userId: number;
  businessId?: number;
  serviceId: number;
  areaId: number;
  description: string;
  scheduleAt: Date;
  status: TOrderStatus;
  useDefaultDetails: boolean;
  phoneNumber: string;
  address: string;
  cancelledBy?: 'client' | 'provider' | null;
  cancellationReason?: string;
  cancelledAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  images: TMediaAttachment[];
  user: TUser;
  business?: TBusinessAccount;
  service: TService;
  area: TArea;
  businessOffer?: TOrderOffer;
  offers?: TOrderOffer[];
}

export type TOrderStatus = 'pending' | 'waiting_confirmation' | 'confirmed' | 'canceled' | 'done';
export type TOfferStatus = 'pending' | 'accepted' | 'rejected';

export type TOrderStatusItem = {
  key: TOrderStatus;
  label: string;
  icon: any;
};

export type TOrderOffer = {
  id: number;
  orderId: number;
  businessId: number;
  price: number;
  message: string;
  phoneNumber: string;
  status: TOfferStatus;
  createdAt: Date;
  updatedAt: Date;
  business: TBusinessAccount;
};
