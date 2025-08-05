import Header from "@/components/Header";
import IncomeExpensesChart from "@/components/statistics/IncomeExpensesChart";
import TransactionItem from "@/components/TransactionItem";
import FloatingButton from "@/components/ui/FloatingButton";
import {
  Transaction,
  TRANSACTION_UPDATED,
  transactionService,
} from "@/services/transactionService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  DeviceEventEmitter,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StatisticsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [chartData, setChartData] = useState({
    labels: ["Income", "Expenses"],
    values: [0, 0],
  });

  useEffect(() => {
    loadData();
    const subscription = DeviceEventEmitter.addListener(
      TRANSACTION_UPDATED,
      loadData
    );
    return () => {
      subscription.remove();
    };
  }, []);

  const loadData = async () => {
    try {
      const [allTransactions, balance] = await Promise.all([
        transactionService.getTransactions(),
        transactionService.getBalance(),
      ]);

      setTransactions(allTransactions);
      setChartData({
        labels: ["Income", "Expenses"],
        values: [balance.income, balance.expense],
      });
    } catch (error) {
      console.error("Error loading data:", error);
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

  const handleDelete = async (transactionId: string) => {
    try {
      await transactionService.deleteTransaction(transactionId);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      Alert.alert("Error", "Failed to delete transaction. Please try again.");
    }
  };

  const handleSettings = () => {
    Alert.alert("Settings", "Settings functionality will be implemented here.");
  };

  const handleAddPress = () => {
    router.push("/(modals)/AddTransactionModal");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Header
        title="Statistics"
        showBackButton={true}
        rightComponent={
          <TouchableOpacity onPress={handleSettings}>
            <Ionicons name="settings-outline" size={24} color="#374151" />
          </TouchableOpacity>
        }
      />

      {/* Scrollable Content */}
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
          {/* Chart Section */}
          <View className="p-5">
            <IncomeExpensesChart data={chartData} />
          </View>

          {/* Transactions List */}
          <View className="p-5">
            <View className="flex-row justify-between mb-3">
              <Text className="text-lg font-semibold">All Transactions</Text>
            </View>

            {transactions.length === 0 ? (
              <View className="items-center justify-center py-8 px-4">
                <Ionicons name="analytics-outline" size={48} color="#9CA3AF" />
                <Text className="text-gray-500 text-lg font-medium mt-4 text-center">
                  No Transaction History
                </Text>
                <Text className="text-gray-400 text-center mt-2">
                  Your transaction history will appear here once you start
                  adding transactions
                </Text>
              </View>
            ) : (
              transactions.map((item, index) => (
                <Animated.View
                  key={item.id}
                  entering={FadeInDown.delay(index * 50)
                    .springify()
                    .damping(14)}
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

      <FloatingButton
        onPress={handleAddPress}
        icon="add"
        iconSize={24}
        iconColor="white"
        backgroundColor="#3B82F6"
      />
    </SafeAreaView>
  );
}
