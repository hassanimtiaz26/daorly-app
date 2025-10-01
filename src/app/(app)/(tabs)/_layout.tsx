import { Tabs } from 'expo-router';
import React from 'react';
import { useAppTheme } from '@core/hooks/useAppTheme';
import ProfileIcon from '@/assets/icons/profile.svg';
import ProfileFocusedIcon from '@/assets/icons/profile-focused.svg';
import OrderIcon from '@/assets/icons/orders.svg';
import OrderFocusedIcon from '@/assets/icons/orders-focused.svg';
import HomeIcon from '@/assets/icons/home.svg';
import HomeFocusedIcon from '@/assets/icons/home-focused.svg';
import { useAuthStore } from '@shared/store/useAuthStore';

export default function TabLayout() {
  const { colors } = useAppTheme();
  const { user } = useAuthStore();

  return (
    <Tabs
      initialRouteName={'home'}
      screenOptions={{
        tabBarActiveTintColor: colors.onSecondary,
        // tabBarBackground: <View style={{ backgroundColor: colors.secondary }} /> ,
        // headerShown: false,
        // tabBarButton: HapticTab,
        // tabBarBackground: TabBarBackground,

        tabBarStyle: {
          // position: 'absolute',
          // bottom: 10,
          backgroundColor: colors.secondary,
          paddingBottom: 0,
          paddingHorizontal: 44,
          marginBottom: 0,
        },
        tabBarIconStyle: {
          marginTop: 12,
        }
      }}>
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            focused ? <HomeFocusedIcon /> : <HomeIcon />
          ),
          tabBarShowLabel: false,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          tabBarIcon: ({ color, focused }) => (
            focused ? <OrderFocusedIcon /> : <OrderIcon />
          ),
          tabBarShowLabel: false,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            focused ? <ProfileFocusedIcon /> : <ProfileIcon />
          ),
          tabBarShowLabel: false,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
