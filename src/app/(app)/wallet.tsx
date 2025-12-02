import ThemedHeader from '@components/ui/elements/ThemedHeader';
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useAuth } from '@core/hooks/useAuth';
import { useFetch } from '@core/hooks/useFetch';
import { useEffect, useState } from 'react';
import { ApiRoutes } from '@core/constants/ApiRoutes';
import { TUserTransaction } from '@core/types/user.type';
import NotFound from '@components/not-found/NotFound';
import TransactionItem from '@components/wallet/TransactionItem';

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

const WalletScreen = () => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { canGoBack, back } = useRouter();
  const { setUser, user } = useAuth();
  const { get, loading } = useFetch();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<TUserTransaction[]>([]);

  useEffect(() => {
    getTransactions();
  }, []);

  const getTransactions = () => {
    get(ApiRoutes.user.wallet)
      .subscribe({
        next: (response) => {
          if (response && 'data' in response) {
            setUser(response.data.user);
            setTransactions(response.data.transactions);
          }
        },
        complete: () => {
          setIsRefreshing(false);
        }
      });
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    getTransactions();
  }


  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      }
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

          <Text variant={'titleMedium'} style={styles.title}>Hello {user.profile.firstName}!</Text>
        </View>
      </ThemedHeader>

      <View style={{ padding: 24, gap: 16 }}>
        <View style={{ padding: 16 }}>
          <View style={{
            backgroundColor: colors.surface,
            padding: 24,
            borderRadius: 16,
            gap: 12,
            elevation: 3
          }}>
            <Text variant={'titleMedium'}>{t('general.balance')}</Text>

            <Text style={{ fontWeight: 'bold' }} variant={'displayMedium'}>${Number(user.profile.balance).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}</Text>
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Text variant={'titleMedium'}>{t('general.transactions')}</Text>

          <View>
            {
              loading
                ? <ActivityIndicator size="large" />
                : (
                  transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <TransactionItem key={transaction.id} transaction={transaction} />
                    ))
                  ) : (
                    <NotFound message={'No transactions found...'} />
                  )
                )
            }
          </View>
        </View>
      </View>
    </ScrollView>
  )
};

export default WalletScreen;
