import { Pipe, PipeTransform } from '@angular/core';
import { Expense } from '../../core/models/expense.model';

/**
 * Filters expenses to those within an inclusive date range. Dates are
 * expected to be yyyy-mm-dd strings (ISO date portion) which allows
 * lexicographic comparison without timezone conversions.
 */
@Pipe({ name: 'dateRange', standalone: true, pure: true })
export class DateRangePipe implements PipeTransform {
  transform(list: Expense[], from?: string, to?: string): Expense[] {
    if (!from && !to) return list;
    return list.filter(e => (!from || e.date >= from) && (!to || e.date <= to));
  }
}
