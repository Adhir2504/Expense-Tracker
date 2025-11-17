import { Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';

/**
 * Very small authentication service used by the demo app.
 *
 * Notes:
 * - This is intentionally simple: it accepts any non-empty email/password
 *   pair and stores the login state in localStorage via `StorageService`.
 * - The `isLoggedIn` signal is used by the `authGuard` and other UI to
 *   reactively show/hide protected features. Do NOT use this for real
 *   production authentication without replacing it with a secure backend.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly KEY = 'auth_isLoggedIn_v1';

  // Signal indicating whether the user is considered authenticated.
  isLoggedIn = signal<boolean>(false);

  constructor(private storage: StorageService) {
    // Restore login state from storage on service init
    const saved = this.storage.get<boolean>(this.KEY);
    // normalize to boolean for simplicity: truthy -> true
    this.isLoggedIn.set(!!saved);
  }

  // Attempt to log in. Demo policy: any non-empty email/password succeeds.
  login(email: string, password: string): boolean {
    // Demo policy: accept any non-empty email & password.
    if (!email || !email.trim()) return false;
    if (!password || !password.trim()) return false;
    this.isLoggedIn.set(true);
    this.storage.set(this.KEY, true);
    return true;
  }

  // Log out: clear signal and persist the logged-out state.
  logout(): void {
    this.isLoggedIn.set(false);
    this.storage.set(this.KEY, false);
  }
}
