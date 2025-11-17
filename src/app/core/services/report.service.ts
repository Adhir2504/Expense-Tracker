import { Injectable } from '@angular/core';
import { Expense } from '../models/expense.model';
import { MathUtils } from '../utils/math.utils';

/**
 * Small utility service to generate simple reports from an expenses array.
 * Kept separate to decouple presentation/aggregation from the store logic.
 */
@Injectable({ providedIn: 'root' })
export class ReportService {
  // Total amount across all provided expenses (rounded to 2 decimals)
  total(expenses: Expense[]) { return MathUtils.round2(expenses.reduce((a,b)=>a+b.amount, 0)); }

  // Aggregates totals by category and returns an array of {category, total}
  byCategory(expenses: Expense[]) {
    const map = new Map<string, number>();
    for (const e of expenses) map.set(e.category, MathUtils.round2((map.get(e.category) ?? 0) + e.amount));
    return Array.from(map.entries()).map(([category, total]) => ({ category, total }));
  }
}
