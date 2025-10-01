import { TArea } from '@core/types/general.type';
import { TService } from '@core/types/service.type';

export type TUser = {
  id: number;
  f_name: string;
  l_name: string;
  mobile: string;
  unread_notify: number;
  role: 'client' | 'provider';
  address: string;
  area: TArea;
  is_blocked: boolean;
  is_business_account_exist: boolean;
  is_personal_profile_completed: boolean;
  business_accounts?: TBusinessAccount[];
}

export type TBusinessAccount = {
  id: number;
  name: string;
  services: TService[];
  areas: TArea[];
}
