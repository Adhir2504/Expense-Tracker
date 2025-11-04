export interface Currency {
  code: 'USD' | 'MUR' | 'EUR' | 'GBP' | 'INR';
  label: string;
  symbol: string; // e.g., $, ₨, €, £, ₹
}
