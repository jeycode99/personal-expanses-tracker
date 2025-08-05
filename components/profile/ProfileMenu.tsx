import ProfileMenuItem from "@/components/ProfileMenuItem";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  backgroundColor: string;
  onPress: () => void;
}

interface ProfileMenuProps {
  items: MenuItem[];
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ items }) => {
  return (
    <View className="mb-8">
      {items.map((item, index) => (
        <Animated.View
          key={item.title}
          entering={FadeInDown.delay(index * 50).springify().damping(14)}
        >
          <ProfileMenuItem
            icon={item.icon}
            title={item.title}
            backgroundColor={item.backgroundColor}
            onPress={item.onPress}
          />
        </Animated.View>
      ))}
    </View>
  );
};

export default ProfileMenu; 