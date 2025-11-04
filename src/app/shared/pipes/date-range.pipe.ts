import { Pipe, PipeTransform } from '@angular/core';
import { Expense } from '../../core/models/expense.model';

@Pipe({ name: 'dateRange', standalone: true, pure: true })
export class DateRangePipe implements PipeTransform {
  transform(list: Expense[], from?: string, to?: string): Expense[] {
    if (!from && !to) return list;
    return list.filter(e => (!from || e.date >= from) && (!to || e.date <= to));
  }
}
