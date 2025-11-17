import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats a numeric amount as a currency string using a provided symbol.
 * Example: `123.4 | amountFormat:'$'` => "$123.40"
 * This pipe does not perform currency conversion — it only formats the
 * numeric value for display.
 */
@Pipe({ name: 'amountFormat', standalone: true })
export class AmountFormatPipe implements PipeTransform {
  transform(value: number, currency = '$'): string {
    if (value == null) return '';
    return `${currency}${value.toFixed(2)}`;
  }
}
