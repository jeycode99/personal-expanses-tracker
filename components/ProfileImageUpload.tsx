import { profileImageService } from "@/services/profileImageService";
import { PROFILE_IMAGE_KEYS, ProfileImageUploadProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native";

export default function ProfileImageUpload({
  size = 80,
  storageKey = PROFILE_IMAGE_KEYS.DEFAULT,
  initialImage,
  onImageChange,
  uploadOptions,
}: ProfileImageUploadProps) {
  const [profileImage, setProfileImage] = useState<string | null>(
    initialImage || null
  );
  const [loading, setLoading] = useState(false);

  const loadProfileImage = useCallback(async () => {
    if (initialImage) {
      setProfileImage(initialImage);
      return;
    }

    const result = await profileImageService.loadProfileImage(storageKey);
    if (result.success && result.imageUri) {
      setProfileImage(result.imageUri);
    }
  }, [storageKey, initialImage]);

  useEffect(() => {
    loadProfileImage();
  }, [loadProfileImage]);

  useEffect(() => {
    if (initialImage !== undefined) {
      setProfileImage(initialImage);
    }
  }, [initialImage]);

  const handleImageChange = useCallback(
    (imageUri: string | null) => {
      setProfileImage(imageUri);
      onImageChange?.(imageUri);
    },
    [onImageChange]
  );

  const handleImageUpload = useCallback(async () => {
    setLoading(true);

    try {
      await profileImageService.showImagePickerWithSave(
        handleImageChange,
        profileImage,
        storageKey,
        uploadOptions
      );
    } catch (error) {
      console.error("Error in image upload:", error);
    } finally {
      setLoading(false);
    }
  }, [profileImage, storageKey, uploadOptions, handleImageChange]);

  const imageSize = {
    width: size,
    height: size,
  };

  return (
    <TouchableOpacity onPress={handleImageUpload} disabled={loading}>
      <View className="relative">
        {loading ? (
          <View
            className="rounded-full bg-gray-100 justify-center items-center"
            style={imageSize}
          >
            <ActivityIndicator size="small" color="#007AFF" />
          </View>
        ) : profileImage ? (
          <Image
            source={{ uri: profileImage }}
            className="rounded-full"
            style={imageSize}
          />
        ) : (
          <View
            className="rounded-full bg-gray-100 justify-center items-center"
            style={imageSize}
          >
            <Ionicons name="person" size={size * 0.5} color="#6B7280" />
          </View>
        )}

        {/* Camera icon overlay */}
        <View
          className="absolute bg-blue-500 rounded-full justify-center items-center"
          style={{
            bottom: 0,
            right: 0,
            width: size * 0.35,
            height: size * 0.35,
          }}
        >
          <Ionicons name="camera" size={size * 0.2} color="white" />
        </View>
      </View>
    </TouchableOpacity>
  );
}
