export type TDeviceParams = {
  operatingSystem: string;
  version: string;
  brand: string;
  type: string;
  model: string;
  appVersion: string;
};

export type TLoginParams = {
  phoneNumber: string;
  password: string;
  firebaseToken: string;
};

export type TRegisterParams = TLoginParams & {
  isProvider: boolean;
};
