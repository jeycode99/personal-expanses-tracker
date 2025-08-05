import { StorageResult } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  async setItem<T>(key: string, value: T): Promise<StorageResult<T>> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return { success: true, data: value };
    } catch (error) {
      console.error(`Error saving data for key ${key}:`, error);
      return { success: false, error: 'Failed to save data' };
    }
  }

  async getItem<T>(key: string): Promise<StorageResult<T>> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue === null) {
        return { success: true, data: undefined };
      }
      const data = JSON.parse(jsonValue) as T;
      return { success: true, data };
    } catch (error) {
      console.error(`Error getting data for key ${key}:`, error);
      return { success: false, error: 'Failed to get data' };
    }
  }

  async removeItem(key: string): Promise<StorageResult<null>> {
    try {
      await AsyncStorage.removeItem(key);
      return { success: true };
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
      return { success: false, error: 'Failed to remove data' };
    }
  }

  async hasItem(key: string): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null;
    } catch (error) {
      console.error(`Error checking key ${key}:`, error);
      return false;
    }
  }

  async clear(): Promise<StorageResult<null>> {
    try {
      await AsyncStorage.clear();
      return { success: true };
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
      return { success: false, error: 'Failed to clear storage' };
    }
  }

  async getAllKeys(): Promise<StorageResult<readonly string[]>> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return { success: true, data: keys };
    } catch (error) {
      console.error('Error getting all keys:', error);
      return { success: false, error: 'Failed to get keys' };
    }
  }
}

export const storageService = new StorageService();
export default storageService;