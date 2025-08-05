import CustomTabs from "@/components/CustomTabs";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabs {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: "Statistics",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
