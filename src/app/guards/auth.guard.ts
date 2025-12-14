import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth.token') : null;
  if (!token) {
    const router = inject(Router);
    return router.parseUrl('/login');
  }
  return true;
};
