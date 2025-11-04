import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ExpenseStore } from '../../../core/services/expense.store';
import { CurrencyService } from '../../../core/services/currency.service';
import { AuthService } from '../../../core/services/auth.service';

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

  onCurrencyChange(ev: Event) {
    const code = (ev.target as HTMLSelectElement).value as any;
    this.store.setCurrency(code);
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
