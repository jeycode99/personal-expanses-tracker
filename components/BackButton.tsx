import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

interface BackButtonProps {
  onPress?: () => void;
  className?: string;
  iconColor?: string;
  iconSize?: number;
}

export default function BackButton({
  onPress,
  className,
  iconColor = "#374151",
  iconSize = 24,
}: BackButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <TouchableOpacity
      className={`w-10 h-10 rounded-full bg-gray-100 justify-center items-center ${className || ''}`}
      onPress={handlePress}
    >
      <Ionicons name="arrow-back" size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
}
