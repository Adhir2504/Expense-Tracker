// Model describing UI filters applied to the expense list.
// - category: restrict to a specific category key
// - fromDate/toDate: ISO yyyy-mm-dd strings used for inclusive range filtering
// - search: full-text substring search applied to `note`
// - sortBy/sortDir: sorting configuration used by the store or pipes
export interface ExpenseFilter {
  category?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
  sortBy?: 'date' | 'amount';
  sortDir?: 'asc' | 'desc';
}
