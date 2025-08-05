import ProfileImageUpload from "@/components/ProfileImageUpload";
import { User } from "@/types";
import React from "react";
import { Text, View } from "react-native";

interface ProfileHeaderProps {
  user: User | null;
  onImageChange: (imageUri: string | null) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onImageChange }) => {
  return (
    <View className="items-center mb-8">
      <ProfileImageUpload
        size={100}
        initialImage={user?.avatar}
        storageKey="user_profile_avatar"
        onImageChange={onImageChange}
      />

      <Text className="text-xl font-semibold text-gray-800 mt-2">
        {user?.name || "User"}
      </Text>
      <Text className="text-base text-gray-600">
        {user?.email || "user@example.com"}
      </Text>
    </View>
  );
};

export default ProfileHeader; 