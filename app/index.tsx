import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "expo-router";

export default function Index() {
  const { user } = useAuth();

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/Login" />;
}
