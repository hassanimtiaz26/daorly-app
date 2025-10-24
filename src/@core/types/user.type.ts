import { TArea } from '@core/types/general.type';
import { TService } from '@core/types/service.type';

export type TUser = {
  id: number;
  phoneNumber: string;
  role: 'client' | 'provider';
  blockedAt: string;
  verifiedAt: boolean;
  profileCompletedAt: boolean;
  businessAccountCompletedAt: boolean;
  profile: TUserProfile;
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
  area: TArea;
}

export type TBusinessAccount = {
  id: number;
  name: string;
  services: TService[];
  areas: TArea[];
  user: TUser;
}
