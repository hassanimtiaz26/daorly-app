export type TUser = {
  id: number;
  f_name: string;
  l_name: string;
  mobile: string;
  unread_notify: number;
  role: 'client' | 'provider';
  is_blocked: boolean;
  is_business_account_exist: boolean;
  is_personal_profile_completed: boolean;
}
