import { Directive, HostBinding, Input } from '@angular/core';

/**
 * Adds a `skeleton` CSS class when the input is truthy. Useful for
 * showing skeleton loading styles while data is being fetched.
 * Usage: <div [skeleton]="isLoading">...</div>
 */
@Directive({
  selector: '[skeleton]',
  standalone: true
})
export class SkeletonDirective {
  @Input('skeleton') set active(v: boolean) { this.isActive = !!v; }
  private isActive = false;

  @HostBinding('class.skeleton') get cls() { return this.isActive; }
}
