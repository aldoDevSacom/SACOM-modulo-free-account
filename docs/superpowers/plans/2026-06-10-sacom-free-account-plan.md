# SACOM Free Account Module — Implementation Plan

> **For agentic workers:** Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement task-by-task.

**Goal:** Angular SPA (module-based) que agrega `/crear-contrasena`, `/login` y `/dashboard` a seccionamarilla.com.mx para usuarios gratuitos.

**Architecture:** Tres feature modules lazy-loaded. Angular Signals + sessionStorage para mock state. Google Maps via `@angular/google-maps`. Charts via `ng2-charts`.

**Tech Stack:** Angular 18 (NgModules) · Signals · ReactiveFormsModule · @angular/google-maps · ng2-charts + chart.js · SCSS/BEM · Karma + Jasmine

> **Regla crítica:** Todo artefacto Angular (componentes, servicios, guards, módulos) se genera con `ng generate`. Nunca crear estos archivos a mano.

---

## Task 1: Inicializar proyecto Angular + dependencias + git

**Files:**
- Create: `package.json`, `angular.json`, `tsconfig.json` (generados por CLI)
- Create: `src/environments/environment.ts`
- Create: `src/environments/environment.prod.ts`

- [ ] **Step 1: Crear proyecto Angular en el directorio actual**

```bash
cd /Users/aldo/Aldo_en_mi_mac/ADNDigital/SACOM-modulo-free-account
ng new sacom-free-account --directory=. --routing --style=scss --no-standalone --skip-git
```

Cuando pregunte "Would you like to share pseudonymous usage data": responder `N`.

Expected: proyecto Angular creado con `src/`, `angular.json`, `package.json`.

- [ ] **Step 2: Instalar dependencias externas**

```bash
npm install @angular/google-maps ng2-charts chart.js
```

Expected: paquetes en `node_modules/`, versiones en `package.json`.

- [ ] **Step 3: Configurar environment para Google Maps API key**

Editar `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  googleMapsApiKey: 'TU_API_KEY_AQUI'
};
```

Editar `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  googleMapsApiKey: 'TU_API_KEY_AQUI'
};
```

- [ ] **Step 4: Inicializar git y primer commit**

```bash
git init
git add .
git commit -m "feat: initialize Angular project with routing and SCSS"
```

---

## Task 2: Estilos globales (variables, mixins, reset, tipografía)

**Files:**
- Create: `src/styles/_variables.scss`
- Create: `src/styles/_mixins.scss`
- Create: `src/styles/_reset.scss`
- Create: `src/styles/_typography.scss`
- Modify: `src/styles.scss`
- Modify: `src/index.html`

- [ ] **Step 1: Agregar Roboto a index.html**

En `src/index.html`, dentro de `<head>`, agregar:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;600;700&display=swap" rel="stylesheet">
```

- [ ] **Step 2: Crear `src/styles/_variables.scss`**

```scss
// Colores
$color-primary: #FFD800;
$color-primary-dark: #E5C200;
$color-bg: #F4F4F4;
$color-white: #FFFFFF;
$color-text: #333333;
$color-text-light: #666666;
$color-border: #CCCCCC;
$color-error: #D32F2F;
$color-success: #388E3C;

// Tipografía
$font-family: 'Roboto', Arial, sans-serif;
$font-weight-regular: 400;
$font-weight-semibold: 600;
$font-weight-bold: 700;

// Breakpoints (mobile-first)
$bp-md: 768px;
$bp-lg: 1024px;

// Espaciado
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;

// Border radius
$radius-sm: 4px;
$radius-md: 8px;
$radius-lg: 12px;
$radius-full: 9999px;
```

- [ ] **Step 3: Crear `src/styles/_mixins.scss`**

```scss
@use 'variables' as *;

@mixin md {
  @media (min-width: $bp-md) { @content; }
}

@mixin lg {
  @media (min-width: $bp-lg) { @content; }
}

@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin input-base {
  height: 32px;
  width: 100%;
  border-radius: $radius-lg;
  border: 1px solid $color-border;
  background-color: $color-white;
  padding: 0 $spacing-md;
  font-family: $font-family;
  font-size: 14px;
  color: $color-text;
  outline: none;

  &:focus {
    border-color: $color-primary;
  }
}
```

- [ ] **Step 4: Crear `src/styles/_reset.scss`**

```scss
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
}

img {
  max-width: 100%;
  display: block;
}

button {
  cursor: pointer;
}

a {
  text-decoration: none;
  color: inherit;
}
```

- [ ] **Step 5: Crear `src/styles/_typography.scss`**

```scss
@use 'variables' as *;

body {
  font-family: $font-family;
  font-size: 16px;
  color: $color-text;
  background-color: $color-bg;
}

label {
  font-weight: $font-weight-semibold;
  font-size: 14px;
  color: $color-text;
}

.error-msg {
  color: $color-error;
  font-size: 12px;
  margin-top: 4px;
}

.success-msg {
  color: $color-success;
  font-size: 14px;
  margin-top: 8px;
}
```

- [ ] **Step 6: Actualizar `src/styles.scss`**

```scss
@use 'styles/reset';
@use 'styles/variables' as *;
@use 'styles/mixins';
@use 'styles/typography';
```

- [ ] **Step 7: Verificar compilación**

```bash
ng build
```
Expected: compilación sin errores de SCSS.

- [ ] **Step 8: Commit**

```bash
git add src/
git commit -m "feat: add global styles, variables, mixins and typography"
```

---

## Task 3: Modelos de dominio + mock-data.json

**Files:**
- Create: `src/app/core/models/user.model.ts`
- Create: `src/app/core/models/business.model.ts`
- Create: `src/app/core/models/metrics.model.ts`
- Create: `src/assets/mock-data.json`

- [ ] **Step 1: Generar interfaces con el CLI**

```bash
ng generate interface core/models/user
ng generate interface core/models/business
ng generate interface core/models/metrics
```

Expected: tres archivos `.ts` en `src/app/core/models/`.

- [ ] **Step 2: Definir `src/app/core/models/user.ts`** (renombrar a `user.model.ts`)

```bash
mv src/app/core/models/user.ts src/app/core/models/user.model.ts
```

Contenido de `user.model.ts`:
```typescript
export interface User {
  id: string;
  email: string;
  contactName: string;
  phone: string;
  password: string;
}
```

- [ ] **Step 3: Definir `src/app/core/models/business.model.ts`**

```bash
mv src/app/core/models/business.ts src/app/core/models/business.model.ts
```

Contenido:
```typescript
export interface BusinessHours {
  open: string;
  close: string;
}

export interface BusinessAddress {
  fullAddress: string;
  street: string;
  exteriorNumber: string;
  colony: string;
  postalCode: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
}

export interface BusinessHoursSchedule {
  allDay: boolean;
  weekdays: BusinessHours | null;
  saturday: BusinessHours | null;
  sunday: BusinessHours | null;
}

export interface Business {
  id: string;
  userId: string;
  businessName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  categoryCode: number;
  category: string;
  website: string;
  publicPhone: string;
  products: string;
  logoUrl: string;
  address: BusinessAddress;
  hours: BusinessHoursSchedule;
}
```

- [ ] **Step 4: Definir `src/app/core/models/metrics.model.ts`**

```bash
mv src/app/core/models/metrics.ts src/app/core/models/metrics.model.ts
```

Contenido:
```typescript
export interface DailyMetric {
  date: string;
  clicks: number;
  impressions: number;
}

