import Header from "@/components/Header";
import TransactionForm from "@/components/forms/TransactionForm";
import SaveButton from "@/components/ui/SaveButton";
import { transactionService } from "@/services/transactionService";
import { Category, TransactionType } from "@/types/transaction";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FormData {
  title: string;
  amount: number;
  type: TransactionType;
  category: Category | null;
  date: Date;
}

const AddTransactionModal = () => {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<{ getData: () => FormData | null }>(null);

  const handleSave = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const transaction = {
        id: Date.now().toString(),
        title: formData.title,
        amount: formData.amount,
        type: formData.type,
        category: formData.category
          ? {
              id: formData.category.id,
              name: formData.category.name,
              icon: formData.category.icon,
            }
          : undefined,
        date: formData.date.toISOString(),
        createdAt: new Date().toISOString(),
      };

      await transactionService.addTransaction(transaction);
      router.back();
    } catch (error) {
      console.error("Error adding transaction:", error);
      Alert.alert("Error", "Failed to add transaction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePress = () => {
    const formData = formRef.current?.getData();
    if (formData) {
      handleSave(formData);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
      style={{ paddingTop: insets.top }}
    >
      <StatusBar barStyle="dark-content" />

      <Header
        title="Add Transaction"
        showBackButton
        onBackPress={() => router.back()}
      />

      <TransactionForm ref={formRef} onSubmit={handleSave} isLoading={isLoading} />

      <View
        className="px-4 py-4"
        style={{ paddingBottom: insets.bottom || 16 }}
      >
        <SaveButton
          onPress={handleSavePress}
          isLoading={isLoading}
          actionType="add"
          disabled={false}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddTransactionModal;
