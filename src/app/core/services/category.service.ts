import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';

/**
 * Provides the list of categories used throughout the UI and a small helper
 * to map a category key to a CSS class used for colored badges. Keeping
 * categories in a service makes them easy to reuse and change in one place.
 */
@Injectable({ providedIn: 'root' })
export class CategoryService {
  // Statics for the demo app: key/label and a bootstrap CSS class for badges
  readonly categories: Category[] = [
    // Use softer, less flashy badge classes so the UI feels calmer.
    { key: 'Food',     label: 'Food',     colorClass: 'badge category-food' },
    { key: 'Travel',   label: 'Travel',   colorClass: 'badge category-travel' },
    { key: 'Bills',    label: 'Bills',    colorClass: 'badge category-bills' },
    { key: 'Shopping', label: 'Shopping', colorClass: 'badge category-shopping' },
    { key: 'Health',   label: 'Health',   colorClass: 'badge category-health' },
    { key: 'Other',    label: 'Other',    colorClass: 'badge category-other' },
  ];

  /**
   * Template-friendly lookup for badge CSS class given a category key.
   * Using a method here avoids inline arrow functions in templates which
   * can be problematic for change detection / readability.
   */
  getColorClass(key: string | null | undefined): string {
    const c = this.categories.find(x => x.key === key);
    return c?.colorClass ?? 'badge bg-secondary';
  }
}
