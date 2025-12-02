import { useEffect, useState } from 'react';
import { getApp } from '@react-native-firebase/app';
import { requestPermission, getToken } from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Config } from '@core/constants/Config';

export const useFirebase = () => {
  const [firebaseToken, setFirebaseToken] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(Config.firebaseTokenStoreKey)
      .then(async (token) => {
        if (token) {
          setFirebaseToken(token);
        } else {
          try {
            const firebaseApp = getApp();
            await requestPermission(firebaseApp.messaging())
            const fcmToken = await getToken(firebaseApp.messaging());
            await AsyncStorage.setItem(Config.firebaseTokenStoreKey, fcmToken);
            setFirebaseToken(fcmToken);
          } catch (e) {
            console.error('Firebase permission error', e);
          }
        }
      });
  }, []);

  return { firebaseToken };
}
