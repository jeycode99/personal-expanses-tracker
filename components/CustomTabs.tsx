import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

const getTabIcon = (routeName: string, focused: boolean) => {
  const color = focused ? "#007AFF" : "#8E8E93";
  const size = 24;

  switch (routeName) {
    case "index":
      return <Ionicons name="home" size={size} color={color} />;
    case "statistics":
      return <Ionicons name="bar-chart" size={size} color={color} />;
    case "profile":
      return <Ionicons name="person" size={size} color={color} />;
    default:
      return <Ionicons name="home" size={size} color={color} />;
  }
};

const getTabLabel = (routeName: string) => {
  switch (routeName) {
    case "index":
      return "Home";
    case "statistics":
      return "Statistics";
    case "profile":
      return "Profile";
    default:
      return routeName;
  }
};

export default function CustomTabs({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "transparent",
      }}
    >
      <View
        className="flex-row bg-white"
        style={{
          height: Platform.OS === "ios" ? 83 : 65,
          paddingBottom: Platform.OS === "ios" ? 20 : 8,
          paddingTop: 8,
          paddingHorizontal: 16,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          backgroundColor: "white",
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              className="flex-1 items-center justify-center"
              style={{
                paddingVertical: Platform.OS === "ios" ? 10 : 5,
              }}
            >
              <View className="items-center justify-center">
                {getTabIcon(route.name, isFocused)}
                <Text
                  className="text-xs mt-1"
                  style={{ color: isFocused ? "#007AFF" : "#8E8E93" }}
                >
                  {getTabLabel(route.name)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
