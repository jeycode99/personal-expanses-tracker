import {
  ImageUploadOptions,
  ProfileImageResult
} from '@/types';
import { Alert } from 'react-native';
import { imageUploadService } from './imageUploadService';
import { storageService } from './storageService';

class ProfileImageService {
  private readonly PROFILE_IMAGE_KEY = 'profile_image';

  async loadProfileImage(storageKey?: string): Promise<ProfileImageResult> {
    const key = storageKey || this.PROFILE_IMAGE_KEY;
    const result = await storageService.getItem<string>(key);
    
    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true, imageUri: result.data || null };
  }

  async saveProfileImage(imageUri: string, storageKey?: string): Promise<ProfileImageResult> {
    const key = storageKey || this.PROFILE_IMAGE_KEY;
    const result = await storageService.setItem(key, imageUri);
    
    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true, imageUri };
  }

  async removeProfileImage(storageKey?: string): Promise<ProfileImageResult> {
    const key = storageKey || this.PROFILE_IMAGE_KEY;
    const result = await storageService.removeItem(key);
    
    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true, imageUri: null };
  }

  async takePhotoFromCamera(
    storageKey?: string,
    options?: ImageUploadOptions
  ): Promise<ProfileImageResult> {
    const uploadResult = await imageUploadService.openCamera(options);
    
    if (!uploadResult.success || !uploadResult.uri) {
      return { success: false, error: uploadResult.error };
    }

    const saveResult = await this.saveProfileImage(uploadResult.uri, storageKey);
    return saveResult;
  }

  async selectPhotoFromGallery(
    storageKey?: string,
    options?: ImageUploadOptions
  ): Promise<ProfileImageResult> {
    const uploadResult = await imageUploadService.openGallery(options);
    
    if (!uploadResult.success || !uploadResult.uri) {
      return { success: false, error: uploadResult.error };
    }

    const saveResult = await this.saveProfileImage(uploadResult.uri, storageKey);
    return saveResult;
  }

  async showImagePickerWithSave(
    onImageChanged: (imageUri: string | null) => void,
    currentImageUri?: string | null,
    storageKey?: string,
    options?: ImageUploadOptions
  ): Promise<void> {
    const handleCamera = async () => {
      const result = await this.takePhotoFromCamera(storageKey, options);
      if (result.success) {
        onImageChanged(result.imageUri || null);
        Alert.alert('Success', 'Profile picture updated successfully!');
      } else {
        Alert.alert('Error', result.error || 'Failed to take photo');
      }
    };

    const handleGallery = async () => {
      const result = await this.selectPhotoFromGallery(storageKey, options);
      if (result.success) {
        onImageChanged(result.imageUri || null);
        Alert.alert('Success', 'Profile picture updated successfully!');
      } else {
        Alert.alert('Error', result.error || 'Failed to select photo');
      }
    };

    const handleRemove = async () => {
      Alert.alert(
        "Remove Photo",
        "Are you sure you want to remove your profile photo?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: async () => {
              const result = await this.removeProfileImage(storageKey);
              if (result.success) {
                onImageChanged(null);
              } else {
                Alert.alert('Error', result.error || 'Failed to remove photo');
              }
            },
          },
        ]
      );
    };

    imageUploadService.showImagePickerOptions(
      handleCamera,
      handleGallery,
      currentImageUri ? handleRemove : undefined,
      !!currentImageUri
    );
  }
}

export const profileImageService = new ProfileImageService();
export default profileImageService;