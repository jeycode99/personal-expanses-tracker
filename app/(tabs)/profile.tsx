import Header from "@/components/Header";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileMenu from "@/components/profile/ProfileMenu";
import { useAuth } from "@/hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, RefreshControl, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EditProfileModal from "../(modals)/EditProfileModal";

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error refreshing profile:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/Login");
        },
        style: "destructive",
      },
    ]);
  };

  const handleEditProfile = () => {
    setEditModalVisible(true);
  };

  const handleImageChange = useCallback(
    async (imageUri: string | null) => {
      try {
        await updateUser({ avatar: imageUri || undefined });
      } catch (error) {
        console.error("Error updating profile image:", error);
      }
    },
    [updateUser]
  );

  const handleSettings = () => {
    Alert.alert("Settings", "Settings functionality will be implemented here.");
  };

  const menuItems = [
    {
      icon: "person-outline" as keyof typeof Ionicons.glyphMap,
      title: "Edit Profile",
      backgroundColor: "#3B82F6",
      onPress: handleEditProfile,
    },
    {
      icon: "power-outline" as keyof typeof Ionicons.glyphMap,
      title: "Logout",
      backgroundColor: "#EF4444",
      onPress: handleLogout,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header
        title="Profile"
        showBackButton={true}
        rightComponent={
          <TouchableOpacity onPress={handleSettings}>
            <Ionicons name="settings-outline" size={24} color="#374151" />
          </TouchableOpacity>
        }
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3B82F6"]}
            tintColor="#3B82F6"
            titleColor="#666"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader user={user} onImageChange={handleImageChange} />
        <ProfileMenu items={menuItems} />
      </ScrollView>

      <EditProfileModal
        visible={editModalVisible}
        user={user}
        onClose={() => setEditModalVisible(false)}
      />
    </SafeAreaView>
  );
}
