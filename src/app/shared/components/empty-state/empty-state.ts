import { Component, Input } from '@angular/core';

/**
 * Reusable empty-state component displayed when a list has no items.
 * Accepts `title` and `subtitle` inputs so callers can customize the message.
 */
@Component({
  selector: 'empty-state',
  standalone: true,
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css'
})
export class EmptyState {
  @Input() title = 'Nothing here yet';
  @Input() subtitle = 'Try changing filters or add new data.';
}
