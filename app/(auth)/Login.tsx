import { useAuth } from "@/hooks/useAuth";
import { generateRandomName } from "@/utils/randomName";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      if (email === "user@mail.com" && password === "password") {
        const randomName = generateRandomName();
        await login({ email, name: randomName });
        router.replace("/(tabs)");
      } else {
        Alert.alert("Error", "Invalid credentials");
      }
    } catch (error: any) {
      Alert.alert(error, "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              padding: 24
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="bg-white rounded-3xl w-full">
              <Text className="text-3xl font-bold text-center mb-3 text-gray-800">
                Login
              </Text>
              <Text className="text-base text-center mb-8 text-gray-600">
                Personal Expenses Tracker
              </Text>

              <Text className="text-base font-semibold text-gray-800 mb-2">
                Email
              </Text>
              <TextInput
                className="bg-gray-100 p-4 rounded-2xl mb-6 text-base"
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  textAlignVertical: 'center',
                  includeFontPadding: false,
                  lineHeight: 18
                }}
                onChangeText={setEmail}
                placeholder="Enter your email"
                value={email}
                keyboardType="email-address"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Text className="text-base font-semibold text-gray-800 mb-2">
                Password
              </Text>
              <TextInput
                className="bg-gray-100 p-5 rounded-2xl mb-6 text-base justify-center"
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  textAlignVertical: 'center',
                  includeFontPadding: false,
                  lineHeight: 18
                }}
                placeholder="Enter your password"
                value={password}
                placeholderTextColor="#9CA3AF"
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />

              <TouchableOpacity
                className={`bg-blue-600 py-4 p-5 rounded-2xl items-center shadow-sm ${
                  loading ? 'opacity-70' : ''
                }`}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text className="text-white text-base font-semibold">
                  {loading ? "Logging in..." : "Login"}
                </Text>
              </TouchableOpacity>

              <Text className="mt-6 text-center text-gray-500 text-sm">
                Demo credentials:{"\n"}
                Email: user@mail.com{"\n"}
                Password: password
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
