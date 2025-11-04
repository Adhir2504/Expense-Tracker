import { Pipe, PipeTransform } from '@angular/core';
import { Expense } from '../../core/models/expense.model';

@Pipe({ name: 'sortBy', standalone: true, pure: true })
export class SortByPipe implements PipeTransform {
  transform(list: Expense[], by: 'date'|'amount' = 'date', dir: 'asc'|'desc' = 'desc'): Expense[] {
    const copy = [...list];
    if (by === 'date') {
      copy.sort((a,b) => dir === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
    } else {
      copy.sort((a,b) => dir === 'asc' ? a.amount - b.amount : b.amount - a.amount);
    }
    return copy;
  }
}
