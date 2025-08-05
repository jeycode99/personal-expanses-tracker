import { getIconBackground } from "@/helpers/iconHelper";
import { Transaction } from "@/services/transactionService";
import { formatDate } from "@/utils/dateHelper";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef } from "react";
import { Alert, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

interface TransactionItemProps {
  item: Transaction;
  onDelete: () => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ item, onDelete }) => {
  const swipeableRef = useRef<Swipeable>(null);

  const handleDelete = () => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { 
          text: "Cancel", 
          style: "cancel",
          onPress: () => swipeableRef.current?.close()
        },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: onDelete
        }
      ]
    );
  };

  const handleEdit = () => {
    swipeableRef.current?.close();
    router.push({
      pathname: "/(modals)/UpdateTransactionModal",
      params: { transaction: JSON.stringify(item) }
    });
  };

  const renderRightActions = () => {
    return (
      <View className="justify-center items-center pr-4">
        <View className="bg-red-500 w-12 h-12 rounded-2xl justify-center items-center">
          <Ionicons name="trash-outline" size={24} color="white" />
        </View>
      </View>
    );
  };

  const renderLeftActions = () => {
    return (
      <View className="justify-center items-center pl-4">
        <View className="bg-blue-500 w-12 h-12 rounded-2xl justify-center items-center">
          <Ionicons name="pencil-outline" size={24} color="white" />
        </View>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      onSwipeableRightOpen={handleDelete}
      onSwipeableLeftOpen={handleEdit}
      overshootRight={false}
      overshootLeft={false}
      rightThreshold={40}
      leftThreshold={40}
    >
      <View
        className="bg-white rounded-xl p-4 mb-3 flex-row items-center justify-between"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <View className="flex-row items-center">
          <View className={`${getIconBackground(item.category?.icon || '')} rounded-lg p-2.5 mr-3`}>
            <Ionicons 
              name={(item.category?.icon || 'cash-outline') as any} 
              size={20} 
              color="black" 
            />
          </View>
          <View>
            <Text className="font-semibold">{item.title}</Text>
            <Text className="text-gray-400 text-xs">{formatDate(item.createdAt)}</Text>
          </View>
        </View>
        <View className="items-end">
          <Text className={`font-semibold ${
            item.type === 'income' ? 'text-green-500' : 'text-red-500'
          }`}>
            {item.type === 'income' ? '+' : '-'} ${item.amount.toLocaleString()}
          </Text>
          <Text className="text-gray-400 text-xs">{formatDate(item.date)}</Text>
        </View>
      </View>
    </Swipeable>
  );
};

export default TransactionItem; 