import { Injectable, computed, effect, signal } from '@angular/core';
import { Expense, ExpenseCategory } from '../models/expense.model';
import { ExpenseFilter } from '../models/filter.model';
import { StorageService } from './storage.service';
import { MathUtils } from '../utils/math.utils';
import { DateUtils } from '../utils/date.utils';

@Injectable({ providedIn: 'root' })
export class ExpenseStore {
  private readonly STORAGE_KEY = 'expenses_v1';
  private readonly CURRENCY_KEY = 'currency_v1';

  // data
  expenses = signal<Expense[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  // ui filter
  filter = signal<ExpenseFilter>({ sortBy: 'date', sortDir: 'desc' });

  // selected currency (formatting only; no conversion)
  currency = signal<'USD'|'MUR'|'EUR'|'GBP'|'INR'>('MUR');

  // undo delete
  lastDeleted = signal<Expense | null>(null);
  private undoTimer: any = null;

  // edit selection
  editing = signal<Expense | null>(null);

  filteredExpenses = computed(() => {
    const f = this.filter();
    const base = this.expenses();

    let rows = base.filter(e =>
      (!f.category || e.category === f.category) &&
      DateUtils.isInRange(e.date, f.fromDate, f.toDate) &&
      (!f.search || (e.note?.toLowerCase().includes(f.search.toLowerCase())))
    );

    rows = [...rows];
    if (f.sortBy === 'date') {
      rows.sort((a,b) => f.sortDir === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
    } else {
      rows.sort((a,b) => f.sortDir === 'asc' ? a.amount - b.amount : b.amount - a.amount);
    }
    return rows;
  });

  total = computed(() => MathUtils.round2(this.filteredExpenses().reduce((a,b)=>a+b.amount,0)));

  totalsByCategory = computed(() => {
    const map = new Map<ExpenseCategory, number>();
    for (const e of this.filteredExpenses()) {
      map.set(e.category, MathUtils.round2((map.get(e.category) ?? 0) + e.amount));
    }
    return map;
  });

  constructor(private storage: StorageService) {
    effect(() => this.storage.set(this.STORAGE_KEY, this.expenses()));
    effect(() => this.storage.set(this.CURRENCY_KEY, this.currency()));
  }

  async load() {
    try {
      this.isLoading.set(true);
      this.error.set(null);
      await new Promise(r => setTimeout(r, 250));

      const saved = this.storage.get<Expense[]>(this.STORAGE_KEY);
      if (saved?.length) {
        this.expenses.set(saved);
      } else {
        const now = new Date().toISOString();
        this.expenses.set([
          { id: crypto.randomUUID(), amount: 9.99,  category: 'Food',   note: 'Sandwich',    date: '2025-11-02', createdAt: now },
          { id: crypto.randomUUID(), amount: 120.0, category: 'Bills',  note: 'Electricity', date: '2025-11-01', createdAt: now },
          { id: crypto.randomUUID(), amount: 35.5,  category: 'Travel', note: 'Taxi',        date: '2025-11-03', createdAt: now },
          { id: crypto.randomUUID(), amount: 22.0,  category: 'Food',   note: 'Lunch',       date: '2025-11-03', createdAt: now },
        ]);
      }

      const savedCurrency = this.storage.get<'USD'|'MUR'|'EUR'|'GBP'|'INR'>(this.CURRENCY_KEY);
      if (savedCurrency) this.currency.set(savedCurrency);
    } catch (e: any) {
      this.error.set(e?.message ?? 'Failed to load expenses');
    } finally {
      this.isLoading.set(false);
    }
  }

  add(expense: Omit<Expense, 'id' | 'createdAt'>) {
    const item: Expense = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...expense };
    this.expenses.update(list => [item, ...list]);
  }

  /** Start editing */
  beginEdit(e: Expense) {
    this.editing.set({ ...e });
  }

  /** Save edited item */
  saveEdit(updated: Expense) {
    this.expenses.update(list => list.map(e => e.id === updated.id ? { ...updated } : e));
    this.editing.set(null);
  }

  cancelEdit() {
    this.editing.set(null);
  }

  remove(id: string) {
    let removed: Expense | undefined;
    this.expenses.update(list => {
      const idx = list.findIndex(e => e.id === id);
      if (idx >= 0) removed = list[idx];
      return list.filter(e => e.id !== id);
    });
    if (removed) {
      this.lastDeleted.set(removed);
      clearTimeout(this.undoTimer);
      this.undoTimer = setTimeout(() => this.lastDeleted.set(null), 8000); // 8s to undo
    }
  }

  undoDelete() {
    const e = this.lastDeleted();
    if (!e) return;
    this.expenses.update(list => [e, ...list]);
    this.lastDeleted.set(null);
    clearTimeout(this.undoTimer);
  }

  setFilter(patch: Partial<ExpenseFilter>) {
    this.filter.update(f => ({ ...f, ...patch }));
  }
  resetFilter() {
    this.filter.set({ sortBy: 'date', sortDir: 'desc' });
  }

  setCurrency(code: 'USD'|'MUR'|'EUR'|'GBP'|'INR') {
    this.currency.set(code);
  }
}
