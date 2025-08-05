import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import ProfileImageUpload from "@/components/ProfileImageUpload";
import SaveButton from "@/components/ui/SaveButton";
import { useAuth } from "@/hooks/useAuth";
import { User, UserUpdateData } from "@/types";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

interface EditProfileModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
}

export default function EditProfileModal({
  visible,
  user,
  onClose,
}: EditProfileModalProps) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();

  useEffect(() => {
    if (visible && user) {
      setName(user.name || "");
      setAvatar(user.avatar || null);
    }
  }, [visible, user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updateData: UserUpdateData = {
        name: name.trim(),
        avatar: avatar || undefined,
      };

      await updateUser(updateData);
      Alert.alert("Success", "Profile updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to save profile changes");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = useCallback((imageUri: string | null) => {
    setAvatar(imageUri);
  }, []);

  const isFormValid = name.trim();

  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      showHeader={false}
      showSaveButton={false}
      scrollable={false}
    >
      <SafeAreaView className="flex-1 bg-gray-50">
        <Header
          title="Edit Profile"
          showBackButton={true}
          onBackPress={onClose}
          className="px-4"
        />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center mb-8">
            <ProfileImageUpload
              size={100}
              storageKey="user_profile_avatar"
              initialImage={avatar}
              onImageChange={handleImageChange}
            />
            <Text className="text-sm text-gray-500 mt-2">
              Tap to change profile picture
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-2 ml-2">
              Name
            </Text>
            <TextInput
              className="bg-gray-100 rounded-2xl text-base h-12 text-gray-900 shadow-sm shadow-black/10"
              style={{
                paddingHorizontal: 16,
                textAlignVertical: 'center',
                includeFontPadding: false,
                lineHeight: 18
              }}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
              editable={!loading}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </ScrollView>

        <View className="px-4 py-3 border-gray-200 bg-gray-50">
          <SaveButton
            onPress={handleSave}
            isLoading={loading}
            disabled={!isFormValid}
            actionType="save_profile"
          />
        </View>
      </SafeAreaView>
    </ModalWrapper>
  );
}
