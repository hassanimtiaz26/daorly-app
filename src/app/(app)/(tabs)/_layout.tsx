import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { Icon } from 'react-native-paper/src';
import ProfileIcon from '@/assets/icons/profile.svg';
import ProfileFocusedIcon from '@/assets/icons/profile-focused.svg';
import OrderIcon from '@/assets/icons/orders.svg';
import OrderFocusedIcon from '@/assets/icons/orders-focused.svg';
import HomeIcon from '@/assets/icons/home.svg';
import HomeFocusedIcon from '@/assets/icons/home-focused.svg';

export default function TabLayout() {
  const { colors } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.onSecondary,
        // headerShown: false,
        // tabBarButton: HapticTab,
        // tabBarBackground: TabBarBackground,

        tabBarStyle: {
          backgroundColor: colors.secondary,
          padding: 0,
        },
      }}>
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            focused ? <ProfileFocusedIcon /> : <ProfileIcon />
          ),
          tabBarStyle: {
            padding: 0,
          },
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
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            focused ? <HomeFocusedIcon /> : <HomeIcon />
          ),
          tabBarShowLabel: false,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