export interface Metrics {
  businessId: string;
  last30Days: DailyMetric[];
}
```

- [ ] **Step 5: Crear `src/assets/mock-data.json`**

```json
{
  "business": {
    "id": "biz-001",
    "userId": "usr-001",
    "businessName": "Taquería El Buen Sabor",
    "contactName": "Juan Pérez García",
    "contactEmail": "juan@buensabor.com",
    "contactPhone": "5551234567",
    "categoryCode": 5812,
    "category": "Restaurantes",
    "website": "https://www.buensabor.com",
    "publicPhone": "5559876543",
    "products": "tacos, quesadillas, tortas, burritos, sopes, tlayudas",
    "logoUrl": "",
    "address": {
      "fullAddress": "Av. Insurgentes Sur 123, Roma Norte, 06700 Ciudad de México, CDMX",
      "street": "Av. Insurgentes Sur",
      "exteriorNumber": "123",
      "colony": "Roma Norte",
      "postalCode": "06700",
      "city": "Ciudad de México",
      "state": "CDMX",
      "lat": 19.4195,
      "lng": -99.1674
    },
    "hours": {
      "allDay": false,
      "weekdays": { "open": "08:00", "close": "22:00" },
      "saturday": { "open": "09:00", "close": "23:00" },
      "sunday": { "open": "10:00", "close": "21:00" }
    }
  }
}
```

- [ ] **Step 6: Commit**

```bash
git add src/app/core/models/ src/assets/mock-data.json
git commit -m "feat: add domain models and mock seed data"
```

---

## Task 4: AuthMockService (TDD)

**Files:**
- Create: `src/app/core/services/auth.mock.service.ts`
- Create: `src/app/core/services/auth.mock.service.spec.ts`

- [ ] **Step 1: Generar servicio**

```bash
ng generate service core/services/auth.mock
```

Expected: `auth.mock.service.ts` + `auth.mock.service.spec.ts` en `src/app/core/services/`.

- [ ] **Step 2: Escribir tests en `auth.mock.service.spec.ts`**

```typescript
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
```

- [ ] **Step 3: Ejecutar tests (deben fallar)**

```bash
ng test --watch=false
```

Expected: FAILED — `setPassword`, `login`, `logout` no existen aún.

- [ ] **Step 4: Implementar `auth.mock.service.ts`**

```typescript
import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';

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
```

- [ ] **Step 5: Ejecutar tests (deben pasar)**

```bash
ng test --watch=false
```

Expected: todos los tests de `AuthMockService` en PASSED.

- [ ] **Step 6: Commit**

```bash
git add src/app/core/services/auth.mock.service.ts src/app/core/services/auth.mock.service.spec.ts
git commit -m "feat: add AuthMockService with Signals and sessionStorage"
```

---

## Task 5: BusinessMockService (TDD)

**Files:**
- Create: `src/app/core/services/business.mock.service.ts`
- Create: `src/app/core/services/business.mock.service.spec.ts`

- [ ] **Step 1: Generar servicio**

```bash
ng generate service core/services/business.mock
```

- [ ] **Step 2: Escribir tests en `business.mock.service.spec.ts`**

```typescript
import { TestBed } from '@angular/core/testing';
import { BusinessMockService } from './business.mock.service';

describe('BusinessMockService', () => {
  let service: BusinessMockService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessMockService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('getBusiness() returns the mock seed business', (done) => {
    service.getBusiness().subscribe(biz => {
      expect(biz.businessName).toBe('Taquería El Buen Sabor');
      done();
    });
  });

  it('updateBusiness() updates the signal and persists to sessionStorage', (done) => {
    service.updateBusiness({ businessName: 'Nuevo Nombre' }).subscribe(biz => {
      expect(biz.businessName).toBe('Nuevo Nombre');
      expect(service.business().businessName).toBe('Nuevo Nombre');
      const stored = JSON.parse(sessionStorage.getItem('sa_business')!);
      expect(stored.businessName).toBe('Nuevo Nombre');
      done();
    });
  });

  it('uploadLogo() converts File to base64 string', (done) => {
    const file = new File(['dummy'], 'logo.png', { type: 'image/png' });
    service.uploadLogo(file).subscribe(result => {
      expect(result).toContain('data:image/png;base64,');
      done();
    });
  });
});
```

- [ ] **Step 3: Ejecutar tests (deben fallar)**

```bash
ng test --watch=false
```

- [ ] **Step 4: Implementar `business.mock.service.ts`**

```typescript
import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Business } from '../models/business.model';
import mockData from '../../../assets/mock-data.json';

@Injectable({ providedIn: 'root' })
export class BusinessMockService {
  private readonly KEY = 'sa_business';

  business = signal<Business>(this.load());

  private load(): Business {
    const raw = sessionStorage.getItem(this.KEY);
    return raw ? JSON.parse(raw) : (mockData.business as Business);
  }

  getBusiness(): Observable<Business> {
    return of(this.business());
  }

  updateBusiness(data: Partial<Business>): Observable<Business> {
    const updated = { ...this.business(), ...data };
    sessionStorage.setItem(this.KEY, JSON.stringify(updated));
    this.business.set(updated);
    return of(updated);
  }

  uploadLogo(file: File): Observable<string> {
    return new Observable(observer => {
      const reader = new FileReader();
      reader.onload = () => {
        observer.next(reader.result as string);
        observer.complete();
      };
      reader.onerror = () => observer.error(reader.error);
      reader.readAsDataURL(file);
    });
  }
}
```

Para que TypeScript resuelva el JSON import, agregar a `tsconfig.json`:
```json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

- [ ] **Step 5: Ejecutar tests (deben pasar)**

```bash
ng test --watch=false
```

- [ ] **Step 6: Commit**

```bash
git add src/app/core/services/business.mock.service.ts src/app/core/services/business.mock.service.spec.ts tsconfig.json
git commit -m "feat: add BusinessMockService with Signals and sessionStorage"
```

---

## Task 6: MetricsMockService (TDD)

**Files:**
- Create: `src/app/core/services/metrics.mock.service.ts`
- Create: `src/app/core/services/metrics.mock.service.spec.ts`

- [ ] **Step 1: Generar servicio**

```bash
ng generate service core/services/metrics.mock
```

- [ ] **Step 2: Escribir tests en `metrics.mock.service.spec.ts`**

```typescript
import { TestBed } from '@angular/core/testing';
import { MetricsMockService } from './metrics.mock.service';

describe('MetricsMockService', () => {
  let service: MetricsMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetricsMockService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('getMetrics() returns exactly 30 data points', (done) => {
    service.getMetrics('biz-001').subscribe(metrics => {
      expect(metrics.last30Days.length).toBe(30);
      done();
    });
  });

  it('each data point has date, clicks and impressions > 0', (done) => {
    service.getMetrics('biz-001').subscribe(metrics => {
      metrics.last30Days.forEach(point => {
        expect(point.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(point.clicks).toBeGreaterThan(0);
        expect(point.impressions).toBeGreaterThan(0);
      });
      done();
    });
  });

  it('getMetrics() returns same values on repeated calls (deterministic)', (done) => {
    service.getMetrics('biz-001').subscribe(first => {
      service.getMetrics('biz-001').subscribe(second => {
        expect(first.last30Days[0].clicks).toBe(second.last30Days[0].clicks);
        done();
      });
    });
  });
});
```

- [ ] **Step 3: Ejecutar tests (deben fallar)**

```bash
ng test --watch=false
```

- [ ] **Step 4: Implementar `metrics.mock.service.ts`**

```typescript
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DailyMetric, Metrics } from '../models/metrics.model';

@Injectable({ providedIn: 'root' })
export class MetricsMockService {
  getMetrics(businessId: string): Observable<Metrics> {
    return of({ businessId, last30Days: this.generate() });
  }

  private generate(): DailyMetric[] {
    const result: DailyMetric[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const s = i + 1;
      result.push({
        date: d.toISOString().split('T')[0],
        clicks: Math.floor(Math.abs(Math.sin(s * 2.3)) * 80) + 15,
        impressions: Math.floor(Math.abs(Math.cos(s * 1.7)) * 300) + 80
      });
    }
    return result;
  }
}
```

- [ ] **Step 5: Ejecutar tests (deben pasar)**

```bash
ng test --watch=false
```

- [ ] **Step 6: Commit**

```bash
git add src/app/core/services/metrics.mock.service.ts src/app/core/services/metrics.mock.service.spec.ts
git commit -m "feat: add MetricsMockService with deterministic 30-day data"
```

---

## Task 7: AuthGuard (TDD)

**Files:**
- Create: `src/app/core/guards/auth.guard.ts`
- Create: `src/app/core/guards/auth.guard.spec.ts`

