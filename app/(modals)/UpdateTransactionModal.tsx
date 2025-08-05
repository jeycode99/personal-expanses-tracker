import Header from '@/components/Header';
import TransactionForm, { TransactionFormRef } from '@/components/forms/TransactionForm';
import SaveButton from '@/components/ui/SaveButton';
import { transactionService } from '@/services/transactionService';
import { Category, TransactionType } from '@/types/transaction';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FormData {
  title: string;
  amount: number;
  type: TransactionType;
  category: Category | null;
  date: Date;
}

const UpdateTransactionModal = () => {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<TransactionFormRef>(null);

  const transaction = params.transaction ? JSON.parse(params.transaction as string) : null;

  const handleSave = async (formData: FormData) => {
    if (!transaction) {
      Alert.alert('Error', 'Transaction data not found');
      return;
    }

    setIsLoading(true);
    try {
      const updatedTransaction = {
        ...transaction,
        title: formData.title,
        amount: formData.amount,
        type: formData.type,
        category: formData.category ? {
          id: formData.category.id,
          name: formData.category.name,
          icon: formData.category.icon,
        } : undefined,
        date: formData.date.toISOString(),
      };

      await transactionService.updateTransaction(updatedTransaction);
      router.back();
    } catch (error) {
      console.error('Error updating transaction:', error);
      Alert.alert('Error', 'Failed to update transaction. Please try again.');
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

  if (!transaction) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
      style={{ paddingTop: insets.top }}
    >
      <StatusBar barStyle="dark-content" />
      
      <Header 
        title="Update Transaction" 
        showBackButton 
        onBackPress={() => router.back()}
      />

      <TransactionForm
        ref={formRef}
        initialData={{
          title: transaction.title,
          amount: transaction.amount.toString(),
          type: transaction.type,
          category: transaction.category,
          date: new Date(transaction.date),
        }}
        onSubmit={handleSave}
        isLoading={isLoading}
      />

      <View 
        className="px-4 py-4"
        style={{ paddingBottom: insets.bottom || 16 }}
      >
        <SaveButton
          onPress={handleSavePress}
          isLoading={isLoading}
          actionType="update"
          disabled={false}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default UpdateTransactionModal; 