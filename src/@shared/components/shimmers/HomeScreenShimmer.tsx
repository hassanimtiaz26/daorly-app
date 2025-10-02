import { Dimensions, View } from 'react-native';
import { Shimmer } from 'react-native-fast-shimmer';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { Image } from 'expo-image';
import ThemedCard from '@components/ui/elements/ThemedCard';
import { useMemo } from 'react';

const width = Dimensions.get('window').width;
const backgroundColor = '#c5c5c5';
const borderRadius = 12;

const HomeScreenShimmer = () => {
  const { colors } = useAppTheme();
  const carouselItems = useMemo(() => new Array(4).fill(0).map((_, i) => i + 1), []);
  const servicesItems = useMemo(() => new Array(6).fill(0).map((_, i) => i + 1), []);

  return (
    <View style={{ flex: 1, paddingHorizontal: 20, gap: 28 }}>
      <View style={{ width: width - 40, height: width / 2, backgroundColor, borderRadius, overflow: 'hidden' }}>
        <Shimmer />
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        {carouselItems.map((item) => (
          <View
            style={{
              width: 84,
              flex: 1,
              gap: 6,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius,
            }}
            key={item}>

            <View style={{ backgroundColor, height: 64, width: 64, borderRadius: '100%', overflow: 'hidden' }}>
              <Shimmer />
            </View>
            <View style={{ backgroundColor, height: 12, width: 60, borderRadius: 4, overflow: 'hidden' }}>
              <Shimmer />
            </View>
          </View>
        ))}
      </View>

      <View style={{ flex: 1, gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ backgroundColor, height: 20, width: 120, borderRadius: 4, overflow: 'hidden' }}>
            <Shimmer />
          </View>
          <View style={{ backgroundColor, height: 16, width: 80, borderRadius: 4, overflow: 'hidden' }}>
            <Shimmer />
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, }}>
          {servicesItems.map((item) => (
            <ThemedCard key={item} style={{
              width: '31%',
              aspectRatio: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 14,
              gap: 10,
              borderRadius,
            }}>
              <View style={{ backgroundColor, width: 60, height: 60, borderRadius, overflow: 'hidden' }}>
                <Shimmer />
              </View>
              <View style={{ backgroundColor, height: 12, width: 40, borderRadius: 4, overflow: 'hidden' }}>
                <Shimmer />
              </View>
            </ThemedCard>
          ))}
        </View>
      </View>
    </View>
  );
}

export default HomeScreenShimmer;
