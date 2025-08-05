import { Ionicons } from '@expo/vector-icons';

export interface Category {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export interface TransactionTypeOption {
  id: TransactionType;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export type TransactionType = 'income' | 'expense'; 