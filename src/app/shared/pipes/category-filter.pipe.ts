import { Pipe, PipeTransform } from '@angular/core';
import { Expense } from '../../core/models/expense.model';

/**
 * Filter pipe to return only expenses that match a given category.
 * Prefer using reactive computed values in the store for performance in
 * complex apps; this pipe is fine for small lists and simple templates.
 */
@Pipe({ name: 'categoryFilter', standalone: true, pure: true })
export class CategoryFilterPipe implements PipeTransform {
  transform(list: Expense[], category?: string): Expense[] {
    if (!category) return list;
    return list.filter(e => e.category === category);
  }
}
