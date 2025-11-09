import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ar, en } from './locales/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { I18nManager } from 'react-native';

const STORE_LANGUAGE_KEY = 'settings.lang';

const RTL_LANGUAGES = ['ar'];

const languageDetectorPlugin: any = {
  type: 'languageDetector',
  async: true,
  init: () => {},
  detect: async function (callback: (lang: string) => void) {
    try {
      const storedLanguage = await AsyncStorage.getItem(STORE_LANGUAGE_KEY);
      let locale: string;

      if (storedLanguage) {
        locale = storedLanguage;
      } else {
        // locale = getLocales()[0]?.languageCode || 'en';
        locale = 'en';
      }

      const isRTL = RTL_LANGUAGES.includes(locale);

      I18nManager.forceRTL(isRTL);
      I18nManager.allowRTL(isRTL);

      return callback(locale);
    } catch (error) {
      console.log('Error reading language', error);
    }
  },
  cacheUserLanguage: async function (language: string) {
    try {
      await AsyncStorage.setItem(STORE_LANGUAGE_KEY, language);
    } catch (error) {}
  },
};
const resources = {
  ar: {
    translation: ar,
  },
  en: {
    translation: en,
  },
};

i18n
  .use(initReactI18next)
  .use(languageDetectorPlugin)
  .init({
    resources,
    compatibilityJSON: 'v4',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
