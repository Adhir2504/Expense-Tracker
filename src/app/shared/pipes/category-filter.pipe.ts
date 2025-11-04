import { Pipe, PipeTransform } from '@angular/core';
import { Expense } from '../../core/models/expense.model';

@Pipe({ name: 'categoryFilter', standalone: true, pure: true })
export class CategoryFilterPipe implements PipeTransform {
  transform(list: Expense[], category?: string): Expense[] {
    if (!category) return list;
    return list.filter(e => e.category === category);
  }
}
