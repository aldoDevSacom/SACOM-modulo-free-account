import { TestBed } from '@angular/core/testing';
import { AuthMockService } from './auth.mock.service';

describe('AuthMockService', () => {
  let service: AuthMockService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthMockService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('isLoggedIn() returns false when no session exists', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('setPassword() creates user and sets currentUser signal', (done) => {
    service.setPassword('test@mail.com', 'Test User', '1234').subscribe(() => {
      expect(service.isLoggedIn()).toBeTrue();
      expect(service.currentUser()?.email).toBe('test@mail.com');
      done();
    });
  });

  it('login() returns true for valid credentials', (done) => {
    service.setPassword('test@mail.com', 'Test User', 'Pass123').subscribe(() => {
      service.login('test@mail.com', 'Pass123').subscribe(result => {
        expect(result).toBeTrue();
        done();
      });
    });
  });

  it('login() returns false for invalid credentials', (done) => {
    service.login('no@exist.com', 'wrong').subscribe(result => {
      expect(result).toBeFalse();
      done();
    });
  });

  it('logout() clears currentUser signal', (done) => {
    service.setPassword('test@mail.com', 'Test', 'pass').subscribe(() => {
      service.logout();
      expect(service.isLoggedIn()).toBeFalse();
      expect(service.currentUser()).toBeNull();
      done();
    });
  });
});
