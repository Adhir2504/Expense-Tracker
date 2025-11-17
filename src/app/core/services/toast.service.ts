import { Injectable, signal } from '@angular/core';

// Toast message shape used by the `Toaster` UI component.
export interface ToastMsg {
  id: string;
  text: string;
  type: 'success' | 'info' | 'warning' | 'danger';
  // Optional action button text and callback (e.g. 'Undo')
  actionText?: string;
  onAction?: () => void;
  // Optional timeout after which the toast auto-dismisses (ms)
  timeoutMs?: number;
}

/**
 * Small notification service. Keeps a signal with an array of current
 * toasts. Components (like `Toaster`) can read that signal and render
 * messages. `show` optionally auto-dismisses the message after a timeout
 * unless an action handler is present.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  // Reactive list of toast messages
  toasts = signal<ToastMsg[]>([]);

  // Show a toast. `id` is generated here and a default timeout is applied.
  show(t: Omit<ToastMsg, 'id'>) {
    const DEFAULT_TIMEOUT = 4000;
    const timeout = t.timeoutMs ?? DEFAULT_TIMEOUT;
    const msg: ToastMsg = { id: crypto.randomUUID(), timeoutMs: timeout, ...t };
    // Append the new toast to the list
    this.toasts.update(list => [...list, msg]);

    // Auto-dismiss only when there is no action handler. If a callback is
    // provided we let the caller decide when to dismiss (e.g. Undo flows).
    if (timeout && !msg.onAction) {
      setTimeout(() => this.dismiss(msg.id), timeout);
    }
  }

  // Remove a toast by id
  dismiss(id: string) {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