- [ ] **Step 1: Generar guard**

```bash
ng generate guard core/guards/auth
```

Cuando pregunte qué interfaz implementar: seleccionar `CanActivate`.

- [ ] **Step 2: Escribir tests en `auth.guard.spec.ts`**

```typescript
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { authGuard } from './auth.guard';
import { AuthMockService } from '../services/auth.mock.service';

describe('authGuard', () => {
  let authService: AuthMockService;
  let router: Router;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    });
    authService = TestBed.inject(AuthMockService);
    router = TestBed.inject(Router);
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
```

- [ ] **Step 3: Ejecutar tests (deben fallar)**

```bash
ng test --watch=false
```

- [ ] **Step 4: Implementar `auth.guard.ts`**

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthMockService } from '../services/auth.mock.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthMockService);
  const router = inject(Router);
  return auth.isLoggedIn() ? true : router.createUrlTree(['/login']);
};
```

- [ ] **Step 5: Ejecutar tests (deben pasar)**

```bash
ng test --watch=false
```

- [ ] **Step 6: Commit**

```bash
git add src/app/core/guards/
git commit -m "feat: add AuthGuard protecting /dashboard routes"
```

---

## Task 8: App routing (lazy loading) + PasswordStrength component

**Files:**
- Modify: `src/app/app-routing.module.ts`
- Create: `src/app/shared/components/password-strength/` (via CLI)

- [ ] **Step 1: Configurar lazy loading en `app-routing.module.ts`**

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'crear-contrasena',
    loadChildren: () =>
      import('./features/crear-contrasena/crear-contrasena.module').then(m => m.CrearContrasenaModule)
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./features/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

- [ ] **Step 2: Generar SharedModule y PasswordStrengthComponent**

```bash
ng generate module shared
ng generate component shared/components/password-strength --module=shared --export
```

- [ ] **Step 3: Implementar `password-strength.component.ts`**

```typescript
import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-strength',
  templateUrl: './password-strength.component.html',
  styleUrls: ['./password-strength.component.scss']
})
export class PasswordStrengthComponent implements OnChanges {
  @Input() password = '';
  strength = 0;
  label = '';

  ngOnChanges(): void {
    this.strength = this.calculate(this.password);
    this.label = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'][this.strength];
  }

  private calculate(pwd: string): number {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  }
}
```

- [ ] **Step 4: Implementar `password-strength.component.html`**

```html
<div class="pwd-strength" *ngIf="password">
  <div class="pwd-strength__bars">
    <span class="pwd-strength__bar"
      [class.pwd-strength__bar--active]="strength >= 1"
      [class.pwd-strength__bar--weak]="strength === 1"></span>
    <span class="pwd-strength__bar"
      [class.pwd-strength__bar--active]="strength >= 2"
      [class.pwd-strength__bar--fair]="strength === 2"></span>
    <span class="pwd-strength__bar"
      [class.pwd-strength__bar--active]="strength >= 3"
      [class.pwd-strength__bar--good]="strength === 3"></span>
    <span class="pwd-strength__bar"
      [class.pwd-strength__bar--active]="strength >= 4"
      [class.pwd-strength__bar--strong]="strength === 4"></span>
  </div>
  <span class="pwd-strength__label">{{ label }}</span>
</div>
```

- [ ] **Step 5: Implementar `password-strength.component.scss`**

```scss
@use '../../../../styles/variables' as *;

.pwd-strength {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;

  &__bars {
    display: flex;
    gap: 4px;
    flex: 1;
  }

  &__bar {
    flex: 1;
    height: 4px;
    border-radius: 2px;
    background-color: $color-border;
    transition: background-color 0.2s;

    &--active { background-color: $color-border; }
    &--weak { background-color: $color-error; }
    &--fair { background-color: #FFA000; }
    &--good { background-color: #7CB342; }
    &--strong { background-color: $color-success; }
  }

  &__label {
    font-size: 12px;
    color: $color-text-light;
    width: 50px;
    text-align: right;
  }
}
```

- [ ] **Step 6: Test del componente**

```bash
ng test --watch=false
```

Expected: `PasswordStrengthComponent` spec pasa (crea el componente sin error).

- [ ] **Step 7: Commit**

```bash
git add src/app/app-routing.module.ts src/app/shared/
git commit -m "feat: configure lazy loading routes and add PasswordStrength component"
```

---

## Task 9: Feature CrearContrasena

**Files:**
- Create: `src/app/features/crear-contrasena/` (módulo + componente)

- [ ] **Step 1: Generar módulo y componente**

```bash
ng generate module features/crear-contrasena --routing
ng generate component features/crear-contrasena/crear-contrasena --module=features/crear-contrasena
```

- [ ] **Step 2: Configurar ruta en `crear-contrasena-routing.module.ts`**

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearContrasenaComponent } from './crear-contrasena/crear-contrasena.component';

const routes: Routes = [
  { path: '', component: CrearContrasenaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrearContrasenaRoutingModule {}
```

- [ ] **Step 3: Importar ReactiveFormsModule y SharedModule en `crear-contrasena.module.ts`**

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CrearContrasenaRoutingModule } from './crear-contrasena-routing.module';
import { CrearContrasenaComponent } from './crear-contrasena/crear-contrasena.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [CrearContrasenaComponent],
  imports: [CommonModule, ReactiveFormsModule, CrearContrasenaRoutingModule, SharedModule]
})
export class CrearContrasenaModule {}
```

- [ ] **Step 4: Implementar `crear-contrasena.component.ts`**

```typescript
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthMockService } from '../../../core/services/auth.mock.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const pwd = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return pwd && confirm && pwd !== confirm ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-crear-contrasena',
  templateUrl: './crear-contrasena.component.html',
  styleUrls: ['./crear-contrasena.component.scss']
})
export class CrearContrasenaComponent implements OnInit {
  form!: FormGroup;
  email = '';
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthMockService
  ) {}

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';
    if (!this.email) {
      this.router.navigate(['/login']);
      return;
    }
    this.form = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/(?=.*[A-Z])(?=.*[0-9])/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  get password() { return this.form.get('password')!; }
  get confirmPassword() { return this.form.get('confirmPassword')!; }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.auth.setPassword(this.email, '', this.password.value).subscribe(() => {
      this.router.navigate(['/dashboard/metricas']);
    });
  }
}
```

- [ ] **Step 5: Implementar `crear-contrasena.component.html`**

```html
<div class="crear-pwd">
  <div class="crear-pwd__card">
    <img src="assets/logo-sa.svg" alt="Sección Amarilla" class="crear-pwd__logo">
    <h1 class="crear-pwd__title">Crea tu contraseña</h1>
    <p class="crear-pwd__subtitle">Tu usuario es: <strong>{{ email }}</strong></p>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="crear-pwd__form">

      <div class="crear-pwd__field">
        <label for="password">Contraseña</label>
        <input id="password" type="password" formControlName="password" class="crear-pwd__input"
          [class.crear-pwd__input--error]="password.invalid && password.touched">
        <app-password-strength [password]="password.value"></app-password-strength>
        <span class="error-msg" *ngIf="password.touched && password.hasError('required')">
          La contraseña es requerida
        </span>
        <span class="error-msg" *ngIf="password.touched && password.hasError('minlength')">
          Mínimo 8 caracteres
        </span>
        <span class="error-msg" *ngIf="password.touched && password.hasError('pattern')">
          Debe incluir al menos una mayúscula y un número
        </span>
      </div>

      <div class="crear-pwd__field">
        <label for="confirmPassword">Confirmar contraseña</label>
        <input id="confirmPassword" type="password" formControlName="confirmPassword" class="crear-pwd__input"
          [class.crear-pwd__input--error]="form.hasError('passwordMismatch') && confirmPassword.touched">
        <span class="error-msg" *ngIf="form.hasError('passwordMismatch') && confirmPassword.touched">
          Las contraseñas no coinciden
        </span>
      </div>

      <button type="submit" class="crear-pwd__btn" [disabled]="form.invalid">
        CREAR CONTRASEÑA
      </button>
    </form>
  </div>
