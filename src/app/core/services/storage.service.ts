import { Injectable } from '@angular/core';

/**
 * Simple localStorage wrapper with explicit parsing helper to keep the
 * call-sites easy to read. Returning `null` on errors makes usage
 * predictable for newcomers.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private safeParse<T>(raw: string | null): T | null {
    if (!raw) return null;
    try { return JSON.parse(raw) as T; }
    catch { return null; }
  }

  get<T>(key: string): T | null {
    const raw = localStorage.getItem(key);
    return this.safeParse<T>(raw);
  }

  set(key: string, value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // In case storage is unavailable or quota exceeded, fail silently.
      // Keeping behavior simple: callers read nothing and can handle `null`.
      // For production apps you may want to surface/report this error.
      // eslint-disable-next-line no-console
      console.warn('StorageService.set failed', e);
    }
  }
}
