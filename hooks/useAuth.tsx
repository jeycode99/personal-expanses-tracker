import { userService } from "@/services/userService";
import { User, UserUpdateData } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  login: (userData: Omit<User, "id">) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updateData: UserUpdateData) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data on app start
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const result = await userService.getUser();
      if (result.success && result.user) {
        setUser(result.user);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: Omit<User, "id">) => {
    setIsLoading(true);
    try {
      // Create user with generated ID
      const newUser: User = {
        ...userData,
        id: userService.generateUserId(),
      };

      // Save to AsyncStorage
      const result = await userService.saveUser(newUser);
      if (result.success) {
        setUser(newUser);
      } else {
        throw new Error(result.error || "Failed to save user data");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await userService.removeUser();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updateData: UserUpdateData) => {
    if (!user) {
      throw new Error("No user logged in");
    }

    setIsLoading(true);
    try {
      const result = await userService.updateUser(updateData);
      if (result.success && result.user) {
        setUser(result.user);
      } else {
        throw new Error(result.error || "Failed to update user");
      }
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, updateUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
