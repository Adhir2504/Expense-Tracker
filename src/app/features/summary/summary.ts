import { Component, computed } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { ExpenseStore } from '../../core/services/expense.store';
import { AmountFormatPipe } from '../../shared/pipes/amount-format.pipe';
import { CategoryService } from '../../core/services/category.service';
import { CurrencyService } from '../../core/services/currency.service';

@Component({
  selector: 'summary',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, AmountFormatPipe],
  templateUrl: './summary.html',
  styleUrl: './summary.css'
})
export class Summary {
  constructor(
    public store: ExpenseStore,
    public cats: CategoryService,
    public curr: CurrencyService
  ) {}
  entries = computed(() => Array.from(this.store.totalsByCategory().entries()));
}
