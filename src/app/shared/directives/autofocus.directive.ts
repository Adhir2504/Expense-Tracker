import { Directive, ElementRef, AfterViewInit } from '@angular/core';

/**
 * Small directive to focus an input element after it appears in the DOM.
 * Usage: <input autofocus />
 * It defers focus with a timeout to avoid Angular change-detection timing issues.
 */
@Directive({
  selector: '[autofocus]',
  standalone: true
})
export class AutofocusDirective implements AfterViewInit {
  constructor(private el: ElementRef<HTMLInputElement>) {}
  ngAfterViewInit() { setTimeout(() => this.el.nativeElement?.focus(), 0); }
}
