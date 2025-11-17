// Simple model describing a UI category used for expenses.
// - `key`: the programmatic key (matches Expense.category)
// - `label`: user-facing label
// - `colorClass`: CSS class used for colored badges in the UI
export interface Category {
  key: string;
  label: string;
  colorClass: string;
}
