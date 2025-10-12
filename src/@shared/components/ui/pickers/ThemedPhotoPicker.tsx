import * as ImagePicker from 'expo-image-picker';
import { FC, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import ThemedTextInput from '@components/ui/inputs/ThemedTextInput';
import { Text, TextInput } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import { ImagePickerAsset } from 'expo-image-picker/src/ImagePicker.types';
import Feather from '@expo/vector-icons/Feather';
import { useAppTheme } from '@core/hooks/useAppTheme';

type Props = {
  loading: boolean;
  onChange: (value: ImagePickerAsset[]) => void;
}

const ThemedPhotoPicker: FC<Props> = ({ loading, onChange }) => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const [photos, setPhotos] = useState<ImagePickerAsset[]>([]);

  const pickImage = async () => {
    const permission = await ImagePicker.getMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert('Permission to access media library is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      // allowsEditing: true,
      quality: 0.5,
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });

    // console.log(result);

    if (result.canceled) {
      console.log('User cancelled image picker');
      return;
    }

    if (result.assets && result.assets.length > 0) {
      console.log(`Selected ${result.assets.length} images`);
      onChange([...photos, ...result.assets]);
      setPhotos([...photos, ...result.assets]);
    }
  };

  const handleRemovePhoto = (uriToRemove: string) => {
    const updatedPhotos = photos.filter((photo: ImagePickerAsset) => photo.uri !== uriToRemove);
    setPhotos(updatedPhotos);
    onChange(updatedPhotos);
  };

  const renderPhoto = ({ item }) => (
    <View style={styles.thumbnailContainer}>
      <Image source={{ uri: item.uri }} style={styles.thumbnail} />
      <TouchableOpacity onPress={() => handleRemovePhoto(item.uri)} style={styles.removeButton}>
        <Feather
          name={'x'} size={18} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
    <ThemedTextInput
      disabled={loading}
      readOnly={true}
      right={
        <TextInput.Icon
          onPress={() => pickImage()}
          icon={'plus'} />
      }
      label={t('order.form.photos')} />
      {photos && photos.length > 0 && (
        <FlatList
          data={photos}
          renderItem={renderPhoto}
          keyExtractor={(item) => item.uri}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.list}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  list: { marginTop: 10 },
  thumbnailContainer: { position: 'relative', marginRight: 10 },
  thumbnail: { width: 100, height: 100, borderRadius: 8 },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: { color: 'white', fontWeight: 'bold' },
});

export default ThemedPhotoPicker;
