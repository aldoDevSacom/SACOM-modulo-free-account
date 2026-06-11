import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthMockService } from '../services/auth.mock.service';

describe('authGuard', () => {
  let authService: AuthMockService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([])]
    });
    authService = TestBed.inject(AuthMockService);
  });

  it('returns true when user is logged in', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(true);
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBeTrue();
  });

  it('redirects to /login when user is not logged in', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(false);
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).not.toBeTrue();
  });
});
