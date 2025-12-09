import { CanMatchFn, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export const guestGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  if (!auth.isAuthenticated()) return true;
  const router = inject(Router);
  return router.parseUrl('/dashboard') as UrlTree;
};

