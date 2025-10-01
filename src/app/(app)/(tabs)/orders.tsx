import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { List, Text } from 'react-native-paper';
import ThemedSearchBar from '@components/ui/inputs/ThemedSearchBar';
import { useCallback, useState } from 'react';
import ThemedHeader from '@components/ui/elements/ThemedHeader';
import { Image } from 'expo-image';

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
  },
});

type TOrderStatus = 'pending' | 'waiting_confirmation' | 'confirmed' | 'cancelled' | 'done';

export default function OrderScreen() {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState<TOrderStatus>('pending');
  const items = new Array(6).fill(0).map((_, i) => i + 1);;

  const onRefreshData = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [setRefreshing]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefreshData}
        />
      }
      style={styles.container} contentContainerStyle={styles.scrollContentContainer}>
      <ThemedHeader>
        <ThemedSearchBar  />
      </ThemedHeader>

      <View style={styles.innerContentContainer}>
        <List.Section style={{ paddingHorizontal: 20, gap: 10, }}>
          {items.map((item) => (
            <List.Accordion
              key={item}
              style={{
                paddingVertical: 0,
                paddingHorizontal: 8,
                elevation: 3,
                borderRadius: 12,
                backgroundColor: colors.surface,
              }}
              title="Service Name"
              description="Service Description"
              left={props => <Image style={{ width: 54, height: 54 }} source={require('@/assets/images/placeholder.png')} />}>
              <View style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                elevation: 3,
                marginTop: 8
              }}>

              </View>
            </List.Accordion>
          ))}
        </List.Section>
      </View>
    </ScrollView>
  );
}
