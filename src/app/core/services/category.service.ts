import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  readonly categories: Category[] = [
    { key: 'Food',     label: 'Food',     colorClass: 'badge bg-success' },
    { key: 'Travel',   label: 'Travel',   colorClass: 'badge bg-info' },
    { key: 'Bills',    label: 'Bills',    colorClass: 'badge bg-warning text-dark' },
    { key: 'Shopping', label: 'Shopping', colorClass: 'badge bg-primary' },
    { key: 'Health',   label: 'Health',   colorClass: 'badge bg-danger' },
    { key: 'Other',    label: 'Other',    colorClass: 'badge bg-secondary' },
  ];

  /** Use this in templates instead of inline arrow functions. */
  getColorClass(key: string | null | undefined): string {
    const c = this.categories.find(x => x.key === key);
    return c?.colorClass ?? 'badge bg-secondary';
    }
}
