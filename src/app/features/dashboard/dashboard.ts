import { Component, OnInit, computed } from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ExpenseStore } from '../../core/services/expense.store';
import { CategoryService } from '../../core/services/category.service';
import { CurrencyService } from '../../core/services/currency.service';
import { AmountFormatPipe } from '../../shared/pipes/amount-format.pipe';
import { SkeletonDirective } from '../../shared/directives/skeleton.directive';
import { EmptyState } from '../../shared/components/empty-state/empty-state';

@Component({
  selector: 'dashboard',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, RouterLink, AmountFormatPipe, SkeletonDirective, EmptyState],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  constructor(
    public store: ExpenseStore,
    public cats: CategoryService,
    public curr: CurrencyService
  ) {}
  ngOnInit() { this.store.load(); }

  totalByCatEntries = computed(() => Array.from(this.store.totalsByCategory().entries()));
  onClearFilters() { this.store.resetFilter(); }
}
