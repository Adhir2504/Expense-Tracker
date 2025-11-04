import { inject } from '@angular/core';
import { CanMatchFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanMatchFn = (route, segments): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;

  const requested = '/' + segments.map(s => s.path).join('/');
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: requested || '/' } });
};
