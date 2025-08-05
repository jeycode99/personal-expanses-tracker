import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface BalanceCardProps {
  balance: {
    total: number;
    income: number;
    expense: number;
  };
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  return (
    <View className="-mt-[60px] z-10">
      <View className="px-4">
        <View className="bg-white rounded-3xl p-6 shadow-lg">
          <View className="flex-row justify-between items-center">
            <Text className="text-black text-base">Total Balance</Text>
            <Ionicons name="ellipsis-horizontal" size={16} color="black" />
          </View>
          <Text className="text-black text-3xl font-bold my-2">
            $ {balance.total.toLocaleString()}
          </Text>

          <View className="flex-row justify-between mb-2 mt-6">
            <View className="flex-col items-center space-x-2">
              <View className="flex-row items-center space-x-2">
                <View className="bg-blue-500 rounded-full p-2 mx-1">
                  <Ionicons name="arrow-down" size={9} color="white" />
                </View>
                <Text className="text-grey-200 text-xl">Income</Text>
              </View>
              <View>
                <Text className="text-black font-bold text-xl">
                  $ {balance.income.toLocaleString()}
                </Text>
              </View>
            </View>
            <View className="flex-col items-center space-x-2">
              <View className="flex-row items-center space-x-2">
                <View className="bg-red-500 rounded-full p-2 mx-1">
                  <Ionicons name="arrow-up" size={9} color="white" />
                </View>
                <Text className="text-grey-200 text-xl">Expenses</Text>
              </View>
              <View>
                <Text className="text-red-500 font-bold text-xl">
                  $ {balance.expense.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BalanceCard; 