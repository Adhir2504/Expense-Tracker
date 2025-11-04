import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'amountFormat', standalone: true })
export class AmountFormatPipe implements PipeTransform {
  transform(value: number, currency = '$'): string {
    if (value == null) return '';
    return `${currency}${value.toFixed(2)}`;
  }
}
