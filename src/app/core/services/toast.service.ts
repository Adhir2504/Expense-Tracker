import { Injectable, signal } from '@angular/core';

export interface ToastMsg {
  id: string;
  text: string;
  type: 'success' | 'info' | 'warning' | 'danger';
  actionText?: string;
  onAction?: () => void;
  timeoutMs?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<ToastMsg[]>([]);

  show(t: Omit<ToastMsg, 'id'>) {
    const msg: ToastMsg = { id: crypto.randomUUID(), timeoutMs: 4000, ...t };
    this.toasts.update(list => [...list, msg]);
    if (msg.timeoutMs && !msg.onAction) {
      setTimeout(() => this.dismiss(msg.id), msg.timeoutMs);
    }
  }

  dismiss(id: string) {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
