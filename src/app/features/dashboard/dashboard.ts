import { Component, OnInit, computed } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ExpenseStore } from '../../core/services/expense.store';
import { CategoryService } from '../../core/services/category.service';
import { CurrencyService } from '../../core/services/currency.service';
import { ToastService } from '../../core/services/toast.service';
import { AmountFormatPipe } from '../../shared/pipes/amount-format.pipe';
import { SkeletonDirective } from '../../shared/directives/skeleton.directive';
import { EmptyState } from '../../shared/components/empty-state/empty-state';

/**
 * Dashboard component: shows the list of expenses and summary widgets.
 * On init it triggers `store.load()` to populate data from localStorage
 * (or seed demo items). The template reads `store.filteredExpenses()` and
 * other computed values directly so the UI stays reactive.
 */
@Component({
  selector: 'dashboard',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, RouterLink, AmountFormatPipe, SkeletonDirective, EmptyState],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  // Track which rows are currently being deleted to show a spinner / disable
  private deletingIds = new Set<string>();

  constructor(
    public store: ExpenseStore,
    public cats: CategoryService,
    public curr: CurrencyService,
    private toast: ToastService,
    private router: Router
  ) {}

  isDeleting(id: string) { return this.deletingIds.has(id); }

  async onDelete(id: string) {
    if (this.isDeleting(id)) return;
    this.deletingIds.add(id);
    try {
      await this.store.remove(id);
      this.toast.show({ text: 'Expense deleted', type: 'success' });
    } catch (err: any) {
      this.toast.show({ text: err?.message ?? 'Failed to delete expense', type: 'danger' });
    } finally {
      this.deletingIds.delete(id);
    }
  }

  // Begin editing an expense and navigate to the add/edit form.
  // The AddExpense component can be enhanced to read `store.editing()`
  // and populate the form for updates. For now this sets the editing
  // signal and navigates to `/add` where the form lives.
  onEdit(id: string) {
    const item = this.store.expenses().find(e => e.id === id);
    if (!item) {
      this.toast.show({ text: 'Expense not found', type: 'danger' });
      return;
    }
    this.store.beginEdit(item);
    this.router.navigateByUrl(`/edit/${id}`);
  }

  // Load persisted data when component initializes
  ngOnInit() { this.store.load(); }

  // Convert the totalsByCategory map to an array of entries for iteration
  totalByCatEntries = computed(() => Array.from(this.store.totalsByCategory().entries()));

  // UI action to clear filters and restore default sorting
  onClearFilters() { this.store.resetFilter(); }
}
