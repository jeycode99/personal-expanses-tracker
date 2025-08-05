import { ImageUploadOptions, ImageUploadResult } from '@/types';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

class ImageUploadService {
  private defaultOptions: ImageUploadOptions = {
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  };

  async requestCameraPermission(): Promise<boolean> {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera permission is required to take photos.'
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  }

  async requestMediaLibraryPermission(): Promise<boolean> {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Photo library permission is required to select photos.'
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error requesting media library permission:', error);
      return false;
    }
  }

  async openCamera(options?: ImageUploadOptions): Promise<ImageUploadResult> {
    try {
      const hasPermission = await this.requestCameraPermission();
      if (!hasPermission) {
        return { success: false, error: 'Camera permission denied' };
      }

      const mergedOptions = { ...this.defaultOptions, ...options };
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: mergedOptions.allowsEditing,
        aspect: mergedOptions.aspect,
        quality: mergedOptions.quality,
      });

      if (result.canceled) {
        return { success: false, error: 'User canceled camera' };
      }

      if (result.assets && result.assets[0]) {
        return { success: true, uri: result.assets[0].uri };
      }

      return { success: false, error: 'No image selected' };
    } catch (error) {
      console.error('Camera error:', error);
      return { success: false, error: 'Failed to take photo' };
    }
  }

  async openGallery(options?: ImageUploadOptions): Promise<ImageUploadResult> {
    try {
      const hasPermission = await this.requestMediaLibraryPermission();
      if (!hasPermission) {
        return { success: false, error: 'Media library permission denied' };
      }

      const mergedOptions = { ...this.defaultOptions, ...options };
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: mergedOptions.allowsEditing,
        aspect: mergedOptions.aspect,
        quality: mergedOptions.quality,
      });

      if (result.canceled) {
        return { success: false, error: 'User canceled gallery' };
      }

      if (result.assets && result.assets[0]) {
        return { success: true, uri: result.assets[0].uri };
      }

      return { success: false, error: 'No image selected' };
    } catch (error) {
      console.error('Gallery error:', error);
      return { success: false, error: 'Failed to select photo' };
    }
  }

  showImagePickerOptions(
    onCameraSelect: () => void,
    onGallerySelect: () => void,
    onRemove?: () => void,
    hasExistingImage?: boolean
  ): void {
    const options: {
      text: string;
      style?: "default" | "cancel" | "destructive";
      onPress?: () => void;
    }[] = [
      { text: "Cancel", style: "cancel" },
      { text: "Camera", onPress: onCameraSelect },
      { text: "Gallery", onPress: onGallerySelect },
    ];

    if (hasExistingImage && onRemove) {
      options.splice(1, 0, {
        text: "Remove Photo",
        onPress: onRemove,
        style: "destructive",
      });
    }

    Alert.alert("Profile Picture", "Choose an option", options);
  }
}

export const imageUploadService = new ImageUploadService();
export default imageUploadService;