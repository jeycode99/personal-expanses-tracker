import { Category, TransactionTypeOption } from "@/types/transaction";

export const transactionTypes: TransactionTypeOption[] = [
  { id: 'income', name: 'Income', icon: 'arrow-down-outline', color: 'text-blue-500' },
  { id: 'expense', name: 'Expense', icon: 'arrow-up-outline', color: 'text-red-500' },
];

export const categories: Category[] = [
  { id: '1', name: 'Food', icon: 'fast-food-outline' },
  { id: '2', name: 'Transportation', icon: 'car-outline' },
  { id: '3', name: 'Shopping', icon: 'cart-outline' },
  { id: '4', name: 'Entertainment', icon: 'game-controller-outline' },
  { id: '5', name: 'Health', icon: 'medical-outline' },
  { id: '6', name: 'Education', icon: 'book-outline' },
  { id: '7', name: 'Bills', icon: 'receipt-outline' },
  { id: '8', name: 'Other', icon: 'ellipsis-horizontal-outline' },
]; 