import { Injectable } from '@angular/core';
import { Expense } from '../models/expense.model';
import { MathUtils } from '../utils/math.utils';

@Injectable({ providedIn: 'root' })
export class ReportService {
  total(expenses: Expense[]) { return MathUtils.round2(expenses.reduce((a,b)=>a+b.amount, 0)); }
  byCategory(expenses: Expense[]) {
    const map = new Map<string, number>();
    for (const e of expenses) map.set(e.category, MathUtils.round2((map.get(e.category) ?? 0) + e.amount));
    return Array.from(map.entries()).map(([category, total]) => ({ category, total }));
  }
}
