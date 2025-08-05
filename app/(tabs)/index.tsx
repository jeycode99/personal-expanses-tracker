import BalanceCard from "@/components/BalanceCard";
import TransactionItem from "@/components/TransactionItem";
import FloatingButton from "@/components/ui/FloatingButton";
import { useAuth } from "@/hooks/useAuth";
import { Transaction, TRANSACTION_UPDATED, transactionService } from "@/services/transactionService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, DeviceEventEmitter, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState({
    total: 0,
    income: 0,
    expense: 0
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    transactionService.initializeData();
    loadData();
    const subscription = DeviceEventEmitter.addListener(TRANSACTION_UPDATED, loadData);
    return () => {
      subscription.remove();
    };
  }, []);

  const loadData = async () => {
    try {
      const [recentTransactions, currentBalance] = await Promise.all([
        transactionService.getRecentTransactions(),
        transactionService.getBalance()
      ]);
      setTransactions(recentTransactions);
      setBalance(currentBalance);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadData();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleAddPress = () => {
    router.push("/(modals)/AddTransactionModal");
  };

  const handleSeeAllPress = () => {
    router.push("/(tabs)/statistics");
  };

  const handleDelete = async (transactionId: string) => {
    try {
      await transactionService.deleteTransaction(transactionId);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      Alert.alert('Error', 'Failed to delete transaction. Please try again.');
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar backgroundColor="#3b82f6" barStyle="light-content" />
      
      {/* Blue Background Header - Fixed height */}
      <View
        className="bg-blue-600 p-5 rounded-b-3xl"
        style={{ 
          paddingTop: insets.top + 24,
          minHeight: 230,
          paddingBottom: 40,
          borderRadius: 20
        }}
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-lg font-base">Welcome Back!</Text>
            <Text className="text-white text-3xl font-bold mt-1">
              {user?.name || "Parker Martin"}
            </Text>
          </View>
        </View>
      </View>

        <BalanceCard balance={balance} />

      <View className="flex-1">
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#3B82F6"]}
              tintColor="#3B82F6"
              titleColor="#666"
            />
          }
        >
          <View className="p-5">
            <View className="flex-row justify-between mb-3">
              <Text className="text-lg font-semibold">Recent Transactions</Text>
              <TouchableOpacity onPress={handleSeeAllPress}>
                <Text className="text-blue-500 font-medium">See all</Text>
              </TouchableOpacity>
            </View>

            {transactions.length === 0 ? (
              <View className="items-center justify-center py-8 px-4 bg-white rounded-xl">
                <Ionicons name="receipt-outline" size={48} color="#9CA3AF" />
                <Text className="text-gray-500 text-lg font-medium mt-4 text-center">No Transactions Yet</Text>
                <Text className="text-gray-400 text-center mt-2">Add your first transaction by clicking the + button below</Text>
              </View>
            ) : (
              transactions.map((item, index) => (
                <Animated.View
                  key={item.id}
                  entering={FadeInDown.delay(index * 50).springify().damping(14)}
                >
                  <TransactionItem 
                    item={item} 
                    onDelete={() => handleDelete(item.id)} 
                  />
                </Animated.View>
              ))
            )}
          </View>
        </ScrollView>
      </View>

      <FloatingButton onPress={handleAddPress} />
    </View>
  );
}
