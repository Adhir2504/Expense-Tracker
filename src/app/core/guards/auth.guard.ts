import { inject } from '@angular/core';
import { CanMatchFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Route guard used with `canMatch` to protect routes.
// If the user is not logged in it redirects to `/login` and includes a
// `returnUrl` param so the app can navigate back after successful login.
export const authGuard: CanMatchFn = (route, segments): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);
  // Signals are functions; call `isLoggedIn()` to read the current value.
  if (auth.isLoggedIn()) return true;

  const requested = '/' + segments.map(s => s.path).join('/');
  // Create a UrlTree that redirects to /login with the originally
  // requested path in query params so login can return the user.
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: requested || '/' } });
};
