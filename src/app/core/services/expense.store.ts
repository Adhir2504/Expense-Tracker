import { Injectable, computed, effect, signal } from '@angular/core';
import { Expense, ExpenseCategory } from '../models/expense.model';
import { ExpenseFilter } from '../models/filter.model';
import { StorageService } from './storage.service';
import { MathUtils } from '../utils/math.utils';
import { DateUtils } from '../utils/date.utils';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Central application store for Expenses.
 *
 * Uses Angular Signals for reactive state (`signal`, `computed`, `effect`).
 * This class is responsible for keeping the master list of expenses, the
 * UI filter, selected currency and small UI state (editing/undo). It also
 * persists state to localStorage via `StorageService`.
 */
@Injectable({ providedIn: 'root' })
export class ExpenseStore {
  // Keys used for localStorage persistence
  private readonly STORAGE_KEY = 'expenses_v1';
  private readonly CURRENCY_KEY = 'currency_v1';

  // ----- primary state signals -----
  // Holds the list of expenses
  expenses = signal<Expense[]>([]);
  // Loading / error flags for async operations
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  // ----- UI state -----
  // Filters applied to expenses (sort/search/date/category)
  filter = signal<ExpenseFilter>({ sortBy: 'date', sortDir: 'desc' });

  // Selected currency used for formatting only (no conversion performed)
  currency = signal<'USD'|'MUR'|'EUR'|'GBP'|'INR'>('MUR');

  // Support undo for deletes: store lastDeleted temporarily
  lastDeleted = signal<Expense | null>(null);
  private undoTimer: any = null;

  // Expense currently being edited (if any)
  editing = signal<Expense | null>(null);

  // ----- derived/computed values -----
  // The filtered and sorted list, based on `expenses` + `filter`.
  // Use helper methods to make the filter/sort logic easier to read and
  // maintain (friendly for new developers).
  filteredExpenses = computed(() => this.computeFilteredExpenses());

  // Helper that performs filtering and sorting in an explicit, easy-to-follow
  // way instead of a long inline callback.
  private computeFilteredExpenses(): Expense[] {
    const f = this.filter();
    const base = this.expenses();

    // 1) Filter by category, date range and search text
    const filtered = base.filter(exp => {
      const matchesCategory = !f.category || exp.category === f.category;
      const matchesDate = DateUtils.isInRange(exp.date, f.fromDate, f.toDate);
      const matchesSearch = !f.search || (exp.note ?? '').toLowerCase().includes(f.search.toLowerCase());
      return matchesCategory && matchesDate && matchesSearch;
    });

    // 2) Create a shallow copy and sort depending on filter settings
    const rows = [...filtered];
    if (f.sortBy === 'date') {
      // Strings in yyyy-mm-dd order sort correctly with localeCompare
      rows.sort((a, b) => {
        if (f.sortDir === 'asc') return a.date.localeCompare(b.date);
        return b.date.localeCompare(a.date);
      });
    } else {
      rows.sort((a, b) => {
        if (f.sortDir === 'asc') return a.amount - b.amount;
        return b.amount - a.amount;
      });
    }
    return rows;
  }

  // Total amount for the current filtered set
  // Make the total computation explicit and easy to read for newcomers.
  total = computed(() => {
    const rows = this.filteredExpenses();
    const sum = rows.reduce((acc, item) => acc + item.amount, 0);
    return MathUtils.round2(sum);
  });

  // Aggregate totals per category for the filtered set
  // Totals grouped by category (kept simple and readable)
  totalsByCategory = computed(() => this.computeTotalsByCategory());

  private computeTotalsByCategory(): Map<ExpenseCategory, number> {
    const result = new Map<ExpenseCategory, number>();
    for (const e of this.filteredExpenses()) {
      const prev = result.get(e.category) ?? 0;
      result.set(e.category, MathUtils.round2(prev + e.amount));
    }
    return result;
  }

  // API base path for expenses. Uses environment config so different builds
  // can target different backends (dev / prod).
  private readonly API = `${environment.apiBaseUrl}/api/expenses`;

  constructor(private storage: StorageService, private http: HttpClient) {
    // Persist expenses & currency automatically whenever they change.
    // Using `effect` ties these side-effects to the signal system.
    // We persist currency locally but expenses are stored remotely via API.
    effect(() => this.storage.set(this.CURRENCY_KEY, this.currency()));
  }

