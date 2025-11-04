import { Injectable } from '@angular/core';
import { Currency } from '../models/currency.model';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  readonly currencies: Currency[] = [
    { code: 'MUR', label: 'Mauritian Rupee (MUR)', symbol: '₨' },
    { code: 'USD', label: 'US Dollar (USD)',       symbol: '$' },
    { code: 'EUR', label: 'Euro (EUR)',            symbol: '€' },
    { code: 'GBP', label: 'British Pound (GBP)',   symbol: '£' },
    { code: 'INR', label: 'Indian Rupee (INR)',    symbol: '₹' },
  ];

  getSymbol(code: Currency['code']): string {
    return this.currencies.find(c => c.code === code)?.symbol ?? '$';
  }
}