</div>
```

- [ ] **Step 6: Implementar `crear-contrasena.component.scss`**

```scss
@use '../../../../styles/variables' as *;
@use '../../../../styles/mixins' as *;

.crear-pwd {
  min-height: 100vh;
  background-color: $color-bg;
  @include flex-center;
  padding: $spacing-md;

  &__card {
    background: $color-white;
    border-radius: $radius-lg;
    padding: $spacing-xl;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    text-align: center;
  }

  &__logo {
    height: 40px;
    margin: 0 auto $spacing-lg;
  }

  &__title {
    font-size: 22px;
    font-weight: $font-weight-bold;
    margin-bottom: $spacing-sm;
  }

  &__subtitle {
    font-size: 14px;
    color: $color-text-light;
    margin-bottom: $spacing-lg;
  }

  &__form {
    text-align: left;
  }

  &__field {
    margin-bottom: $spacing-md;

    label {
      display: block;
      margin-bottom: 4px;
    }
  }

  &__input {
    @include input-base;

    &--error {
      border-color: $color-error;
    }
  }

  &__btn {
    width: 100%;
    padding: 10px;
    border-radius: $radius-full;
    border: none;
    background-color: $color-primary;
    font-weight: $font-weight-bold;
    font-size: 14px;
    margin-top: $spacing-md;
    transition: background-color 0.2s;

    &:hover:not(:disabled) {
      background-color: $color-primary-dark;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
```

- [ ] **Step 7: Ejecutar tests**

```bash
ng test --watch=false
```

Expected: spec de `CrearContrasenaComponent` pasa (crea el componente).

- [ ] **Step 8: Commit**

```bash
git add src/app/features/crear-contrasena/
git commit -m "feat: add CrearContrasena feature with reactive form and password validation"
```

---

## Task 10: Feature Login

**Files:**
- Create: `src/app/features/login/` (módulo + componente)

- [ ] **Step 1: Generar módulo y componente**

```bash
ng generate module features/login --routing
ng generate component features/login/login --module=features/login
```

- [ ] **Step 2: Configurar ruta en `login-routing.module.ts`**

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {}
```

- [ ] **Step 3: Actualizar `login.module.ts`**

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, ReactiveFormsModule, LoginRoutingModule]
})
export class LoginModule {}
```

- [ ] **Step 4: Implementar `login.component.ts`**

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthMockService } from '../../../core/services/auth.mock.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  errorMsg = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthMockService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    this.auth.login(this.email.value, this.password.value).subscribe(success => {
      this.loading = false;
      if (success) {
        this.router.navigate(['/dashboard/metricas']);
      } else {
        this.errorMsg = 'Correo o contraseña incorrectos.';
      }
    });
  }
}
```

- [ ] **Step 5: Implementar `login.component.html`**

```html
<div class="login">
  <div class="login__card">
    <img src="assets/logo-sa.svg" alt="Sección Amarilla" class="login__logo">
    <h1 class="login__title">Accede a tu panel</h1>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="login__form">

      <div class="login__field">
        <label for="email">Correo electrónico</label>
        <input id="email" type="email" formControlName="email" class="login__input"
          [class.login__input--error]="email.invalid && email.touched">
        <span class="error-msg" *ngIf="email.touched && email.hasError('required')">El correo es requerido</span>
        <span class="error-msg" *ngIf="email.touched && email.hasError('email')">Ingresa un correo válido</span>
      </div>

      <div class="login__field">
        <label for="password">Contraseña</label>
        <input id="password" type="password" formControlName="password" class="login__input"
          [class.login__input--error]="password.invalid && password.touched">
        <span class="error-msg" *ngIf="password.touched && password.hasError('required')">La contraseña es requerida</span>
      </div>

      <span class="error-msg login__error-global" *ngIf="errorMsg">{{ errorMsg }}</span>

      <button type="submit" class="login__btn" [disabled]="form.invalid || loading">
        {{ loading ? 'INGRESANDO...' : 'INGRESAR' }}
      </button>
    </form>

    <p class="login__register-link">
      ¿Aún no tienes cuenta?
      <a href="https://www.seccionamarilla.com.mx/registra-tu-empresa" target="_blank">Regístrate aquí</a>
    </p>
  </div>
</div>
```

- [ ] **Step 6: Implementar `login.component.scss`**

```scss
@use '../../../../styles/variables' as *;
@use '../../../../styles/mixins' as *;

.login {
  min-height: 100vh;
  background-color: $color-bg;
  @include flex-center;
  padding: $spacing-md;

  &__card {
    background: $color-white;
    border-radius: $radius-lg;
    padding: $spacing-xl;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    text-align: center;
  }

  &__logo {
    height: 40px;
    margin: 0 auto $spacing-lg;
  }

  &__title {
    font-size: 22px;
    font-weight: $font-weight-bold;
    margin-bottom: $spacing-lg;
  }

  &__form { text-align: left; }

  &__field {
    margin-bottom: $spacing-md;
    label { display: block; margin-bottom: 4px; }
  }

  &__input {
    @include input-base;
    &--error { border-color: $color-error; }
  }

  &__error-global {
    display: block;
    text-align: center;
    margin-bottom: $spacing-sm;
  }

  &__btn {
    width: 100%;
    padding: 10px;
    border-radius: $radius-full;
    border: none;
    background-color: $color-primary;
    font-weight: $font-weight-bold;
    font-size: 14px;
    margin-top: $spacing-sm;
    transition: background-color 0.2s;

    &:hover:not(:disabled) { background-color: $color-primary-dark; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }

  &__register-link {
    margin-top: $spacing-lg;
    font-size: 13px;
    color: $color-text-light;

    a { color: $color-text; font-weight: $font-weight-semibold; text-decoration: underline; }
  }
}
```

- [ ] **Step 7: Commit**

```bash
git add src/app/features/login/
git commit -m "feat: add Login feature with reactive form and error handling"
```

---

## Task 11: Dashboard — módulo, shell y navegación

**Files:**
- Create: `src/app/features/dashboard/` (módulo, shell, header, nav-lateral, nav-inferior)

- [ ] **Step 1: Generar módulo y componentes**

```bash
ng generate module features/dashboard --routing
ng generate component features/dashboard/dashboard --module=features/dashboard
ng generate component features/dashboard/components/header --module=features/dashboard
ng generate component features/dashboard/components/nav-lateral --module=features/dashboard
ng generate component features/dashboard/components/nav-inferior --module=features/dashboard
```

