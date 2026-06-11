import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthMockService } from '../services/auth.mock.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthMockService);
  const router = inject(Router);
  return auth.isLoggedIn() ? true : router.createUrlTree(['/login']);
};
