import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';

export const DEMO_USER: User = {
  id: 'usr-001',
  email: 'demo@seccionamarilla.com',
  contactName: 'Juan Pérez',
  phone: '',
  password: 'Demo1234'
};

@Injectable({ providedIn: 'root' })
export class AuthMockService {
  private readonly KEY = 'sa_user';

  currentUser = signal<User | null>(this.load());

  private load(): User | null {
    const raw = sessionStorage.getItem(this.KEY);
    return raw ? JSON.parse(raw) : null;
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  setPassword(email: string, contactName: string, password: string): Observable<void> {
    const user: User = {
      id: crypto.randomUUID(),
      email,
      contactName,
      phone: '',
      password
    };
    sessionStorage.setItem(this.KEY, JSON.stringify(user));
    this.currentUser.set(user);
    return of(void 0);
  }

  login(email: string, password: string): Observable<boolean> {
    // Credenciales demo siempre disponibles
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      sessionStorage.setItem(this.KEY, JSON.stringify(DEMO_USER));
      this.currentUser.set(DEMO_USER);
      return of(true);
    }
    // Usuario creado en sesión actual
    const user = this.load();
    if (user && user.email === email && user.password === password) {
      this.currentUser.set(user);
      return of(true);
    }
    return of(false);
  }

  logout(): void {
    sessionStorage.removeItem(this.KEY);
    this.currentUser.set(null);
  }
}
