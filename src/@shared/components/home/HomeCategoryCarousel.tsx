import { FC, useRef } from 'react';
import { ICarouselInstance } from 'react-native-reanimated-carousel';
import { Dimensions, Pressable, ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import Carousel from 'react-native-reanimated-carousel/src/components/Carousel';
import { Text } from 'react-native-paper';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { TCategory } from '@core/types/category.type';
import { useRouter } from 'expo-router';

type Props = {
  data: TCategory[];
};

const HomeCategoryCarousel: FC<Props> = ({ data }) => {
  const { colors } = useAppTheme();
  const { push } = useRouter();

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
          <Pressable
            onPress={() => {
              push({
                pathname: '/(app)/services',
                params: { type: 'categories', parentId: item.id },
              })
            }}
            key={index}
            style={{
              width: 84,
              flex: 1,
              gap: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View style={{ backgroundColor: colors.surface, height: 64, width: 64, borderRadius: 32, borderWidth: 1, borderColor: 'transparent', overflow: 'hidden', elevation: 3 }}>
              <Image style={{ width: '100%', height: '100%' }} contentFit={'cover'} source={{ uri: item.image.media.url }} />
            </View>
            <Text style={{ color: colors.secondary, textAlign: 'center' }}>{item.name}</Text>
          </Pressable>
        ))}

    </ScrollView>

    </View>
  );
}

export default HomeCategoryCarousel;
