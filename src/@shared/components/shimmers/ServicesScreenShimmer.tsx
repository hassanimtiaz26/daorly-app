import { useMemo } from 'react';
import ThemedCard from '@components/ui/elements/ThemedCard';
import { View } from 'react-native';
import { Shimmer } from 'react-native-fast-shimmer';

const backgroundColor = '#c5c5c5';
const borderRadius = 12;

const ServicesScreenShimmer = () => {
  const items = useMemo(() => new Array(8).fill(0).map((_, i) => i + 1), []);

  return (
    <>
      {items.map((item) => (
        <ThemedCard
          key={item}
          style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ height: 56, width: 56, borderRadius, overflow: 'hidden', backgroundColor, }}>
            <Shimmer />
          </View>

          <View style={{ flex: 1, padding: 8, gap: 8 }}>
            <View style={{ width: '40%' , height: 12, borderRadius: 4, backgroundColor, overflow: 'hidden' }}>
              <Shimmer />
            </View>
            <View style={{ width: '100%' , height: 10, borderRadius: 4, backgroundColor, overflow: 'hidden' }}>
              <Shimmer />
            </View>
          </View>
        </ThemedCard>
        ))}
    </>
  );
};

export default ServicesScreenShimmer;