- [ ] **Step 2: Configurar `dashboard-routing.module.ts`**

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'metricas', pathMatch: 'full' },
      {
        path: 'metricas',
        loadChildren: () =>
          import('./metricas/metricas.module').then(m => m.MetricasModule)
      },
      {
        path: 'mi-negocio',
        loadChildren: () =>
          import('./mi-negocio/mi-negocio.module').then(m => m.MiNegocioModule)
      },
      {
        path: 'seguridad',
        loadChildren: () =>
          import('./seguridad/seguridad.module').then(m => m.SeguridadModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
```

- [ ] **Step 3: Actualizar `dashboard.module.ts`**

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { NavLateralComponent } from './components/nav-lateral/nav-lateral.component';
import { NavInferiorComponent } from './components/nav-inferior/nav-inferior.component';

@NgModule({
  declarations: [DashboardComponent, HeaderComponent, NavLateralComponent, NavInferiorComponent],
  imports: [CommonModule, RouterModule, DashboardRoutingModule]
})
export class DashboardModule {}
```

- [ ] **Step 4: Implementar `dashboard.component.ts`**

```typescript
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthMockService } from '../../../core/services/auth.mock.service';
import { BusinessMockService } from '../../../core/services/business.mock.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  businessName = this.businessService.business().businessName;

  constructor(
    private auth: AuthMockService,
    private businessService: BusinessMockService,
    private router: Router
  ) {}

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
```

- [ ] **Step 5: Implementar `dashboard.component.html`**

```html
<div class="dashboard">
  <app-header [businessName]="businessName" (logoutEvent)="logout()"></app-header>
  <div class="dashboard__body">
    <app-nav-lateral class="dashboard__nav-lateral"></app-nav-lateral>
    <main class="dashboard__content">
      <router-outlet></router-outlet>
    </main>
  </div>
  <app-nav-inferior class="dashboard__nav-inferior"></app-nav-inferior>
</div>
```

- [ ] **Step 6: Implementar `dashboard.component.scss`**

```scss
@use '../../../../styles/variables' as *;
@use '../../../../styles/mixins' as *;

.dashboard {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__body {
    display: flex;
    flex: 1;
  }

  &__nav-lateral {
    display: none;
    @include md { display: block; width: 220px; flex-shrink: 0; }
  }

  &__content {
    flex: 1;
    padding: $spacing-lg;
    overflow-y: auto;
  }

  &__nav-inferior {
    @include md { display: none; }
  }
}
```

- [ ] **Step 7: Implementar header, nav-lateral y nav-inferior**

`header.component.ts`:
```typescript
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() businessName = '';
  @Output() logoutEvent = new EventEmitter<void>();
}
```

`header.component.html`:
```html
<header class="header">
  <img src="assets/logo-sa.svg" alt="Sección Amarilla" class="header__logo">
  <span class="header__business">{{ businessName }}</span>
  <button class="header__logout" (click)="logoutEvent.emit()">Cerrar sesión</button>
</header>
```

`header.component.scss`:
```scss
@use '../../../../../styles/variables' as *;

.header {
  display: flex;
  align-items: center;
  background: $color-white;
  border-bottom: 1px solid $color-border;
  padding: 12px 24px;
  gap: 16px;

  &__logo { height: 32px; }
  &__business { flex: 1; font-weight: $font-weight-semibold; font-size: 14px; }
  &__logout {
    border: 1px solid $color-border;
    background: transparent;
    border-radius: $radius-full;
    padding: 6px 16px;
    font-size: 13px;
    &:hover { background: $color-bg; }
  }
}
```

`nav-lateral.component.html`:
```html
<nav class="nav-lateral">
  <a routerLink="/dashboard/metricas" routerLinkActive="nav-lateral__item--active" class="nav-lateral__item">
    Métricas
  </a>
  <a routerLink="/dashboard/mi-negocio" routerLinkActive="nav-lateral__item--active" class="nav-lateral__item">
    Mi negocio
  </a>
  <a routerLink="/dashboard/seguridad" routerLinkActive="nav-lateral__item--active" class="nav-lateral__item">
    Seguridad
  </a>
</nav>
```

`nav-lateral.component.scss`:
```scss
@use '../../../../../styles/variables' as *;

.nav-lateral {
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  background: $color-white;
  border-right: 1px solid $color-border;

  &__item {
    padding: 12px 24px;
    font-size: 14px;
    font-weight: $font-weight-semibold;
    color: $color-text;
    border-left: 3px solid transparent;
    transition: all 0.2s;

    &:hover { background: $color-bg; }
    &--active { border-left-color: $color-primary; background: $color-bg; }
  }
}
```

`nav-inferior.component.html`:
```html
<nav class="nav-inferior">
  <a routerLink="/dashboard/metricas" routerLinkActive="nav-inferior__item--active" class="nav-inferior__item">
    Métricas
  </a>
  <a routerLink="/dashboard/mi-negocio" routerLinkActive="nav-inferior__item--active" class="nav-inferior__item">
    Mi negocio
  </a>
  <a routerLink="/dashboard/seguridad" routerLinkActive="nav-inferior__item--active" class="nav-inferior__item">
    Seguridad
  </a>
</nav>
```

`nav-inferior.component.scss`:
```scss
@use '../../../../../styles/variables' as *;

.nav-inferior {
  display: flex;
  position: sticky;
  bottom: 0;
  background: $color-white;
  border-top: 1px solid $color-border;

  &__item {
    flex: 1;
    text-align: center;
    padding: 12px 0;
    font-size: 12px;
    font-weight: $font-weight-semibold;
    color: $color-text-light;

    &--active { color: $color-text; border-top: 2px solid $color-primary; }
  }
}
```

Agregar `RouterModule` imports a `nav-lateral.module` y `nav-inferior` — ya está incluido vía `DashboardModule`.

- [ ] **Step 8: Commit**

```bash
git add src/app/features/dashboard/
git commit -m "feat: add Dashboard shell with header and responsive navigation"
```

---

## Task 12: Feature Métricas (gráfica de línea)

**Files:**
- Create: `src/app/features/dashboard/metricas/`

- [ ] **Step 1: Generar módulo y componentes**

```bash
ng generate module features/dashboard/metricas
ng generate component features/dashboard/metricas/metricas --module=features/dashboard/metricas --export
ng generate component features/dashboard/metricas/line-chart --module=features/dashboard/metricas --export
```

- [ ] **Step 2: Crear `metricas.module.ts`**

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { MetricasComponent } from './metricas/metricas.component';
import { LineChartComponent } from './line-chart/line-chart.component';

const routes: Routes = [{ path: '', component: MetricasComponent }];

@NgModule({
  declarations: [MetricasComponent, LineChartComponent],
  imports: [CommonModule, RouterModule.forChild(routes), NgChartsModule]
})
export class MetricasModule {}
```

- [ ] **Step 3: Implementar `metricas.component.ts`**

```typescript
import { Component, OnInit } from '@angular/core';
import { MetricsMockService } from '../../../../core/services/metrics.mock.service';
import { BusinessMockService } from '../../../../core/services/business.mock.service';
import { DailyMetric } from '../../../../core/models/metrics.model';

@Component({
  selector: 'app-metricas',
  templateUrl: './metricas.component.html',
  styleUrls: ['./metricas.component.scss']
})
export class MetricasComponent implements OnInit {
  data: DailyMetric[] = [];
  totalClicks = 0;
  totalImpressions = 0;

  constructor(
    private metricsService: MetricsMockService,
    private businessService: BusinessMockService
  ) {}

  ngOnInit(): void {
    const bizId = this.businessService.business().id;
    this.metricsService.getMetrics(bizId).subscribe(m => {
      this.data = m.last30Days;
      this.totalClicks = this.data.reduce((s, d) => s + d.clicks, 0);
      this.totalImpressions = this.data.reduce((s, d) => s + d.impressions, 0);
    });
  }
}
```

- [ ] **Step 4: Implementar `metricas.component.html`**

```html
<div class="metricas">
  <h2 class="metricas__title">Métricas — últimos 30 días</h2>

  <div class="metricas__kpis">
    <div class="metricas__kpi">
      <span class="metricas__kpi-value">{{ totalClicks | number }}</span>
      <span class="metricas__kpi-label">Clics totales</span>
    </div>
    <div class="metricas__kpi">
      <span class="metricas__kpi-value">{{ totalImpressions | number }}</span>
      <span class="metricas__kpi-label">Impresiones totales</span>
    </div>
  </div>

  <div class="metricas__chart">
    <app-line-chart [data]="data"></app-line-chart>
  </div>
</div>
```

- [ ] **Step 5: Implementar `metricas.component.scss`**

```scss
@use '../../../../../styles/variables' as *;

.metricas {
  &__title { font-size: 20px; font-weight: $font-weight-bold; margin-bottom: 24px; }

  &__kpis {
    display: flex;
    gap: 16px;
    margin-bottom: 32px;
  }

  &__kpi {
    flex: 1;
    background: $color-white;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 1px 6px rgba(0,0,0,0.06);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__kpi-value {
    font-size: 28px;
    font-weight: $font-weight-bold;
  }

  &__kpi-label {
    font-size: 13px;
    color: $color-text-light;
  }

  &__chart {
    background: $color-white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 1px 6px rgba(0,0,0,0.06);
  }
}
```

- [ ] **Step 6: Implementar `line-chart.component.ts`**

```typescript
import { Component, Input, OnChanges } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { DailyMetric } from '../../../../core/models/metrics.model';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html'
})
export class LineChartComponent implements OnChanges {
  @Input() data: DailyMetric[] = [];

  chartData: ChartData<'line'> = { labels: [], datasets: [] };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    plugins: { legend: { position: 'top' } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true }
    }
  };

  ngOnChanges(): void {
    if (!this.data.length) return;
    this.chartData = {
      labels: this.data.map(d => {
        const [, m, day] = d.date.split('-');
        return `${day}/${m}`;
      }),
      datasets: [
        {
          label: 'Clics',
          data: this.data.map(d => d.clicks),
          borderColor: '#FFD800',
          backgroundColor: 'rgba(255,216,0,0.1)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Impresiones',
          data: this.data.map(d => d.impressions),
          borderColor: '#333333',
          backgroundColor: 'rgba(51,51,51,0.05)',
          tension: 0.3,
          fill: true
        }
      ]
    };
  }
}
```

- [ ] **Step 7: Implementar `line-chart.component.html`**

```html
<canvas baseChart [data]="chartData" [options]="chartOptions" type="line"></canvas>
```

- [ ] **Step 8: Commit**

```bash
git add src/app/features/dashboard/metricas/
git commit -m "feat: add Metricas feature with KPI cards and line chart"
```

---

## Task 13: Feature Mi Negocio — BusinessForm + MapPicker

**Files:**
- Create: `src/app/features/dashboard/mi-negocio/`

- [ ] **Step 1: Generar módulo y componentes**

```bash
ng generate module features/dashboard/mi-negocio
ng generate component features/dashboard/mi-negocio/mi-negocio --module=features/dashboard/mi-negocio --export
ng generate component features/dashboard/mi-negocio/business-form --module=features/dashboard/mi-negocio
ng generate component features/dashboard/mi-negocio/map-picker --module=features/dashboard/mi-negocio
```

- [ ] **Step 2: Crear `mi-negocio.module.ts`**

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { MiNegocioComponent } from './mi-negocio/mi-negocio.component';
import { BusinessFormComponent } from './business-form/business-form.component';
import { MapPickerComponent } from './map-picker/map-picker.component';

const routes: Routes = [{ path: '', component: MiNegocioComponent }];

@NgModule({
  declarations: [MiNegocioComponent, BusinessFormComponent, MapPickerComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes), GoogleMapsModule]
})
export class MiNegocioModule {}
```

