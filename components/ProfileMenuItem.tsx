import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ProfileMenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  backgroundColor: string;
  onPress?: () => void;
  showArrow?: boolean;
}

export default function ProfileMenuItem({
  icon,
  title,
  backgroundColor,
  onPress,
  showArrow = true,
}: ProfileMenuItemProps) {

  return (
      <TouchableOpacity
        className="flex-row items-center justify-between p-2 mb-4"
        onPress={onPress}
      >
        <View className="flex-row items-center">
          <View
            className="rounded-2xl justify-center items-center"
            style={{
              width: 42,
              height: 42,
              backgroundColor,
            }}
          >
            <Ionicons name={icon} size={24} color="white" />
          </View>
          <Text className="text-lg text-gray-800 pl-4">{title}</Text>
        </View>
        {showArrow && (
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        )}
      </TouchableOpacity>
  );
}
