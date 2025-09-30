import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

const ThemedSplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('@/assets/images/daorly-icon.png')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  }
})

export default ThemedSplashScreen;