- [ ] **Step 3: Cargar Google Maps API en `index.html`**

Dentro de `<head>`, reemplazar `TU_API_KEY_AQUI` con tu clave real:
```html
<script>
  (g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})
  ({key: "TU_API_KEY_AQUI", v: "weekly"});
</script>
```

- [ ] **Step 4: Implementar `mi-negocio.component.ts`**

```typescript
import { Component, OnInit } from '@angular/core';
import { Business } from '../../../../core/models/business.model';
import { BusinessMockService } from '../../../../core/services/business.mock.service';

@Component({
  selector: 'app-mi-negocio',
  templateUrl: './mi-negocio.component.html',
  styleUrls: ['./mi-negocio.component.scss']
})
export class MiNegocioComponent implements OnInit {
  business!: Business;
  saved = false;

  constructor(private businessService: BusinessMockService) {}

  ngOnInit(): void {
    this.businessService.getBusiness().subscribe(b => this.business = b);
  }

  onSave(data: Business): void {
    this.businessService.updateBusiness(data).subscribe(() => {
      this.saved = true;
      setTimeout(() => this.saved = false, 3000);
    });
  }
}
```

- [ ] **Step 5: Implementar `mi-negocio.component.html`**

```html
<div class="mi-negocio">
  <h2 class="mi-negocio__title">Mi negocio</h2>
  <span class="success-msg" *ngIf="saved">¡Cambios guardados correctamente!</span>
  <app-business-form
    *ngIf="business"
    [business]="business"
    (saveEvent)="onSave($event)">
  </app-business-form>
</div>
```

- [ ] **Step 6: Implementar `business-form.component.ts`**

```typescript
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Business, BusinessAddress } from '../../../../core/models/business.model';
import { BusinessMockService } from '../../../../core/services/business.mock.service';

@Component({
  selector: 'app-business-form',
  templateUrl: './business-form.component.html',
  styleUrls: ['./business-form.component.scss']
})
export class BusinessFormComponent implements OnInit {
  @Input() business!: Business;
  @Output() saveEvent = new EventEmitter<Business>();

  form!: FormGroup;
  logoPreview = '';

  constructor(private fb: FormBuilder, private businessService: BusinessMockService) {}

  ngOnInit(): void {
    this.logoPreview = this.business.logoUrl;
    this.form = this.fb.group({
      contactName: [this.business.contactName, Validators.required],
      contactEmail: [this.business.contactEmail, [Validators.required, Validators.email]],
      contactPhone: [this.business.contactPhone, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      businessName: [this.business.businessName, Validators.required],
      category: [this.business.category, Validators.required],
      website: [this.business.website],
      publicPhone: [this.business.publicPhone, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      products: [this.business.products, Validators.required],
      fullAddress: [this.business.address.fullAddress],
      street: [this.business.address.street],
      exteriorNumber: [this.business.address.exteriorNumber],
      colony: [this.business.address.colony],
      postalCode: [this.business.address.postalCode],
      city: [this.business.address.city],
      state: [this.business.address.state],
      lat: [this.business.address.lat],
      lng: [this.business.address.lng],
      allDay: [this.business.hours.allDay],
      wdOpen: [this.business.hours.weekdays?.open ?? ''],
      wdClose: [this.business.hours.weekdays?.close ?? ''],
      satOpen: [this.business.hours.saturday?.open ?? ''],
      satClose: [this.business.hours.saturday?.close ?? ''],
      sunOpen: [this.business.hours.sunday?.open ?? ''],
      sunClose: [this.business.hours.sunday?.close ?? '']
    });
  }

  onLogoChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.businessService.uploadLogo(file).subscribe(url => {
      this.logoPreview = url;
      this.form.patchValue({ logoUrl: url });
    });
  }

  onAddressChange(addr: BusinessAddress): void {
    this.form.patchValue(addr);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const updated: Business = {
      ...this.business,
      contactName: v.contactName,
      contactEmail: v.contactEmail,
      contactPhone: v.contactPhone,
      businessName: v.businessName,
      category: v.category,
      website: v.website,
      publicPhone: v.publicPhone,
      products: v.products,
      logoUrl: this.logoPreview,
      address: {
        fullAddress: v.fullAddress,
        street: v.street,
        exteriorNumber: v.exteriorNumber,
        colony: v.colony,
        postalCode: v.postalCode,
        city: v.city,
        state: v.state,
        lat: v.lat,
        lng: v.lng
      },
      hours: {
        allDay: v.allDay,
        weekdays: v.allDay ? null : { open: v.wdOpen, close: v.wdClose },
        saturday: v.allDay ? null : { open: v.satOpen, close: v.satClose },
        sunday: v.allDay ? null : { open: v.sunOpen, close: v.sunClose }
      }
    };
    this.saveEvent.emit(updated);
  }

  onCancel(): void {
    this.ngOnInit();
  }
}
```

