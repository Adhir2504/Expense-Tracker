// Allowed categories for expenses. Keep this in sync with the UI category list
// used by `CategoryService`.
export type ExpenseCategory = 'Food' | 'Travel' | 'Bills' | 'Shopping' | 'Health' | 'Other';

// Shape of an Expense object used throughout the app.
export interface Expense {
  // unique id (generated with crypto.randomUUID())
  id: string;
  // numeric amount in selected currency (no conversion happens here)
  amount: number;
  // category - one of `ExpenseCategory`
  category: ExpenseCategory;
  // optional free-text note
  note?: string;
  // date of expense stored as yyyy-mm-dd (string) to avoid timezone surprises
  date: string;      // yyyy-mm-dd
  // ISO timestamp when the expense was created (used for sorting/metadata)
  createdAt: string; // ISO
}
