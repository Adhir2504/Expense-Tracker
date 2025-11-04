import { Component, Input } from '@angular/core';

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
