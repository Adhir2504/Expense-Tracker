import { Injectable } from '@angular/core';
import { Currency } from '../models/currency.model';

/**
 * Small service providing supported currency metadata (code, label, symbol).
 * The app stores the selected currency code in the `ExpenseStore` and uses
 * this service to map the code to a symbol for display.
 *
 * Note: There is no currency conversion in this demo — amounts are treated
 * as being expressed in the selected currency.
 */
@Injectable({ providedIn: 'root' })
export class CurrencyService {
  readonly currencies: Currency[] = [
    { code: 'MUR', label: 'Mauritian Rupee (MUR)', symbol: '₨' },
    { code: 'USD', label: 'US Dollar (USD)',       symbol: '$' },
    { code: 'EUR', label: 'Euro (EUR)',            symbol: '€' },
    { code: 'GBP', label: 'British Pound (GBP)',   symbol: '£' },
    { code: 'INR', label: 'Indian Rupee (INR)',    symbol: '₹' },
  ];

  // Return symbol for a currency code; fallback to '$' if not found.
  getSymbol(code: Currency['code']): string {
    return this.currencies.find(c => c.code === code)?.symbol ?? '$';
  }
}
