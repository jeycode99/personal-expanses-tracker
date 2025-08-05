import { categories, transactionTypes } from '@/helpers/transactionData';
import { Category, TransactionType } from '@/types/transaction';
import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface TransactionFormProps {
  initialData?: {
    title: string;
    amount: string;
    type: TransactionType;
    category: Category | null;
    date: Date;
  };
  onSubmit: (data: {
    title: string;
    amount: number;
    type: TransactionType;
    category: Category | null;
    date: Date;
  }) => void;
  isLoading?: boolean;
}

export interface TransactionFormRef {
  getData: () => {
    title: string;
    amount: number;
    type: TransactionType;
    category: Category | null;
    date: Date;
  } | null;
}

const TransactionForm = forwardRef<TransactionFormRef, TransactionFormProps>(({
  initialData,
  onSubmit,
  isLoading = false,
}, ref) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [transactionType, setTransactionType] = useState<TransactionType>(initialData?.type || 'expense');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(initialData?.category || null);
  const [date, setDate] = useState(initialData?.date || new Date());
  const [showCategories, setShowCategories] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    getData: () => {
      if (!title || !amount) {
        return null;
      }

      const numericAmount = parseFloat(amount.replace(/[^0-9.]/g, ''));
      if (isNaN(numericAmount)) {
        return null;
      }

      return {
        title,
        amount: numericAmount,
        type: transactionType,
        category: selectedCategory,
        date,
      };
    }
  }));

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (selectedDate: Date) => {
    hideDatePicker();
    setDate(selectedDate);
  };

  return (
    <ScrollView 
      className="flex-1 px-4"
      contentContainerStyle={{
        paddingTop: 16,
        paddingBottom: 24
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-6">
        <Text className="text-base font-semibold text-gray-800 mb-2 ml-2">Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter transaction title"
          className="bg-white p-4 rounded-xl shadow-sm shadow-black/10"
          editable={!isLoading}
        />
      </View>

      <View className="mb-6">
        <Text className="text-base font-semibold text-gray-800 mb-2 ml-2">
        Type
        </Text>
        <View className="flex-row gap-2">
          {transactionTypes.map((type) => (
            <Pressable
              key={type.id}
              onPress={() => {
                if (!isLoading) {
                  setTransactionType(type.id);
                  if (type.id === 'income') {
                    setSelectedCategory(null);
                  }
                }
              }}
              className={`flex-1 flex-row items-center p-3 rounded-xl shadow-sm shadow-black/10 ${
                transactionType === type.id 
                  ? type.id === 'income' 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'bg-red-50 border border-red-200'
                  : 'bg-white'
              }`}
            >
              <View className={`${
                type.id === 'income' ? 'bg-blue-100' : 'bg-red-100'
              } p-1.5 rounded-lg mr-2`}>
                <Ionicons
                  name={type.icon}
                  size={16}
                  color={type.id === 'income' ? '#3B82F6' : '#EF4444'}
                />
              </View>
              <Text className={
                type.id === 'income' ? 'text-blue-500' : 'text-red-500'
              }>
                {type.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="mb-6">
        <Text className="text-base font-semibold text-gray-800 mb-2 ml-2">Amount</Text>
        <TextInput
          value={amount ? `$${amount}` : ''}
          onChangeText={(text) => setAmount(text.replace('$', ''))}
          placeholder="$0.00"
          keyboardType="decimal-pad"
          className="bg-white p-4 rounded-xl shadow-sm shadow-black/10"
          editable={!isLoading}
        />
      </View>

      {transactionType === 'expense' && (
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-800 mb-2 ml-2">Category</Text>
          <Pressable
            onPress={() => !isLoading && setShowCategories(!showCategories)}
            className="bg-white p-4 rounded-xl shadow-sm shadow-black/10"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                {selectedCategory ? (
                  <>
                    <View className="bg-gray-100 p-2 rounded-lg mr-3">
                      <Ionicons
                        name={selectedCategory.icon}
                        size={16}
                        color="#4B5563"
                      />
                    </View>
                    <Text>{selectedCategory.name}</Text>
                  </>
                ) : (
                  <Text className="text-gray-400">Select category</Text>
                )}
              </View>
              <Ionicons
                name={showCategories ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#4B5563"
              />
            </View>
          </Pressable>

          {showCategories && (
            <View className="bg-white mt-2 rounded-xl max-h-48">
              <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                {categories.map((category) => (
                  <Pressable
                    key={category.id}
                    onPress={() => {
                      if (!isLoading) {
                        setSelectedCategory(category);
                        setShowCategories(false);
                      }
                    }}
                    className="flex-row items-center p-4 border-b border-gray-100"
                  >
                    <View className="bg-gray-100 p-2 rounded-lg mr-3">
                      <Ionicons
                        name={category.icon}
                        size={16}
                        color="#4B5563"
                      />
                    </View>
                    <Text>{category.name}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}

      <View className="mb-6">
        <Text className="text-base font-semibold text-gray-800 mb-2 ml-2">Date</Text>
        <Pressable
          onPress={showDatePicker}
          className="bg-white p-4 rounded-xl shadow-sm shadow-black/10"
          disabled={isLoading}
        >
          <View className="flex-row items-center justify-between">
            <Text>{formatDate(date)}</Text>
            <Ionicons name="calendar-outline" size={16} color="#4B5563" />
          </View>
        </Pressable>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
    </ScrollView>
  );
});

TransactionForm.displayName = 'TransactionForm';

export default TransactionForm; 