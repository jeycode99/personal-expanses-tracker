import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  className?: string;
}

const Header = ({
  title,
  showBackButton = false,
  onBackPress,
  rightComponent,
  className,
}: HeaderProps) => {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View className={`flex-row items-center justify-between px-4 py-3 ${className || ''}`}>
      <View className="w-10">
        {showBackButton && (
          <TouchableOpacity
            onPress={handleBackPress}
            className="w-10 h-10 p-2 rounded-full bg-white justify-center items-center shadow-sm shadow-black/20"
          >
            <Ionicons name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>
        )}
      </View>

      <Text className="text-xl font-bold text-gray-800 text-center">
        {title}
      </Text>

      <View className="w-10">{rightComponent}</View>
    </View>
  );
};

export default Header;
