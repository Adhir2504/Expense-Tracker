// Currency metadata used by `CurrencyService` and pipes/components that
// need to show a symbol or human-friendly label for a currency code.
export interface Currency {
  // ISO-like code used throughout the app
  code: 'USD' | 'MUR' | 'EUR' | 'GBP' | 'INR';
  // Human readable label
  label: string;
  // Symbol used for display, e.g. '$', '₨', '€'
  symbol: string; // e.g., $, ₨, €, £, ₹
}
