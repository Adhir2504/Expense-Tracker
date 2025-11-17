import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ExpenseStore } from '../../../core/services/expense.store';
import { CurrencyService } from '../../../core/services/currency.service';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Top-level toolbar shown on every page. Exposes a currency selector,
 * navigation links and logout action. The component reads state from
 * `ExpenseStore` and `AuthService` so the UI updates reactively.
 */
@Component({
  selector: 'toolbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, NgIf],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css'
})
export class Toolbar {
  constructor(
    public store: ExpenseStore,
    public currencySrv: CurrencyService,
    public auth: AuthService,
    private router: Router
  ) {}

  // Called when the currency <select> changes. Delegates to the store to
  // persist the selected currency (which is saved to localStorage by the store).
  onCurrencyChange(ev: Event) {
    const code = (ev.target as HTMLSelectElement).value as any;
    this.store.setCurrency(code);
  }

  // Logout action: clear auth state and navigate to login page
  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
