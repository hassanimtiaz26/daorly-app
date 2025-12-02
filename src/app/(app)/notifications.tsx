import { ActivityIndicator, Badge, List, Text } from 'react-native-paper';
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { useTranslation } from 'react-i18next';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import ThemedHeader from '@/src/@shared/components/ui/elements/ThemedHeader';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { TNotification } from '@core/types/notification.type';
import { useEffect, useState } from 'react';
import { useFetch } from '@core/hooks/useFetch';
import { ApiRoutes } from '@core/constants/ApiRoutes';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import { useAuth } from '@core/hooks/useAuth';
import ElementLoader from '@components/ui/ElementLoader';

const createStyles = (colors: MD3Colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContentContainer: {
    // gap: 12,
  },
  innerContentContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
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

const NotificationScreen = () => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { canGoBack, back, replace } = useRouter();
  const { get, post, loading } = useFetch();
  const { user, setUser } = useAuth();
  const [notifications, setNotifications] = useState<TNotification[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = () => {
    get(ApiRoutes.notifications.index)
      .subscribe({
        next: (response) => {
          if (response && 'data' in response) {
            setNotifications(response.data.notifications);
          }
        },
        complete: () => {
          setIsRefreshing(false);
        }
      });
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    getNotifications();
  }

  const onNotificationPress = (notification: TNotification) => {
    setIsSubmitting(true);
    post(ApiRoutes.notifications.markAsRead(notification.id), { id: notification.id })
      .subscribe({
        next: (response) => {
          if (response && response.success) {
            setUser({ ...user, unreadNotificationCount: response.data.unreadNotificationCount })
            replace({
              pathname: '/(app)/(tabs)/orders',
              params: { orderStatus: notification.data.order.status }
            })
          }
        },
        complete: () => {
          setIsSubmitting(false);
        }
      });
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      }
      style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
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

          <Text variant={'titleLarge'} style={styles.title}>Notifications</Text>
        </View>

      </ThemedHeader>

      {notifications && notifications.length > 0 ? (
        <View style={{ gap: 12, padding: 12 }}>
          {isSubmitting && <ElementLoader />}
          {
            notifications.map((notification) => (
              <List.Item
                key={notification.id}
                onPress={() => onNotificationPress(notification)}
                disabled={loading}
                left={({ color }) => (
                  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcon name={notification.data.icon} color={color} size={32} />
                  </View>
                )}
                descriptionNumberOfLines={1}
                title={notification.data.title}
                description={notification.data.message}
                style={{
                  backgroundColor: notification.readAt ? colors.surface : colors.primaryContainer,
                  elevation: 2,
                  borderRadius: 10,
                  padding: 12,
                }}
                right={() => {
                  if (!notification.readAt) {
                    return (
                      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Badge style={{ marginLeft: 'auto' }} size={8} />
                      </View>
                    );
                  }
                }}
              />
            ))
          }
        </View>
      ) : (
        <View style={{ padding: 20 }}>
          <Text style={{ textAlign: 'center' }}>Nothing to see here...</Text>
        </View>
      )}
    </ScrollView>
  )
}

export default NotificationScreen;
