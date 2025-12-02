import { TArea } from '@core/types/general.type';
import { TService } from '@core/types/service.type';
import { TCategory } from '@core/types/category.type';
import { TSubscription } from '@core/types/subscription.type';

export type TUser = {
  id: number;
  phoneNumber: string;
  role: 'client' | 'provider';
  blockedAt: string;
  verifiedAt: boolean;
  profileCompletedAt: boolean;
  businessAccountCompletedAt: boolean;
  unreadNotificationCount: number;
  profile: TUserProfile;
  subscription: TSubscription;
  businessAccounts?: TBusinessAccount[];
}

export type TUserProfile = {
  id: number;
  areaId: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  balance: number;
  area: TArea;
}

export type TBusinessAccount = {
  id: number;
  name: string;
  services: TCategory[];
  categories: TCategory[];
  areas: TArea[];
  user: TUser;
}

export type TUserTransaction = {
  id: number;
  description: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}
