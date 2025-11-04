import { Injectable, signal } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly KEY = 'auth_isLoggedIn_v1';
  isLoggedIn = signal<boolean>(false);

  constructor(private storage: StorageService) {
    const saved = this.storage.get<boolean>(this.KEY);
    if (saved) this.isLoggedIn.set(true);
  }

  login(email: string, _password: string) {
    // Demo policy: accept any non-empty email & password.
    if (!email?.trim() || !_password?.trim()) return false;
    this.isLoggedIn.set(true);
    this.storage.set(this.KEY, true);
    return true;
  }

  logout() {
    this.isLoggedIn.set(false);
    this.storage.set(this.KEY, false);
  }
}