- [ ] **Step 7: Implementar `business-form.component.html`**

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()" class="biz-form">

  <section class="biz-form__section">
    <h3 class="biz-form__section-title">Datos de contacto</h3>
    <div class="biz-form__grid biz-form__grid--3">
      <div class="biz-form__field">
        <label>Nombre completo</label>
        <input type="text" formControlName="contactName" class="biz-form__input">
      </div>
      <div class="biz-form__field">
        <label>Correo</label>
        <input type="email" formControlName="contactEmail" class="biz-form__input">
      </div>
      <div class="biz-form__field">
        <label>Teléfono</label>
        <input type="text" formControlName="contactPhone" maxlength="10" class="biz-form__input">
      </div>
    </div>
  </section>

  <section class="biz-form__section">
    <h3 class="biz-form__section-title">Datos del negocio</h3>
    <div class="biz-form__field">
      <label>Nombre comercial</label>
      <input type="text" formControlName="businessName" class="biz-form__input">
    </div>

    <app-map-picker
      [lat]="business.address.lat"
      [lng]="business.address.lng"
      (addressChange)="onAddressChange($event)">
    </app-map-picker>

    <div class="biz-form__field">
      <label>Dirección completa</label>
      <input type="text" formControlName="fullAddress" class="biz-form__input" readonly>
    </div>

    <div class="biz-form__grid biz-form__grid--3">
      <div class="biz-form__field">
        <label>Calle</label>
        <input type="text" formControlName="street" class="biz-form__input" readonly>
      </div>
      <div class="biz-form__field">
        <label>Número</label>
        <input type="text" formControlName="exteriorNumber" class="biz-form__input" readonly>
      </div>
      <div class="biz-form__field">
        <label>Colonia</label>
        <input type="text" formControlName="colony" class="biz-form__input" readonly>
      </div>
    </div>

    <div class="biz-form__grid biz-form__grid--3">
      <div class="biz-form__field">
        <label>Código postal</label>
        <input type="text" formControlName="postalCode" class="biz-form__input" readonly>
      </div>
      <div class="biz-form__field">
        <label>Ciudad</label>
        <input type="text" formControlName="city" class="biz-form__input" readonly>
      </div>
      <div class="biz-form__field">
        <label>Estado</label>
        <input type="text" formControlName="state" class="biz-form__input" readonly>
      </div>
    </div>

    <div class="biz-form__grid biz-form__grid--3">
      <div class="biz-form__field">
        <label>Giro del negocio</label>
        <input type="text" formControlName="category" class="biz-form__input">
      </div>
      <div class="biz-form__field">
        <label>Sitio web</label>
        <input type="text" formControlName="website" class="biz-form__input">
      </div>
      <div class="biz-form__field">
        <label>Teléfono de publicación</label>
        <input type="text" formControlName="publicPhone" maxlength="10" class="biz-form__input">
      </div>
    </div>
  </section>

  <section class="biz-form__section">
    <div class="biz-form__grid biz-form__grid--logo-products">
      <div class="biz-form__field">
        <label>Logo</label>
        <label for="logo-input" class="biz-form__logo-drop">
          <img *ngIf="logoPreview; else logoPlaceholder" [src]="logoPreview" alt="Logo" class="biz-form__logo-img">
          <ng-template #logoPlaceholder>
            <span class="biz-form__logo-placeholder">subir</span>
          </ng-template>
        </label>
        <input id="logo-input" type="file" accept=".jpg,.jpeg,.png,.webp"
          class="biz-form__logo-input" (change)="onLogoChange($event)">
      </div>

      <div class="biz-form__field">
        <label>Productos o servicios</label>
        <textarea formControlName="products" rows="4" class="biz-form__textarea"
          placeholder="Hasta 25 palabras separadas por comas"></textarea>
      </div>

      <div class="biz-form__hours">
        <label>Horarios</label>
        <label class="biz-form__checkbox-label">
          <input type="checkbox" formControlName="allDay"> 24hrs
        </label>
        <ng-container *ngIf="!form.value.allDay">
          <div class="biz-form__hours-row">
            <span>Lunes a viernes:</span>
            <input type="time" formControlName="wdOpen" class="biz-form__time">
            <input type="time" formControlName="wdClose" class="biz-form__time">
          </div>
          <div class="biz-form__hours-row">
            <span>Sábado:</span>
            <input type="time" formControlName="satOpen" class="biz-form__time">
            <input type="time" formControlName="satClose" class="biz-form__time">
          </div>
          <div class="biz-form__hours-row">
            <span>Domingo:</span>
            <input type="time" formControlName="sunOpen" class="biz-form__time">
            <input type="time" formControlName="sunClose" class="biz-form__time">
          </div>
        </ng-container>
      </div>
    </div>
  </section>

  <div class="biz-form__actions">
    <button type="button" class="biz-form__btn biz-form__btn--secondary" (click)="onCancel()">
      Cancelar
    </button>
    <button type="submit" class="biz-form__btn biz-form__btn--primary" [disabled]="form.invalid">
      Guardar cambios
    </button>
  </div>
</form>
```

- [ ] **Step 8: Implementar `business-form.component.scss`**

```scss
@use '../../../../../styles/variables' as *;
@use '../../../../../styles/mixins' as *;

.biz-form {
  &__section {
    background: $color-white;
    border-radius: $radius-lg;
    padding: $spacing-lg;
    margin-bottom: $spacing-lg;
    box-shadow: 0 1px 6px rgba(0,0,0,0.06);
  }

  &__section-title {
    font-size: 16px;
    font-weight: $font-weight-bold;
    margin-bottom: $spacing-md;
    padding-bottom: $spacing-sm;
    border-bottom: 1px solid $color-border;
  }

  &__grid {
    display: grid;
    gap: $spacing-md;
    &--3 { grid-template-columns: 1fr; @include md { grid-template-columns: 1fr 1fr 1fr; } }
    &--logo-products { grid-template-columns: 1fr; @include md { grid-template-columns: 100px 1fr 1fr; } }
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: $spacing-sm;
  }

  &__input {
    @include input-base;
    &[readonly] { background-color: $color-bg; color: $color-text-light; cursor: default; }
  }

  &__textarea {
    width: 100%;
    border-radius: $radius-md;
    border: 1px solid $color-border;
    padding: $spacing-sm $spacing-md;
    font-family: $font-family;
    font-size: 14px;
    resize: vertical;
    outline: none;
    &:focus { border-color: $color-primary; }
  }

  &__logo-drop {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
    border: 2px dashed $color-border;
    border-radius: $radius-lg;
    cursor: pointer;
    overflow: hidden;
    &:hover { border-color: $color-text-light; }
  }

  &__logo-img { width: 100%; height: 100%; object-fit: contain; padding: 4px; }
  &__logo-placeholder { font-size: 12px; color: $color-text-light; }
  &__logo-input { display: none; }

  &__hours {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }

  &__checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: $font-weight-semibold;
    cursor: pointer;
  }

  &__hours-row {
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: center;
    gap: $spacing-sm;
    font-size: 14px;
    font-weight: $font-weight-semibold;
  }

  &__time {
    height: 28px;
    border-radius: $radius-md;
    border: 1px solid $color-border;
    padding: 0 8px;
    font-size: 13px;
    outline: none;
    &:focus { border-color: $color-primary; }
  }

  &__actions {
    display: flex;
    justify-content: center;
    gap: $spacing-md;
    margin-top: $spacing-lg;
  }

  &__btn {
    padding: 10px 32px;
    border-radius: $radius-full;
    border: none;
    font-weight: $font-weight-bold;
    font-size: 14px;
    transition: background-color 0.2s;

    &--primary {
      background-color: $color-primary;
      &:hover:not(:disabled) { background-color: $color-primary-dark; }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }

    &--secondary {
      background-color: transparent;
      border: 1px solid $color-border;
      &:hover { background-color: $color-bg; }
    }
  }
}
```

- [ ] **Step 9: Implementar `map-picker.component.ts`**

```typescript
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BusinessAddress } from '../../../../core/models/business.model';

@Component({
  selector: 'app-map-picker',
  templateUrl: './map-picker.component.html',
  styleUrls: ['./map-picker.component.scss']
})
export class MapPickerComponent implements OnInit {
  @Input() lat = 19.4195;
  @Input() lng = -99.1674;
  @Output() addressChange = new EventEmitter<BusinessAddress>();

  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  markerPosition: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom = 14;

  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: false,
    clickableIcons: false
  };

  ngOnInit(): void {
    this.center = { lat: this.lat, lng: this.lng };
    this.markerPosition = { lat: this.lat, lng: this.lng };
  }

  onMarkerDragEnd(event: google.maps.MapMouseEvent): void {
    if (!event.latLng) return;
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    this.geocode(lat, lng);
  }

  onMapClick(event: google.maps.MapMouseEvent): void {
    if (!event.latLng) return;
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    this.markerPosition = { lat, lng };
    this.geocode(lat, lng);
  }

  private geocode(lat: number, lng: number): void {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status !== 'OK' || !results?.[0]) return;
      const result = results[0];
      const get = (type: string) =>
        result.address_components.find(c => c.types.includes(type))?.long_name ?? '';

      this.addressChange.emit({
        fullAddress: result.formatted_address,
        street: `${get('route')}`,
        exteriorNumber: get('street_number'),
        colony: get('sublocality_level_1') || get('neighborhood'),
        postalCode: get('postal_code'),
        city: get('locality') || get('administrative_area_level_1'),
        state: get('administrative_area_level_1'),
        lat,
        lng
      });
    });
  }
}
```

- [ ] **Step 10: Implementar `map-picker.component.html`**

```html
<div class="map-picker">
  <google-map
    [center]="center"
    [zoom]="zoom"
    [options]="mapOptions"
    height="256px"
    width="100%"
    (mapClick)="onMapClick($event)">
    <map-marker
      [position]="markerPosition"
      [options]="{ draggable: true }"
      (mapDragend)="onMarkerDragEnd($event)">
    </map-marker>
  </google-map>
