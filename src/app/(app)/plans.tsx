import ThemedHeader from '@components/ui/elements/ThemedHeader';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { useRouter } from 'expo-router';
import { Text } from 'react-native-paper';
import { useAuth } from '@core/hooks/useAuth';
import { FC, useEffect, useMemo, useState } from 'react';
import Carousel, { CarouselRenderItem } from 'react-native-reanimated-carousel';
import PlanItem from '@components/plan/PlanItem';
import { TPlan } from '@core/types/plan.type';
import { useFetch } from '@core/hooks/useFetch';
import { ApiRoutes } from '@core/constants/ApiRoutes';
import ThemedButton from '@components/ui/buttons/ThemedButton';
import { DateTime } from 'luxon';

const createStyles = (colors: MD3Colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  innerContentContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.surface,
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

const window = Dimensions.get('screen');

const PlansScreen = () => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { canGoBack, back, navigate } = useRouter();
  const { setUser, user } = useAuth();
  const [plans, setPlans] = useState<TPlan[]>([]);
  const { get } = useFetch();

  useEffect(() => {
    get(ApiRoutes.subscriptions.plans)
      .subscribe({
        next: (response) => {
          if (response && 'data' in response) {
            setPlans(response.data.plans);
          }
        }
      })
  }, []);

  return (
    <ScrollView
      style={styles.container}>
      <ThemedHeader>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, }}>
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

          <Text variant={'titleLarge'} style={styles.title}>Hello {user.profile.firstName}!</Text>
        </View>
      </ThemedHeader>

      <View style={{ padding: 32, gap: 10 }}>
        <Text style={{ fontWeight: 'bold', textAlign: 'center' }} variant={'headlineMedium'}>Pick a plan that's right for your business</Text>
        <Text style={{ textAlign: 'center' }}>Pricing prices for businesses at every stage of growth</Text>
      </View>

      {user.subscription ? (
        <View style={{ paddingHorizontal: 32 }}>
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            elevation: 3,
            padding: 32,
            gap: 14,
            alignItems: 'center',
            minHeight: 450,
          }}>
            <Text variant={'titleSmall'}>POPULAR</Text>
            <Text style={{ fontWeight: 'bold' }} variant={'titleLarge'}>{user.subscription.plan.name}</Text>
            <Text style={{ fontWeight: 'bold' }} variant={'displayMedium'}>${user.subscription.plan.price}</Text>
            <Text variant={'titleMedium'}>For 1 Month</Text>

            <View style={{ gap: 6, paddingHorizontal: 32 }}>
              {user.subscription.plan.features.map((feature, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                  }}>
                  <Feather name={'check-circle'} size={16} color={colors.primary} />
                  <Text>{feature}</Text>
                </View>
              ))}
            </View>

            <View style={{ marginTop: 'auto', alignItems: 'center', gap: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Feather name={'calendar'} size={16} color={colors.primary} />
                <Text style={{ color: colors.primary }}>Start date: {DateTime.fromJSDate(new Date(user.subscription.currentPeriodStart)).toFormat('EEE LLLL dd, yyyy')}</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Feather name={'calendar'} size={16} color={colors.error} />
                <Text style={{ color: colors.error }}>End date: {DateTime.fromJSDate(new Date(user.subscription.currentPeriodEnd)).toFormat('EEE LLLL dd, yyyy')}</Text>
              </View>
            </View>
          </View>
        </View>
        ) : (
        <View style={{ width: '100%', alignItems: 'center' }}>
          <Carousel
            data={plans}
            loop={true}
            snapEnabled={true}
            width={window.width}
            height={550}
            style={{
              width: window.width,
            }}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 50,
            }}
            renderItem={({ index, item }) => (
              <PlanItem plan={item} key={item.id} />
            )}
          />
        </View>
      )}

      <View style={{ alignItems: 'center', marginTop: user.subscription ? 32 : 0 }}>
        <Text style={{ textAlign: 'center' }}>For any question, please <Text onPress={() => navigate('/(app)/contact')} style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>contact us</Text></Text>
      </View>
    </ScrollView>
  )
};

export default PlansScreen;
