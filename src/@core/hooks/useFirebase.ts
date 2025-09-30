import { useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
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
            await messaging().requestPermission()
            const fcmToken = await messaging().getToken();
            setFirebaseToken(fcmToken);
          } catch (e) {
            console.error('Firebase permission error', e);
          }
        }
      });
  }, []);

  return { firebaseToken };
}
