import { Pipe, PipeTransform } from '@angular/core';
import { Expense } from '../../core/models/expense.model';

@Pipe({ name: 'search', standalone: true, pure: true })
export class SearchPipe implements PipeTransform {
  transform(list: Expense[], q?: string): Expense[] {
    if (!q) return list;
    const s = q.toLowerCase();
    return list.filter(e => (e.note ?? '').toLowerCase().includes(s));
  }
}
