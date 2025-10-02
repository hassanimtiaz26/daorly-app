import { FC, useRef } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel/src/components/Carousel';
import { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import { Image } from 'expo-image';

type Props = {
  data: any[];
};

const width = Dimensions.get('window').width;

const HomeSlider: FC<Props> = ({ data }) => {
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
      width={width}
      height={width / 2}
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
            paddingHorizontal: 20,
            justifyContent: 'center',
          }}
        >
          <View style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}>
            <Image style={{ width: '100%', height: '100%' }} contentFit={'cover'} source={item.image} />
          </View>
        </View>
      )}
    />
  );
}

export default HomeSlider;
