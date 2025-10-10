import { FC, useRef } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { TMediaAttachment } from '@core/types/media.type';

type Props = {
  data: TMediaAttachment[];
};

const width = Dimensions.get('window').width;

const ServiceSlider: FC<Props> = ({ data }) => {
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);


  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <Carousel
      ref={ref}
      width={width - 40}
      height={200}
      data={data}
      onProgressChange={progress}
      snapEnabled={true}
      autoPlay={true}
      autoPlayInterval={5000}
      loop={true}
      renderItem={({ index, item }) => (
        <View
          style={{
            flex: 1,
            // paddingHorizontal: 20,
            justifyContent: 'center',
          }}
        >
          <View style={{ flex: 1, borderRadius: 24, overflow: 'hidden', elevation: 2, }}>
            <Image style={{ width: '100%', height: '100%' }} contentFit={'cover'} source={{ uri: item.media.url }} />
          </View>
        </View>
      )}
    />
  );
}

export default ServiceSlider;
