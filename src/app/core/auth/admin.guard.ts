import { CanMatchFn, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export const adminGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  if (auth.isAuthenticated() && auth.hasRole('admin')) return true;
  const router = inject(Router);
  return router.parseUrl('/login') as UrlTree;
};
