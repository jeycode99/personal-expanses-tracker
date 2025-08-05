import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category?: {
    id: string;
    name: string;
    icon: string;
  };
  date: string;
  createdAt: string;
}

interface Balance {
  total: number;
  income: number;
  expense: number;
}

const STORAGE_KEYS = {
  TRANSACTIONS: '@transactions',
  BALANCE: '@balance'
};

// Initial balance for demo
const INITIAL_BALANCE: Balance = {
  total: 2548,
  income: 10840,
  expense: 1884
};

// Event name constant
export const TRANSACTION_UPDATED = 'transactionsUpdated';

export const transactionService = {
  // Initialize data
  async initializeData(): Promise<void> {
    try {
      const balance = await this.getBalance();
      if (!balance) {
        await AsyncStorage.setItem(STORAGE_KEYS.BALANCE, JSON.stringify(INITIAL_BALANCE));
      }
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  },

  // Add new transaction
  async addTransaction(transaction: Transaction): Promise<void> {
    try {
      // Get existing transactions
      const existingTransactions = await this.getTransactions();
      
      // Add new transaction to the beginning of the array
      const updatedTransactions = [transaction, ...existingTransactions];
      
      // Save updated transactions
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updatedTransactions));
      
      // Update balance
      const balance = await this.getBalance();
      const updatedBalance: Balance = {
        income: transaction.type === 'income' ? balance.income + transaction.amount : balance.income,
        expense: transaction.type === 'expense' ? balance.expense + transaction.amount : balance.expense,
        total: transaction.type === 'income' 
          ? balance.total + transaction.amount 
          : balance.total - transaction.amount
      };
      
      await AsyncStorage.setItem(STORAGE_KEYS.BALANCE, JSON.stringify(updatedBalance));

      // Emit update event
      DeviceEventEmitter.emit(TRANSACTION_UPDATED);
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  },

  // Get all transactions
  async getTransactions(): Promise<Transaction[]> {
    try {
      const transactions = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return transactions ? JSON.parse(transactions) : [];
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  },

  // Get recent transactions
  async getRecentTransactions(limit: number = 10): Promise<Transaction[]> {
    try {
      const transactions = await this.getTransactions();
      return transactions.slice(0, limit);
    } catch (error) {
      console.error('Error getting recent transactions:', error);
      return [];
    }
  },

  // Get balance
  async getBalance(): Promise<Balance> {
    try {
      const balance = await AsyncStorage.getItem(STORAGE_KEYS.BALANCE);
      return balance ? JSON.parse(balance) : INITIAL_BALANCE;
    } catch (error) {
      console.error('Error getting balance:', error);
      return INITIAL_BALANCE;
    }
  },

  // Delete transaction
  async deleteTransaction(transactionId: string): Promise<void> {
    try {
      // Get existing transactions
      const existingTransactions = await this.getTransactions();
      
      // Find transaction to delete
      const transactionToDelete = existingTransactions.find(t => t.id === transactionId);
      if (!transactionToDelete) {
        throw new Error('Transaction not found');
      }
      
      // Remove transaction
      const updatedTransactions = existingTransactions.filter(t => t.id !== transactionId);
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updatedTransactions));
      
      // Update balance
      const balance = await this.getBalance();
      const updatedBalance: Balance = {
        income: transactionToDelete.type === 'income' ? balance.income - transactionToDelete.amount : balance.income,
        expense: transactionToDelete.type === 'expense' ? balance.expense - transactionToDelete.amount : balance.expense,
        total: transactionToDelete.type === 'income' 
          ? balance.total - transactionToDelete.amount 
          : balance.total + transactionToDelete.amount
      };
      
      await AsyncStorage.setItem(STORAGE_KEYS.BALANCE, JSON.stringify(updatedBalance));

      // Emit update event
      DeviceEventEmitter.emit(TRANSACTION_UPDATED);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  },

  // Update transaction
  async updateTransaction(updatedTransaction: Transaction): Promise<void> {
    try {
      // Get existing transactions
      const existingTransactions = await this.getTransactions();
      
      // Find old transaction
      const oldTransaction = existingTransactions.find(t => t.id === updatedTransaction.id);
      if (!oldTransaction) {
        throw new Error('Transaction not found');
      }

      // Update transactions list
      const updatedTransactions = existingTransactions.map(t => 
        t.id === updatedTransaction.id ? updatedTransaction : t
      );
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updatedTransactions));
      
      // Update balance
      const balance = await this.getBalance();
      const updatedBalance: Balance = {
        income: oldTransaction.type === 'income' 
          ? balance.income - oldTransaction.amount + (updatedTransaction.type === 'income' ? updatedTransaction.amount : 0)
          : balance.income + (updatedTransaction.type === 'income' ? updatedTransaction.amount : 0),
        expense: oldTransaction.type === 'expense'
          ? balance.expense - oldTransaction.amount + (updatedTransaction.type === 'expense' ? updatedTransaction.amount : 0)
          : balance.expense + (updatedTransaction.type === 'expense' ? updatedTransaction.amount : 0),
        total: balance.total - (oldTransaction.type === 'income' ? oldTransaction.amount : -oldTransaction.amount)
          + (updatedTransaction.type === 'income' ? updatedTransaction.amount : -updatedTransaction.amount)
      };
      
      await AsyncStorage.setItem(STORAGE_KEYS.BALANCE, JSON.stringify(updatedBalance));

      // Emit update event
      DeviceEventEmitter.emit(TRANSACTION_UPDATED);
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  // Reset all data (for testing)
  async resetData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.TRANSACTIONS, STORAGE_KEYS.BALANCE]);
      await this.initializeData();
      DeviceEventEmitter.emit(TRANSACTION_UPDATED);
    } catch (error) {
      console.error('Error resetting data:', error);
      throw error;
    }
  }
}; 