</div>
```

- [ ] **Step 11: Implementar `map-picker.component.scss`**

```scss
.map-picker {
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
}
```

- [ ] **Step 12: Commit**

```bash
git add src/app/features/dashboard/mi-negocio/
git commit -m "feat: add Mi Negocio feature with business form and Google Maps picker"
```

---

## Task 14: Feature Seguridad

**Files:**
- Create: `src/app/features/dashboard/seguridad/`

- [ ] **Step 1: Generar módulo y componente**

```bash
ng generate module features/dashboard/seguridad
ng generate component features/dashboard/seguridad/seguridad --module=features/dashboard/seguridad --export
```

- [ ] **Step 2: Crear `seguridad.module.ts`**

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SeguridadComponent } from './seguridad/seguridad.component';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [{ path: '', component: SeguridadComponent }];

@NgModule({
  declarations: [SeguridadComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes), SharedModule]
})
export class SeguridadModule {}
```

- [ ] **Step 3: Implementar `seguridad.component.ts`**

```typescript
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthMockService } from '../../../../core/services/auth.mock.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const np = control.get('newPassword')?.value;
  const cp = control.get('confirmPassword')?.value;
  return np && cp && np !== cp ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-seguridad',
  templateUrl: './seguridad.component.html',
  styleUrls: ['./seguridad.component.scss']
})
export class SeguridadComponent implements OnInit {
  form!: FormGroup;
  successMsg = '';
  errorMsg = '';

  constructor(private fb: FormBuilder, private auth: AuthMockService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/(?=.*[A-Z])(?=.*[0-9])/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  get newPassword() { return this.form.get('newPassword')!; }
  get confirmPassword() { return this.form.get('confirmPassword')!; }

  onSubmit(): void {
    if (this.form.invalid) return;
    const current = this.auth.currentUser();
    if (!current || current.password !== this.form.value.currentPassword) {
      this.errorMsg = 'La contraseña actual es incorrecta.';
      return;
    }
    const updated = { ...current, password: this.form.value.newPassword };
    sessionStorage.setItem('sa_user', JSON.stringify(updated));
    this.auth.currentUser.set(updated);
    this.successMsg = '¡Contraseña actualizada correctamente!';
    this.errorMsg = '';
    this.form.reset();
  }
}
```

- [ ] **Step 4: Implementar `seguridad.component.html`**

```html
<div class="seguridad">
  <h2 class="seguridad__title">Seguridad</h2>

  <div class="seguridad__card">
    <h3 class="seguridad__subtitle">Cambiar contraseña</h3>

    <span class="success-msg" *ngIf="successMsg">{{ successMsg }}</span>
    <span class="error-msg" *ngIf="errorMsg">{{ errorMsg }}</span>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="seguridad__form">
      <div class="seguridad__field">
        <label>Contraseña actual</label>
        <input type="password" formControlName="currentPassword" class="seguridad__input">
      </div>

      <div class="seguridad__field">
        <label>Nueva contraseña</label>
        <input type="password" formControlName="newPassword" class="seguridad__input">
        <app-password-strength [password]="newPassword.value"></app-password-strength>
        <span class="error-msg" *ngIf="newPassword.touched && newPassword.hasError('minlength')">
          Mínimo 8 caracteres
        </span>
        <span class="error-msg" *ngIf="newPassword.touched && newPassword.hasError('pattern')">
          Debe incluir al menos una mayúscula y un número
        </span>
      </div>

      <div class="seguridad__field">
        <label>Confirmar nueva contraseña</label>
        <input type="password" formControlName="confirmPassword" class="seguridad__input">
        <span class="error-msg" *ngIf="form.hasError('passwordMismatch') && confirmPassword.touched">
          Las contraseñas no coinciden
        </span>
      </div>

      <button type="submit" class="seguridad__btn" [disabled]="form.invalid">
        ACTUALIZAR CONTRASEÑA
      </button>
    </form>
  </div>
</div>
```

- [ ] **Step 5: Implementar `seguridad.component.scss`**

```scss
@use '../../../../../styles/variables' as *;
@use '../../../../../styles/mixins' as *;

.seguridad {
  &__title { font-size: 20px; font-weight: $font-weight-bold; margin-bottom: 24px; }

  &__card {
    background: $color-white;
    border-radius: $radius-lg;
    padding: $spacing-lg;
    max-width: 480px;
    box-shadow: 0 1px 6px rgba(0,0,0,0.06);
  }

  &__subtitle { font-size: 16px; font-weight: $font-weight-bold; margin-bottom: $spacing-md; }

  &__form { margin-top: $spacing-md; }

  &__field {
    margin-bottom: $spacing-md;
    label { display: block; margin-bottom: 4px; }
  }

  &__input { @include input-base; }

  &__btn {
    width: 100%;
    padding: 10px;
    border-radius: $radius-full;
    border: none;
    background-color: $color-primary;
    font-weight: $font-weight-bold;
    font-size: 14px;
    margin-top: $spacing-md;
    transition: background-color 0.2s;

    &:hover:not(:disabled) { background-color: $color-primary-dark; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }
}
```

- [ ] **Step 6: Commit**

```bash
git add src/app/features/dashboard/seguridad/
git commit -m "feat: add Seguridad feature with password change form"
```

---

## Task 15: Verificación final e integración

- [ ] **Step 1: Ejecutar todos los tests**

```bash
ng test --watch=false
```

Expected: todos los specs pasan sin errores.

- [ ] **Step 2: Verificar build de producción**

```bash
ng build --configuration=production
```

Expected: compilación sin errores. Archivos en `dist/`.

- [ ] **Step 3: Levantar servidor de desarrollo y verificar flujos**

```bash
ng serve
```

Verificar manualmente:
- `http://localhost:4200/crear-contrasena?email=test@prueba.com` → carga formulario con email
- `http://localhost:4200/login` → carga formulario de login
- `http://localhost:4200/dashboard` → redirige a `/login` (sin sesión)
- Crear contraseña → redirige a `/dashboard/metricas` → gráfica visible
- Navegar a `/dashboard/mi-negocio` → formulario con datos del mock
- Navegar a `/dashboard/seguridad` → formulario de cambio de contraseña
- Cerrar sesión → redirige a `/login`
- Nav lateral visible en desktop, nav inferior visible en móvil (DevTools)

- [ ] **Step 4: Commit final**

```bash
git add .
git commit -m "feat: complete SACOM free account module — auth, dashboard, metrics, business form, security"
```

---

## Notas importantes

1. **Google Maps API Key:** Reemplazar `TU_API_KEY_AQUI` en `environment.ts`, `environment.prod.ts` y en el script de `index.html` con una clave real que tenga habilitadas las APIs: **Maps JavaScript API** y **Geocoding API**.

2. **Logo de Sección Amarilla:** Agregar el logo SVG/PNG en `src/assets/logo-sa.svg`. Extraerlo del sitio original o usar un placeholder.

3. **Redirect desde registro existente:** El formulario en `seccionamarilla.com.mx/registra-tu-empresa` necesita que el equipo del sitio original agregue un redirect a `/crear-contrasena?email={correo}` al hacer submit exitoso. Esto está fuera del scope de este módulo.
