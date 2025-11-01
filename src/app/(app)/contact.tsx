import ThemedHeader from '@components/ui/elements/ThemedHeader';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useFetch } from '@core/hooks/useFetch';
import { ApiRoutes } from '@core/constants/ApiRoutes';
import { Text } from 'react-native-paper';
import WebView from 'react-native-webview';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import ThemedButton from '@components/ui/buttons/ThemedButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import FacebookIcon from '@/assets/icons/facebook.svg';
import InstagramIcon from '@/assets/icons/instagram.svg';
import YouTubeIcon from '@/assets/icons/youtube.svg';
import TikTokIcon from '@/assets/icons/tiktok.svg';

const createStyles = (colors: MD3Colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContentContainer: {
    gap: 12,
  },
  innerContentContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  title: {
    color: colors.onPrimary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

type PageScreenParams = {
  name: string;
}

const ContactScreen = () => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { canGoBack, back, replace } = useRouter();

  return (
    <ScrollView
      style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
      <ThemedHeader>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24, }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              if (canGoBack()) {
                back();
              }
            }}>
            <Feather
              name={'arrow-left-circle'} size={24} color={colors.onPrimary} />
          </TouchableOpacity>

          <Text variant={'titleMedium'} style={styles.title}>Contact Us</Text>
        </View>
      </ThemedHeader>

      <View style={styles.innerContentContainer}>
        <View style={{
          width: '80%',
          marginHorizontal: 'auto',
          borderRadius: 8,
          elevation: 2,
          backgroundColor: colors.surface,
          padding: 20,
          gap: 20,
          alignItems: 'center'
        }}>
          <View style={{ gap: 6 }}>
            <Text style={{ fontWeight: 'bold' }} variant={'titleLarge'}>Contact Information</Text>
            <Text variant={'bodySmall'}>Say something to start a live chat!</Text>
          </View>

          <View style={{ alignItems: 'center', gap: 6 }}>
            <MaterialIcon name={'phone'} size={24} />
            <Text>+1012 3456 789</Text>
          </View>

          <View style={{ alignItems: 'center', gap: 6 }}>
            <MaterialIcon name={'email'} size={24} />
            <Text>info@daorly.com</Text>
          </View>

          <View style={{ alignItems: 'center', gap: 6, maxWidth: 200 }}>
            <MaterialIcon name={'location-pin'} size={24} />
            <Text style={{ textAlign: 'center' }}>132 Dartmouth Street Boston, Massachusetts 02156 United States</Text>
          </View>
        </View>

        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <ThemedButton style={{ width: 200 }}>
            <View style={{ alignItems: 'center', flexDirection: 'row', gap: 6 }}>
              <MaterialCommunityIcons name={'whatsapp'} size={24} color={colors.onPrimary} />
              <Text style={{ color: colors.onPrimary, fontWeight: 'bold' }} variant={'titleMedium'}>Send Message</Text>
            </View>
          </ThemedButton>
        </View>

        <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <FacebookIcon />
          <InstagramIcon />
          <YouTubeIcon />
          <TikTokIcon />
        </View>
      </View>
    </ScrollView>
  )
};

export default ContactScreen;
