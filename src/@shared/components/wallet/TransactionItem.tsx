import { View } from 'react-native';
import { TUserTransaction } from '@core/types/user.type';
import { FC, useMemo } from 'react';
import { useAppTheme } from '@core/hooks/useAppTheme';
import Feather from '@expo/vector-icons/Feather';
import { Divider, Text } from 'react-native-paper';
import { DateTime } from 'luxon';

type Props = {
  transaction: TUserTransaction;
}

const TransactionItem: FC<Props> = ({ transaction }) => {
  const { colors } = useAppTheme();

  const isAmountPositive = useMemo(() => Number(transaction.amount) > 0, [transaction]);

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isAmountPositive ? colors.primaryContainer : colors.errorContainer,
        }}>
          <Feather
            name={isAmountPositive ? 'arrow-down-left' : 'arrow-up-right'}
            color={isAmountPositive ? colors.onPrimaryContainer : colors.onErrorContainer}
            size={20} />
        </View>

        <View style={{ flex: 1, gap: 6 }}>
          <Text variant={'bodyMedium'}>{transaction.description}</Text>

          <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
            <Feather name={'calendar'} size={12} />
            <Text variant={'bodySmall'}>{DateTime.fromJSDate(new Date(transaction.createdAt)).toFormat('MMM dd, yyyy HH:mm')}</Text>
          </View>
        </View>

        <Text style={{ color: isAmountPositive ? colors.onPrimaryContainer : colors.error }} variant={'titleMedium'}>{isAmountPositive && '+'}{Number(transaction.amount).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} $</Text>
      </View>

      <Divider style={{ marginVertical: 16 }} />
    </View>
  );
};

export default TransactionItem;
