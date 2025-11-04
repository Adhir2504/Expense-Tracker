export interface ExpenseFilter {
  category?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
  sortBy?: 'date' | 'amount';
  sortDir?: 'asc' | 'desc';
}
