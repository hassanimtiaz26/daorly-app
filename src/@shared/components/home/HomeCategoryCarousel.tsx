import { FC, useRef } from 'react';
import { ICarouselInstance } from 'react-native-reanimated-carousel';
import { Dimensions, ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import Carousel from 'react-native-reanimated-carousel/src/components/Carousel';
import { Text } from 'react-native-paper';
import { useAppTheme } from '@core/hooks/useAppTheme';

const width = Dimensions.get('window').width;

type Props = {
  data: any[];
};

const HomeCategoryCarousel: FC<Props> = ({ data }) => {
  const { colors } = useAppTheme();

  // const { advancedSettings, onAdvancedSettingsChange } = useAdvancedSettings({
  //   // These values will be passed in the Carousel Component as default props
  //   defaultSettings: {
  //     autoPlay: false,
  //     autoPlayInterval: 2000,
  //     autoPlayReverse: false,
  //     data: defaultDataWith6Colors,
  //     height: 258,
  //     loop: true,
  //     pagingEnabled: true,
  //     snapEnabled: true,
  //     vertical: false,
  //     width: PAGE_WIDTH / COUNT,
  //   },
  // });

  return (
    <View style={{
      flex: 1,
      paddingHorizontal: 20,
    }}>
    <ScrollView
      horizontal={true}
      contentContainerStyle={{
        gap: 6,
      }}
      style={{
        paddingVertical: 8,
        height: 'auto',
      }}>

        {data && data.map((item, index) => (
          <View
            key={index}
            style={{
              width: 84,
              flex: 1,
              gap: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={{ height: 64, width: 64, borderRadius: '100%', overflow: 'hidden', elevation: 3 }}>
              <Image style={{ width: '100%', height: '100%' }} contentFit={'fill'} source={item.image} />
            </View>
            <Text style={{ color: colors.secondary, textAlign: 'center' }}>{item.name}</Text>
          </View>
        ))}

    </ScrollView>

    </View>
  );
}

export default HomeCategoryCarousel;
