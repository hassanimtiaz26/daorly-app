import { Text } from 'react-native-paper';
import { View } from 'react-native';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { TPlan } from '@core/types/plan.type';
import { FC, useEffect } from 'react';
import Feather from '@expo/vector-icons/Feather';
import ThemedButton from '@components/ui/buttons/ThemedButton';
import { useFetch } from '@core/hooks/useFetch';
import { ApiRoutes } from '@core/constants/ApiRoutes';
import { useDialog } from '@core/hooks/useDialog';
import { useAuth } from '@core/hooks/useAuth';
import { useTranslation } from 'react-i18next';

type Props = {
  plan: TPlan;
}

const PlanItem: FC<Props> = ({ plan }) => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const { post, loading, error } = useFetch();
  const { showDialog } = useDialog();
  const { setUser, user } = useAuth();

  useEffect(() => {
    if (error) {
      showDialog({
        variant: 'error',
        message: error,
      })
    }
  }, [error]);

  const onSubscribe = () => {
    showDialog({
      variant: 'success',
      type: 'confirmation',
      title: t('subscription.dialog.title'),
      message: t('subscription.dialog.message'),
      onConfirm: () => {
        post(ApiRoutes.subscriptions.subscribe, { planId: plan.id })
          .subscribe({
            next: (response) => {
              if (response && response.success && 'data' in response) {
                setUser({ ...user, subscription: response.data.subscription });
                showDialog({
                  variant: 'success',
                  message: response.message,
                })
              }
            }
          });
      }
    });
  };

  return (
    <View style={{
      backgroundColor: colors.surface,
      borderRadius: 16,
      elevation: 3,
      padding: 32,
      gap: 14,
      alignItems: 'center',
      height: '100%',
    }}>
      <Text variant={'titleSmall'}>POPULAR</Text>
      <Text style={{ fontWeight: 'bold' }} variant={'titleLarge'}>{plan.name}</Text>
      <Text style={{ fontWeight: 'bold' }} variant={'displayMedium'}>${plan.price}</Text>
      <Text variant={'titleMedium'}>For 1 Month</Text>

      <View style={{ gap: 6, paddingHorizontal: 32 }}>
        {plan.features.map((feature, index) => (
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

      <View style={{ marginTop: 'auto' }}>
        <ThemedButton
          onPress={onSubscribe}
          disabled={loading}>Subscribe</ThemedButton>
      </View>
    </View>
  );
};

export default PlanItem;
