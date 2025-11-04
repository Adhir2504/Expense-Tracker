export type ExpenseCategory = 'Food' | 'Travel' | 'Bills' | 'Shopping' | 'Health' | 'Other';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  note?: string;
  date: string;      // yyyy-mm-dd
  createdAt: string; // ISO
}