  /** Load data from storage (or seed demo items) */
  async load() {
    try {
      this.isLoading.set(true);
      this.error.set(null);
      // small artificial delay to show skeletons in UI
      await new Promise(r => setTimeout(r, 250));

      // Prefer server data; fall back to local storage when API is unavailable.
      try {
        const remote = await firstValueFrom(this.http.get<Expense[]>(this.API));
        if (remote && remote.length) {
          this.expenses.set(remote);
        } else {
          const saved = this.storage.get<Expense[]>(this.STORAGE_KEY);
          if (saved?.length) this.expenses.set(saved);
          else this.expenses.set([]);
        }
      } catch (apiErr: any) {
        const saved = this.storage.get<Expense[]>(this.STORAGE_KEY);
        if (saved?.length) {
          this.expenses.set(saved);
        } else {
          this.expenses.set([]);
        }
        this.error.set(apiErr?.message ?? 'Failed to fetch expenses from API');
      }

      const savedCurrency = this.storage.get<'USD'|'MUR'|'EUR'|'GBP'|'INR'>(this.CURRENCY_KEY);
      if (savedCurrency) this.currency.set(savedCurrency);
    } catch (e: any) {
      // Surface load error to UI
      this.error.set(e?.message ?? 'Failed to load expenses');
    } finally {
      this.isLoading.set(false);
    }
  }

  /** Add a new expense. Returns the created Expense from the backend.
   * This lets callers await the result (useful to navigate only after
   * the server confirms creation).
   */
  async add(expense: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> {
    try {
      this.error.set(null);
      const created = await firstValueFrom(this.http.post<Expense>(this.API, expense));
      // Prepend so newest appear first in the default list ordering
      this.expenses.update(list => [created, ...list]);
      return created;
    } catch (err: any) {
      this.error.set(err?.message ?? 'Failed to add expense');
      throw err;
    }
  }

  /** Start editing: copy the item into the `editing` signal */
  beginEdit(e: Expense) {
    this.editing.set({ ...e });
  }

  /** Save an edited item back into the main list and clear editing */
  async saveEdit(updated: Expense): Promise<Expense> {
    try {
      this.error.set(null);
      const res = await firstValueFrom(this.http.put<Expense>(`${this.API}/${updated.id}`, updated));
      this.expenses.update(list => list.map(e => e.id === res.id ? { ...res } : e));
      this.editing.set(null);
      return res;
    } catch (err: any) {
      this.error.set(err?.message ?? 'Failed to save expense');
      throw err;
    }
  }

  cancelEdit() {
    this.editing.set(null);
  }

  /** Remove an item and enable undo for a short window */
  async remove(id: string): Promise<void> {
    // Optimistic removal: delete locally first, then call backend. If
    // the backend fails, restore the item and surface an error.
    let removed: Expense | undefined;
    this.expenses.update(list => {
      const idx = list.findIndex(e => e.id === id);
      if (idx >= 0) removed = list[idx];
      return list.filter(e => e.id !== id);
    });
    if (!removed) return;

    this.lastDeleted.set(removed);
    clearTimeout(this.undoTimer);
    this.undoTimer = setTimeout(() => this.lastDeleted.set(null), 8000);

    try {
      await firstValueFrom(this.http.delete(`${this.API}/${id}`));
      // success: nothing else to do (item already removed optimistically)
    } catch (err: any) {
      // restore on failure
      this.expenses.update(list => [removed!, ...list]);
      this.lastDeleted.set(null);
      this.error.set(err?.message ?? 'Failed to delete expense');
      throw err;
    }
  }

  /** If an undo is requested reinstate the deleted item */
  async undoDelete(): Promise<Expense | null> {
    const e = this.lastDeleted();
    if (!e) return null;
    const payload = { amount: e.amount, category: e.category, note: e.note, date: e.date };
    try {
      const created = await firstValueFrom(this.http.post<Expense>(this.API, payload));
      this.expenses.update(list => [created, ...list]);
      this.lastDeleted.set(null);
      clearTimeout(this.undoTimer);
      return created;
    } catch (err: any) {
      this.error.set(err?.message ?? 'Failed to undo delete');
      throw err;
    }
  }

  // Simple helpers to update filters / currency
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
