import { TService } from '@core/types/service.type';
import { FC, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import ThemedButton from '@components/ui/buttons/ThemedButton';
import { useTranslation } from 'react-i18next';
import { useBottomSheet } from '@core/hooks/useBottomSheet';
import { useRouter } from 'expo-router';
import ServiceSlider from '@components/services/ServiceSlider';

type Props = {
  service: TService;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
  }
})

const ServiceDetail: FC<Props> = ({ service }) => {
  const { t } = useTranslation();
  const { close } = useBottomSheet();
  const { push } = useRouter();

  const onContinue = useCallback(() => {
    push({
      pathname: '/(app)/order',
      params: { serviceId: service.id.toString() }
    });
    close();
  }, [close]);

  return (
    <View style={styles.container}>
      {/*{service.images.length > 0 && service.images.map((image, index) => (

      ))}*/}
      {service.images.length > 0 && (
        <ServiceSlider data={service.images} />
      )}

      <Text
        style={styles.title}
        variant={'headlineSmall'}>{service.name}</Text>

      <Text variant={'bodyMedium'}>{service.description}</Text>

      <ThemedButton
        buttonStyle={'secondary'}
        onPress={() => onContinue()}>{t('general.continue')}</ThemedButton>
    </View>
  );
}

export default ServiceDetail;
