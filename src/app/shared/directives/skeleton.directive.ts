import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[skeleton]',
  standalone: true
})
export class SkeletonDirective {
  @Input('skeleton') set active(v: boolean) { this.isActive = !!v; }
  private isActive = false;

  @HostBinding('class.skeleton') get cls() { return this.isActive; }
}
