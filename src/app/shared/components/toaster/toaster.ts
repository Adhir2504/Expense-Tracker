import { Component } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { ToastService, ToastMsg } from '../../../core/services/toast.service';

// Simple presentational component that renders toasts from `ToastService`.
// The service owns the toast list and provides methods to create/dismiss
// messages. This component reads the service's state and displays it.
@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [NgFor, NgIf, NgClass],
  templateUrl: './toaster.html',
  styleUrl: './toaster.css'
})
export class Toaster {
  constructor(public toast: ToastService) {}
  onAction(t: ToastMsg) {
    try { t.onAction?.(); }
    finally { this.toast.dismiss(t.id); }
  }
}
