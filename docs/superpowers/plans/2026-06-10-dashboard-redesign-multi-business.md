# Dashboard Redesign + Multi-Business Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar el dashboard con estilo Bento Grid fiel al look & feel de seccionamarilla.com.mx y agregar soporte multi-negocio con drawer lateral reutilizable.

**Architecture:** `BusinessMockService` pasa de `signal<Business>` a `signal<Business[]>`. Un `BusinessDrawerComponent` centraliza detail/edit/add en un overlay lateral. `MetricasComponent` muestra el Bento Grid con KPIs agregados, gráfica y lista de negocios. El layout del dashboard cambia a sidebar icon-only + pill nav en header.

**Tech Stack:** Angular 22 (NgModules) · Signals · ReactiveFormsModule · @angular/google-maps · ng2-charts · SCSS/BEM/Inter · Karma + Jasmine

> **Regla crítica:** Todo artefacto Angular se genera con `ng generate`. Angular 22 genera archivos sin `.component.` y `.module.` en el nombre (ej: `foo.ts`, `foo-module.ts`). Las clases tampoco llevan sufijo (ej: `export class Foo`).

> **Working directory:** `/Users/aldo/Aldo_en_mi_mac/ADNDigital/SACOM-modulo-free-account`

---

## File Map

### Archivos MODIFICADOS

| Archivo | Cambio |
|---|---|
| `src/styles/_variables.scss` | Actualizar tokens de color y agregar nuevos |
| `src/styles/_typography.scss` | Agregar clases `.btn-*`, `.kpi-value`, `.badge-*` |
| `src/index.html` | Cambiar Roboto → Inter |
| `src/app/core/models/metrics.model.ts` | `businessId` → `businessIds: string[]` |
| `src/assets/mock-data.json` | `business` singular → `businesses` array |
| `src/app/core/services/business.mock.service.ts` | Refactor: `signal<Business[]>`, nuevos métodos |
| `src/app/core/services/business.mock.service.spec.ts` | Tests actualizados |
| `src/app/core/services/metrics.mock.service.ts` | `getMetrics(string[])` |
| `src/app/core/services/metrics.mock.service.spec.ts` | Tests actualizados |
| `src/app/features/dashboard/dashboard-module.ts` | Agregar nuevos componentes |
| `src/app/features/dashboard/dashboard-routing-module.ts` | Eliminar ruta mi-negocio |
| `src/app/features/dashboard/dashboard/dashboard.ts` | Nuevo layout: sidebar icon-only |
| `src/app/features/dashboard/dashboard/dashboard.html` | Estructura nueva |
| `src/app/features/dashboard/dashboard/dashboard.scss` | SCSS actualizado |
| `src/app/features/dashboard/components/header/header.ts` | Pill nav + activeTab input |
| `src/app/features/dashboard/components/header/header.html` | Nuevo diseño header |
| `src/app/features/dashboard/components/header/header.scss` | SCSS actualizado |
| `src/app/features/dashboard/metricas/metricas-module.ts` | Importar nuevos componentes y GoogleMapsModule |
| `src/app/features/dashboard/metricas/metricas/metricas.ts` | Bento Grid: KPIs + drawer |
| `src/app/features/dashboard/metricas/metricas/metricas.html` | Bento Grid template |
| `src/app/features/dashboard/metricas/metricas/metricas.scss` | SCSS Bento Grid |

### Archivos NUEVOS (todos con `ng generate`)

| Archivo | Qué hace |
|---|---|
| `src/app/features/dashboard/components/business-drawer/business-drawer.ts` | Overlay drawer con 3 modos |
| `src/app/features/dashboard/components/business-drawer/business-drawer.html` | Template del drawer |
| `src/app/features/dashboard/components/business-drawer/business-drawer.scss` | Estilos del overlay |
| `src/app/features/dashboard/components/business-drawer/business-drawer.spec.ts` | Tests |
| `src/app/features/dashboard/metricas/kpi-card/kpi-card.ts` | Card KPI reutilizable |
| `src/app/features/dashboard/metricas/kpi-card/kpi-card.html` | Template KPI card |
| `src/app/features/dashboard/metricas/kpi-card/kpi-card.scss` | SCSS KPI card |
| `src/app/features/dashboard/metricas/business-list-card/business-list-card.ts` | Lista de negocios con métricas |
| `src/app/features/dashboard/metricas/business-list-card/business-list-card.html` | Template lista |
| `src/app/features/dashboard/metricas/business-list-card/business-list-card.scss` | SCSS lista |

### Archivos ELIMINADOS

| Archivo | Razón |
|---|---|
| `src/app/features/dashboard/mi-negocio/` (directorio completo) | Reemplazado por drawer |
| `src/app/features/dashboard/components/nav-lateral/` | Reemplazado por sidebar en dashboard |
| `src/app/features/dashboard/components/nav-inferior/` | Reemplazado por pill nav en header |
| `src/app/features/dashboard/mi-negocio/business-form/` | El drawer reimplementa el formulario inline; se borra con `mi-negocio/` |
| `src/app/features/dashboard/mi-negocio/map-picker/` | El drawer reimplementa el mapa inline; se borra con `mi-negocio/` |

---

## Task 1: Actualizar tokens SCSS + fuente Inter

**Files:**
- Modify: `src/styles/_variables.scss`
- Modify: `src/styles/_typography.scss`
- Modify: `src/index.html`

- [ ] **Step 1: Actualizar `src/styles/_variables.scss`**

```scss
// Colores
$color-primary:        #FFD800;
$color-primary-dark:   #E5C200;
$color-bg:             #F4F4F4;
$color-white:          #FFFFFF;
$color-card-bg:        #FFFFFF;
$color-text:           #1A1A1A;
$color-text-light:     #666666;
$color-text-muted:     #999999;
$color-border:         #E5E5E5;
$color-btn-primary:    #1A1A1A;
$color-error:          #DC2626;
$color-danger:         #DC2626;
$color-success:        #16A34A;

// Tipografía
$font-family: 'Inter', Arial, sans-serif;
$font-weight-regular:  400;
$font-weight-medium:   500;
$font-weight-semibold: 600;
$font-weight-bold:     700;
$font-weight-extrabold: 800;
$font-weight-black:    900;

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
$radius-sm:   4px;
$radius-md:   8px;
$radius-lg:   12px;
$radius-xl:   16px;
$radius-full: 9999px;
```

- [ ] **Step 2: Actualizar `src/styles/_typography.scss`**

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

// Utility classes
.error-msg  { color: $color-error;   font-size: 12px; margin-top: 4px; }
.success-msg { color: $color-success; font-size: 14px; margin-top: 8px; }

// KPI
.kpi-value { font-size: 28px; font-weight: $font-weight-black; color: $color-text; line-height: 1; }

// Badges
.badge-up   { display: inline-flex; align-items: center; padding: 3px 8px; border-radius: 10px; font-size: 10px; font-weight: $font-weight-bold; background: #F0FDF4; color: $color-success; }
.badge-down { display: inline-flex; align-items: center; padding: 3px 8px; border-radius: 10px; font-size: 10px; font-weight: $font-weight-bold; background: #FEF2F2; color: $color-danger; }

// Buttons
.btn-primary {
  background: $color-btn-primary;
  color: #fff;
  border: none;
  border-radius: $radius-full;
  padding: 10px 24px;
  font-size: 13px;
  font-weight: $font-weight-bold;
  font-family: $font-family;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover:not(:disabled) { background: #2D2D2D; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.btn-secondary {
  background: transparent;
  color: $color-text-light;
  border: 1.5px solid $color-border;
  border-radius: $radius-full;
  padding: 9px 24px;
  font-size: 13px;
  font-weight: $font-weight-semibold;
  font-family: $font-family;
  cursor: pointer;
  &:hover { background: $color-bg; }
}

.btn-danger {
  background: transparent;
  color: $color-danger;
  border: 1.5px solid $color-danger;
  border-radius: $radius-full;
  padding: 9px 24px;
  font-size: 13px;
  font-weight: $font-weight-bold;
  font-family: $font-family;
  cursor: pointer;
  &:hover { background: #FEF2F2; }
}

.btn-accent {
  background: $color-primary;
  color: $color-text;
  border: none;
  border-radius: $radius-full;
  padding: 10px 24px;
  font-size: 13px;
  font-weight: $font-weight-bold;
  font-family: $font-family;
  cursor: pointer;
  &:hover { background: $color-primary-dark; }
}
```

- [ ] **Step 3: Cambiar Roboto por Inter en `src/index.html`**

Reemplazar las líneas del link de Roboto:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
```

- [ ] **Step 4: Verificar que el build pasa**

```bash
ng build
```
Expected: sin errores de SCSS ni TypeScript.

- [ ] **Step 5: Commit**

```bash
git add src/styles/ src/index.html
git commit -m "feat: update design tokens to SA brand — Inter, dark text, new button classes"
```

---

## Task 2: Actualizar modelo de métricas y mock-data

**Files:**
- Modify: `src/app/core/models/metrics.model.ts`
- Modify: `src/assets/mock-data.json`

- [ ] **Step 1: Actualizar `src/app/core/models/metrics.model.ts`**

```typescript
export interface DailyMetric {
  date: string;
  clicks: number;
  impressions: number;
}

export interface Metrics {
  businessIds: string[];
  last30Days: DailyMetric[];
}
```

- [ ] **Step 2: Actualizar `src/assets/mock-data.json`**

```json
{
  "businesses": [
    {
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
    },
    {
      "id": "biz-002",
      "userId": "usr-001",
      "businessName": "Tech Solutions MX",
      "contactName": "Juan Pérez García",
      "contactEmail": "juan@techsolutions.mx",
      "contactPhone": "5551234567",
      "categoryCode": 7372,
      "category": "Tecnología",
      "website": "https://www.techsolutions.mx",
      "publicPhone": "5554567890",
      "products": "desarrollo web, apps móviles, consultoría IT, soporte técnico",
      "logoUrl": "",
      "address": {
        "fullAddress": "Av. Presidente Masaryk 111, Polanco, 11560 Ciudad de México, CDMX",
        "street": "Av. Presidente Masaryk",
        "exteriorNumber": "111",
        "colony": "Polanco",
        "postalCode": "11560",
        "city": "Ciudad de México",
        "state": "CDMX",
        "lat": 19.4326,
        "lng": -99.1962
      },
      "hours": {
        "allDay": false,
        "weekdays": { "open": "09:00", "close": "18:00" },
        "saturday": null,
        "sunday": null
      }
    }
  ]
}
```

- [ ] **Step 3: Verificar build**

```bash
ng build
```
Expected: puede haber errores de TypeScript en servicios que usan `businessId` (singular) — son esperados hasta los Task 3 y 4.

- [ ] **Step 4: Commit**

```bash
git add src/app/core/models/metrics.model.ts src/assets/mock-data.json
git commit -m "feat: update metrics model to multi-business IDs and add second mock business"
```

---

## Task 3: Refactor BusinessMockService (TDD)

**Files:**
- Modify: `src/app/core/services/business.mock.service.ts`
- Modify: `src/app/core/services/business.mock.service.spec.ts`

- [ ] **Step 1: Escribir tests actualizados en `business.mock.service.spec.ts`**

```typescript
import { TestBed } from '@angular/core/testing';
import { BusinessMockService } from './business.mock.service';
import { Business } from '../models/business.model';

const mockBiz = (): Omit<Business, 'id' | 'userId'> => ({
  businessName: 'Test Biz',
  contactName: 'Test', contactEmail: 'test@test.com', contactPhone: '5551234567',
  categoryCode: 1, category: 'Test', website: '', publicPhone: '5551234567',
  products: 'test', logoUrl: '',
  address: { fullAddress: '', street: '', exteriorNumber: '', colony: '',
    postalCode: '', city: '', state: '', lat: 0, lng: 0 },
  hours: { allDay: true, weekdays: null, saturday: null, sunday: null }
});

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

  it('businesses signal starts with mock-data businesses', () => {
    expect(service.businesses().length).toBeGreaterThanOrEqual(1);
    expect(service.businesses()[0].businessName).toBe('Taquería El Buen Sabor');
  });

  it('addBusiness() adds a new business and updates signal', (done) => {
    const initial = service.businesses().length;
    service.addBusiness(mockBiz()).subscribe(biz => {
      expect(service.businesses().length).toBe(initial + 1);
      expect(biz.id).toBeTruthy();
      expect(biz.userId).toBe('usr-001');
      done();
    });
  });

  it('updateBusiness() updates the correct business by id', (done) => {
    const id = service.businesses()[0].id;
    service.updateBusiness(id, { businessName: 'Nuevo Nombre' }).subscribe(biz => {
      expect(biz.businessName).toBe('Nuevo Nombre');
      expect(service.businesses()[0].businessName).toBe('Nuevo Nombre');
      done();
    });
  });

  it('deleteBusiness() removes the business from the signal', (done) => {
    const id = service.businesses()[0].id;
    const initial = service.businesses().length;
    service.deleteBusiness(id).subscribe(() => {
      expect(service.businesses().length).toBe(initial - 1);
      expect(service.businesses().find(b => b.id === id)).toBeUndefined();
      done();
    });
  });

  it('uploadLogo() converts File to base64', (done) => {
    const file = new File(['x'], 'logo.png', { type: 'image/png' });
    service.uploadLogo(file).subscribe(result => {
      expect(result).toContain('data:image/png;base64,');
      done();
    });
  });
});
```

- [ ] **Step 2: Ejecutar tests — deben FALLAR**

```bash
ng test --watch=false
```
Expected: FAIL — `businesses`, `addBusiness`, `updateBusiness`, `deleteBusiness` no existen.

- [ ] **Step 3: Implementar `business.mock.service.ts`**

```typescript
import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Business } from '../models/business.model';
import mockData from '../../../assets/mock-data.json';

@Injectable({ providedIn: 'root' })
export class BusinessMockService {
  private readonly KEY = 'sa_businesses';

  businesses = signal<Business[]>(this.load());

  private load(): Business[] {
    const raw = sessionStorage.getItem(this.KEY);
    return raw ? JSON.parse(raw) : (mockData.businesses as unknown as Business[]);
  }

  private save(list: Business[]): void {
    sessionStorage.setItem(this.KEY, JSON.stringify(list));
    this.businesses.set(list);
  }

  getBusinessById(id: string): Business | undefined {
    return this.businesses().find(b => b.id === id);
  }

  addBusiness(data: Omit<Business, 'id' | 'userId'>): Observable<Business> {
    const newBiz: Business = { ...data as Business, id: crypto.randomUUID(), userId: 'usr-001' };
    this.save([...this.businesses(), newBiz]);
    return of(newBiz);
  }

  updateBusiness(id: string, data: Partial<Business>): Observable<Business> {
    const updated = this.businesses().map(b => b.id === id ? { ...b, ...data } : b);
    this.save(updated);
    return of(updated.find(b => b.id === id)!);
  }

  deleteBusiness(id: string): Observable<void> {
    this.save(this.businesses().filter(b => b.id !== id));
    return of(void 0);
  }

  uploadLogo(file: File): Observable<string> {
    return new Observable(observer => {
      const reader = new FileReader();
      reader.onload = () => { observer.next(reader.result as string); observer.complete(); };
      reader.onerror = () => observer.error(reader.error);
      reader.readAsDataURL(file);
    });
  }
}
```

- [ ] **Step 4: Ejecutar tests — deben PASAR**

```bash
ng test --watch=false
```
Expected: todos los tests de `BusinessMockService` PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/core/services/business.mock.service.ts src/app/core/services/business.mock.service.spec.ts
git commit -m "feat: refactor BusinessMockService to handle Business[] with add/update/delete"
```

---

## Task 4: Refactor MetricsMockService (TDD)

**Files:**
- Modify: `src/app/core/services/metrics.mock.service.ts`
- Modify: `src/app/core/services/metrics.mock.service.spec.ts`

- [ ] **Step 1: Actualizar `metrics.mock.service.spec.ts`**

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

  it('getMetrics() with single id returns 30 data points', (done) => {
    service.getMetrics(['biz-001']).subscribe(m => {
      expect(m.last30Days.length).toBe(30);
      expect(m.businessIds).toEqual(['biz-001']);
      done();
    });
  });

  it('getMetrics() with multiple ids aggregates clicks and impressions', (done) => {
    service.getMetrics(['biz-001']).subscribe(single => {
      service.getMetrics(['biz-001', 'biz-002']).subscribe(multi => {
        const singleTotal = single.last30Days.reduce((s, d) => s + d.clicks, 0);
        const multiTotal = multi.last30Days.reduce((s, d) => s + d.clicks, 0);
        expect(multiTotal).toBeGreaterThan(singleTotal);
        done();
      });
    });
  });

  it('each data point has valid date, clicks > 0, impressions > 0', (done) => {
    service.getMetrics(['biz-001']).subscribe(m => {
      m.last30Days.forEach(p => {
        expect(p.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(p.clicks).toBeGreaterThan(0);
        expect(p.impressions).toBeGreaterThan(0);
      });
      done();
    });
  });

  it('getMetrics() is deterministic for same ids', (done) => {
    service.getMetrics(['biz-001']).subscribe(first => {
      service.getMetrics(['biz-001']).subscribe(second => {
        expect(first.last30Days[0].clicks).toBe(second.last30Days[0].clicks);
        done();
      });
    });
  });
});
```

- [ ] **Step 2: Ejecutar tests — deben FALLAR**

```bash
ng test --watch=false
```
Expected: FAIL — `getMetrics` todavía recibe `string` no `string[]`.

- [ ] **Step 3: Implementar `metrics.mock.service.ts`**

```typescript
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DailyMetric, Metrics } from '../models/metrics.model';

@Injectable({ providedIn: 'root' })
export class MetricsMockService {

  getMetrics(businessIds: string[]): Observable<Metrics> {
    const perBusiness = businessIds.map(id => this.generateForId(id));
    return of({ businessIds, last30Days: this.aggregate(perBusiness) });
  }

  private generateForId(id: string): DailyMetric[] {
    const seed = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const today = new Date();
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (29 - i));
      const s = (i + 1) * seed;
      return {
        date: d.toISOString().split('T')[0],
        clicks: Math.floor(Math.abs(Math.sin(s * 0.23)) * 80) + 15,
        impressions: Math.floor(Math.abs(Math.cos(s * 0.17)) * 300) + 80
      };
    });
  }

  private aggregate(perBusiness: DailyMetric[][]): DailyMetric[] {
    if (!perBusiness.length) return [];
    return perBusiness[0].map((day, i) => ({
      date: day.date,
      clicks: perBusiness.reduce((sum, biz) => sum + biz[i].clicks, 0),
      impressions: perBusiness.reduce((sum, biz) => sum + biz[i].impressions, 0)
    }));
  }
}
```

- [ ] **Step 4: Ejecutar tests — deben PASAR**

```bash
ng test --watch=false
```
Expected: todos los tests de `MetricsMockService` PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/core/services/metrics.mock.service.ts src/app/core/services/metrics.mock.service.spec.ts
git commit -m "feat: refactor MetricsMockService to aggregate metrics across multiple business IDs"
```

---

## Task 5: KpiCardComponent

**Files:**
- Create: `src/app/features/dashboard/metricas/kpi-card/` (via ng generate)

- [ ] **Step 1: Generar componente**

```bash
ng generate component features/dashboard/metricas/kpi-card --module=features/dashboard/metricas
```

- [ ] **Step 2: Implementar `kpi-card.ts`**

```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  standalone: false,
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.scss'
})
export class KpiCard {
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() badge = '';
  @Input() badgeType: 'up' | 'down' | 'neutral' = 'neutral';
  @Input() accent = false;
}
```

- [ ] **Step 3: Implementar `kpi-card.html`**

```html
<div class="kpi-card" [class.kpi-card--accent]="accent">
  <div class="kpi-card__label">{{ label }}</div>
  <div class="kpi-card__value">{{ value | number }}</div>
  <span *ngIf="badge" [class]="badgeType === 'up' ? 'badge-up' : badgeType === 'down' ? 'badge-down' : ''">
    {{ badge }}
  </span>
</div>
```

- [ ] **Step 4: Implementar `kpi-card.scss`**

```scss
@use 'styles/variables' as *;

.kpi-card {
  background: $color-card-bg;
  border-radius: $radius-xl;
  padding: $spacing-md;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);

  &--accent {
    background: $color-primary;
    .kpi-card__label { color: rgba(0,0,0,.5); }
    .kpi-card__value { color: $color-text; }
  }

  &__label {
    font-size: 10px;
    font-weight: $font-weight-bold;
    color: $color-text-muted;
    letter-spacing: .6px;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  &__value {
    font-size: 26px;
    font-weight: $font-weight-black;
    color: $color-text;
    line-height: 1;
    margin-bottom: 6px;
  }
}
```

- [ ] **Step 5: Verificar que `KpiCard` está declarado en `metricas-module.ts`**

El `ng generate` lo agrega automáticamente. Verificar que `metricas-module.ts` incluye `KpiCard` en `declarations`.

- [ ] **Step 6: Ejecutar tests**

```bash
ng test --watch=false
```
Expected: spec de `KpiCard` pasa ("should create").

- [ ] **Step 7: Commit**

```bash
git add src/app/features/dashboard/metricas/kpi-card/
git commit -m "feat: add KpiCard component for dashboard metrics"
```

---

## Task 6: BusinessListCardComponent

**Files:**
- Create: `src/app/features/dashboard/metricas/business-list-card/` (via ng generate)

- [ ] **Step 1: Generar componente**

```bash
ng generate component features/dashboard/metricas/business-list-card --module=features/dashboard/metricas
```

- [ ] **Step 2: Implementar `business-list-card.ts`**

```typescript
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Business } from '../../../../core/models/business.model';
import { Metrics } from '../../../../core/models/metrics.model';

@Component({
  selector: 'app-business-list-card',
  standalone: false,
  templateUrl: './business-list-card.html',
  styleUrl: './business-list-card.scss'
})
export class BusinessListCard {
  @Input() businesses: Business[] = [];
  @Input() metrics: Metrics | null = null;
  @Output() businessSelected = new EventEmitter<Business>();

  getClicks(businessId: string): number {
    if (!this.metrics) return 0;
    return this.metrics.last30Days.reduce((s, d) => s + d.clicks, 0);
  }

  getBusinessMetrics(businessId: string): { clicks: number; impressions: number } {
    if (!this.metrics) return { clicks: 0, impressions: 0 };
    const clicks = this.metrics.last30Days.reduce((s, d) => s + d.clicks, 0);
    const impressions = this.metrics.last30Days.reduce((s, d) => s + d.impressions, 0);
    const count = this.businesses.length || 1;
    return { clicks: Math.round(clicks / count), impressions: Math.round(impressions / count) };
  }
}
```

- [ ] **Step 3: Implementar `business-list-card.html`**

```html
<div class="biz-list-card">
  <div class="biz-list-card__header">
    <div class="biz-list-card__title">Mis negocios</div>
    <div class="biz-list-card__count">{{ businesses.length }}</div>
  </div>

  <div class="biz-list-card__rows">
    <div
      *ngFor="let biz of businesses"
      class="biz-list-card__row"
      (click)="businessSelected.emit(biz)">
      <div class="biz-list-card__icon">{{ biz.logoUrl ? '' : '🏪' }}</div>
      <div class="biz-list-card__info">
        <div class="biz-list-card__name">{{ biz.businessName }}</div>
        <div class="biz-list-card__cat">{{ biz.category }} · {{ biz.address.colony }}</div>
      </div>
      <div class="biz-list-card__meta">
        <div class="biz-list-card__clicks">{{ getBusinessMetrics(biz.id).clicks | number }}</div>
        <div class="biz-list-card__clicks-label">clics</div>
      </div>
      <span class="biz-list-card__arrow">›</span>
    </div>

    <div class="biz-list-card__row biz-list-card__row--add" (click)="businessSelected.emit(null!)">
      <div class="biz-list-card__add-icon">+</div>
      <span class="biz-list-card__add-label">Agregar negocio</span>
    </div>
  </div>
</div>
```

- [ ] **Step 4: Implementar `business-list-card.scss`**

```scss
@use 'styles/variables' as *;

.biz-list-card {
  background: $color-card-bg;
  border-radius: $radius-xl;
  padding: $spacing-md;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
  height: 100%;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $spacing-md;
  }

  &__title {
    font-size: 14px;
    font-weight: $font-weight-extrabold;
    color: $color-text;
  }

  &__count {
    background: $color-bg;
    font-size: 11px;
    font-weight: $font-weight-bold;
    color: $color-text-light;
    padding: 2px 8px;
    border-radius: $radius-full;
  }

  &__rows { display: flex; flex-direction: column; gap: 4px; }

  &__row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    border-radius: $radius-lg;
    cursor: pointer;
    transition: background .15s;
    border: 1.5px solid transparent;

    &:hover { background: $color-bg; border-color: $color-primary; }

    &--add {
      border: 1.5px dashed $color-border;
      justify-content: flex-start;
      gap: 8px;
      &:hover { border-color: $color-primary; background: #FFFBEB; }
    }
  }

  &__icon {
    width: 36px;
    height: 36px;
    background: $color-bg;
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  &__info { flex: 1; min-width: 0; }

  &__name {
    font-size: 12px;
    font-weight: $font-weight-extrabold;
    color: $color-text;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__cat { font-size: 10px; color: $color-text-muted; margin-top: 1px; }

  &__meta { text-align: right; }

  &__clicks { font-size: 13px; font-weight: $font-weight-black; color: $color-text; }

  &__clicks-label { font-size: 9px; color: $color-text-muted; }

  &__arrow { font-size: 16px; color: $color-border; }

  &__add-icon {
    width: 28px;
    height: 28px;
    background: $color-primary;
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: $font-weight-black;
    flex-shrink: 0;
  }

  &__add-label { font-size: 12px; font-weight: $font-weight-bold; color: $color-text; }
}
```

- [ ] **Step 5: Ejecutar tests**

```bash
ng test --watch=false
```
Expected: spec de `BusinessListCard` pasa.

- [ ] **Step 6: Commit**

```bash
git add src/app/features/dashboard/metricas/business-list-card/
git commit -m "feat: add BusinessListCard component with per-business metrics rows"
```

---

## Task 7: BusinessDrawerComponent

**Files:**
- Create: `src/app/features/dashboard/components/business-drawer/` (via ng generate)

- [ ] **Step 1: Generar componente y declararlo en `MetricasModule`**

```bash
ng generate component features/dashboard/components/business-drawer --module=features/dashboard/metricas
```

> **Decisión de arquitectura (evita dependencia circular):** `BusinessDrawer` se declara en `MetricasModule`, NO en `DashboardModule`. El drawer solo lo consume `MetricasComponent` (que vive en `MetricasModule`). Si se declarara en `DashboardModule` y luego `MetricasModule` importara `DashboardModule`, se crearía un ciclo porque `DashboardModule` ya hace lazy-load de `MetricasModule`. Por eso lo declaramos directamente donde se usa.

El archivo vive físicamente en `components/business-drawer/` (fuera de la carpeta `metricas/`) pero se declara en `MetricasModule`. El `metricas-module.ts` queda así (se completa en Task 9):

```typescript
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { BusinessDrawer } from '../components/business-drawer/business-drawer';
// ... (otras importaciones se agregan en Task 9)

@NgModule({
  declarations: [/* ..., */ BusinessDrawer],
  imports: [/* ..., */ ReactiveFormsModule, GoogleMapsModule]
})
export class MetricasModule {}
```

> Si el `ng generate` lo agregó por error a `DashboardModule`, quítalo de ahí — debe estar declarado en un solo módulo (`MetricasModule`).

- [ ] **Step 2: Implementar `business-drawer.ts`**

```typescript
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Business, BusinessAddress } from '../../../../core/models/business.model';
import { BusinessMockService } from '../../../../core/services/business.mock.service';
import { Metrics } from '../../../../core/models/metrics.model';

@Component({
  selector: 'app-business-drawer',
  standalone: false,
  templateUrl: './business-drawer.html',
  styleUrl: './business-drawer.scss'
})
export class BusinessDrawer implements OnChanges {
  @Input() mode: 'detail' | 'edit' | 'add' = 'detail';
  @Input() business: Business | null = null;
  @Input() metrics: Metrics | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<Business>();
  @Output() deleted = new EventEmitter<string>();

  internalMode: 'detail' | 'edit' | 'add' = 'detail';
  form!: FormGroup;
  logoPreview = '';
  currentStep = 1;

  // Map picker state
  mapCenter: google.maps.LatLngLiteral = { lat: 19.4195, lng: -99.1674 };
  markerPosition: google.maps.LatLngLiteral = { lat: 19.4195, lng: -99.1674 };
  zoom = 14;
  mapOptions: google.maps.MapOptions = { clickableIcons: false };

  get totalClicks(): number {
    if (!this.metrics) return 0;
    return this.metrics.last30Days.reduce((s, d) => s + d.clicks, 0);
  }

  get totalImpressions(): number {
    if (!this.metrics) return 0;
    return this.metrics.last30Days.reduce((s, d) => s + d.impressions, 0);
  }

  get ctr(): string {
    const t = this.totalImpressions;
    if (!t) return '0%';
    return ((this.totalClicks / t) * 100).toFixed(1) + '%';
  }

  constructor(private fb: FormBuilder, private businessService: BusinessMockService) {}

  ngOnChanges(): void {
    this.internalMode = this.mode;
    if ((this.mode === 'edit' || this.mode === 'add') && !this.form) {
      this.buildForm();
    }
    if (this.mode === 'edit' && this.business) {
      this.buildForm();
      this.logoPreview = this.business.logoUrl;
      this.mapCenter = { lat: this.business.address.lat, lng: this.business.address.lng };
      this.markerPosition = { lat: this.business.address.lat, lng: this.business.address.lng };
    }
    if (this.mode === 'add') {
      this.buildForm();
      this.currentStep = 1;
      this.logoPreview = '';
    }
  }

  private buildForm(): void {
    const b = this.business;
    this.form = this.fb.group({
      contactName:  [b?.contactName  ?? '', Validators.required],
      contactEmail: [b?.contactEmail ?? '', [Validators.required, Validators.email]],
      contactPhone: [b?.contactPhone ?? '', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      businessName: [b?.businessName ?? '', Validators.required],
      category:     [b?.category     ?? '', Validators.required],
      website:      [b?.website      ?? ''],
      publicPhone:  [b?.publicPhone  ?? '', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      products:     [b?.products     ?? '', Validators.required],
      fullAddress:  [b?.address.fullAddress ?? ''],
      street:       [b?.address.street      ?? ''],
      exteriorNumber:[b?.address.exteriorNumber ?? ''],
      colony:       [b?.address.colony      ?? ''],
      postalCode:   [b?.address.postalCode  ?? ''],
      city:         [b?.address.city        ?? ''],
      state:        [b?.address.state       ?? ''],
      lat:          [b?.address.lat         ?? 19.4195],
      lng:          [b?.address.lng         ?? -99.1674],
      allDay:       [b?.hours.allDay        ?? false],
      wdOpen:       [b?.hours.weekdays?.open  ?? ''],
      wdClose:      [b?.hours.weekdays?.close ?? ''],
      satOpen:      [b?.hours.saturday?.open  ?? ''],
      satClose:     [b?.hours.saturday?.close ?? ''],
      sunOpen:      [b?.hours.sunday?.open    ?? ''],
      sunClose:     [b?.hours.sunday?.close   ?? '']
    });
  }

  switchToEdit(): void { this.internalMode = 'edit'; this.buildForm(); }
  switchToDetail(): void { this.internalMode = 'detail'; }

  onLogoChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.businessService.uploadLogo(file).subscribe(url => this.logoPreview = url);
  }

  onAddressChange(addr: BusinessAddress): void {
    this.form.patchValue({ ...addr });
    this.markerPosition = { lat: addr.lat, lng: addr.lng };
  }

  onMapClick(event: google.maps.MapMouseEvent): void {
    if (!event.latLng) return;
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    this.markerPosition = { lat, lng };
    this.geocode(lat, lng);
  }

  onMarkerDragEnd(event: google.maps.MapMouseEvent): void {
    if (!event.latLng) return;
    this.geocode(event.latLng.lat(), event.latLng.lng());
  }

  private geocode(lat: number, lng: number): void {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status !== 'OK' || !results?.[0]) return;
      const r = results[0];
      const get = (type: string) => r.address_components.find(c => c.types.includes(type))?.long_name ?? '';
      this.onAddressChange({
        fullAddress: r.formatted_address,
        street: get('route'),
        exteriorNumber: get('street_number'),
        colony: get('sublocality_level_1') || get('neighborhood'),
        postalCode: get('postal_code'),
        city: get('locality') || get('administrative_area_level_1'),
        state: get('administrative_area_level_1'),
        lat, lng
      });
    });
  }

  onSave(): void {
    if (!this.form || this.form.invalid) return;
    const v = this.form.value;
    const data: Omit<Business, 'id' | 'userId'> = {
      contactName: v.contactName, contactEmail: v.contactEmail, contactPhone: v.contactPhone,
      businessName: v.businessName, category: v.category, website: v.website,
      publicPhone: v.publicPhone, products: v.products, logoUrl: this.logoPreview,
      categoryCode: this.business?.categoryCode ?? 0,
      address: { fullAddress: v.fullAddress, street: v.street, exteriorNumber: v.exteriorNumber,
        colony: v.colony, postalCode: v.postalCode, city: v.city, state: v.state,
        lat: v.lat, lng: v.lng },
      hours: { allDay: v.allDay,
        weekdays: v.allDay ? null : { open: v.wdOpen, close: v.wdClose },
        saturday: v.allDay ? null : { open: v.satOpen, close: v.satClose },
        sunday: v.allDay ? null : { open: v.sunOpen, close: v.sunClose } }
    };
    if (this.internalMode === 'edit' && this.business) {
      this.businessService.updateBusiness(this.business.id, data).subscribe(b => this.saved.emit(b));
    } else {
      this.businessService.addBusiness(data).subscribe(b => this.saved.emit(b));
    }
  }

  onDelete(): void {
    if (!this.business) return;
    if (!confirm(`¿Eliminar "${this.business.businessName}"? Esta acción no se puede deshacer.`)) return;
    this.businessService.deleteBusiness(this.business.id).subscribe(() => {
      this.deleted.emit(this.business!.id);
    });
  }

  nextStep(): void { if (this.currentStep < 3) this.currentStep++; }
  prevStep(): void { if (this.currentStep > 1) this.currentStep--; }
}
```

- [ ] **Step 3: Implementar `business-drawer.html`**

```html
<!-- Backdrop -->
<div class="drawer-backdrop" (click)="closed.emit()"></div>

<!-- Panel -->
<div class="drawer-panel">

  <!-- MODO: DETAIL -->
  <ng-container *ngIf="internalMode === 'detail' && business">
    <div class="drawer-header">
      <span class="drawer-title">Detalle del negocio</span>
      <button class="drawer-close" (click)="closed.emit()">✕</button>
    </div>
    <div class="drawer-body">
      <div class="drawer-biz-hero">
        <div class="drawer-biz-icon">🏪</div>
        <div>
          <div class="drawer-biz-name">{{ business.businessName }}</div>
          <div class="drawer-biz-cat">{{ business.category }} · {{ business.address.colony }}</div>
        </div>
      </div>
      <div class="drawer-kpis">
        <div class="drawer-kpi"><div class="drawer-kpi__value">{{ totalClicks | number }}</div><div class="drawer-kpi__label">Clics</div></div>
        <div class="drawer-kpi"><div class="drawer-kpi__value">{{ totalImpressions | number }}</div><div class="drawer-kpi__label">Impresiones</div></div>
        <div class="drawer-kpi"><div class="drawer-kpi__value">{{ ctr }}</div><div class="drawer-kpi__label">CTR</div></div>
      </div>
      <div class="drawer-info-grid">
        <div class="drawer-info-item">
          <div class="drawer-info-label">Teléfono</div>
          <div class="drawer-info-value">{{ business.publicPhone }}</div>
        </div>
        <div class="drawer-info-item" *ngIf="business.website">
          <div class="drawer-info-label">Sitio web</div>
          <div class="drawer-info-value">{{ business.website }}</div>
        </div>
        <div class="drawer-info-item">
          <div class="drawer-info-label">Dirección</div>
          <div class="drawer-info-value">{{ business.address.fullAddress }}</div>
        </div>
        <div class="drawer-info-item">
          <div class="drawer-info-label">Horario</div>
          <div class="drawer-info-value" *ngIf="business.hours.allDay">24 horas</div>
          <div class="drawer-info-value" *ngIf="!business.hours.allDay && business.hours.weekdays">
            Lun–Vie {{ business.hours.weekdays.open }}–{{ business.hours.weekdays.close }}
          </div>
        </div>
        <div class="drawer-info-item">
          <div class="drawer-info-label">Productos</div>
          <div class="drawer-tags">
            <span class="drawer-tag" *ngFor="let p of business.products.split(',').slice(0,4)">{{ p.trim() }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="drawer-footer">
      <button class="btn-primary" style="width:100%" (click)="switchToEdit()">✏️ Editar información</button>
      <button class="btn-danger" style="width:100%;margin-top:8px" (click)="onDelete()">🗑 Eliminar negocio</button>
    </div>
  </ng-container>

  <!-- MODO: EDIT -->
  <ng-container *ngIf="internalMode === 'edit' && form">
    <div class="drawer-header">
      <div style="display:flex;align-items:center;gap:8px;">
        <button class="drawer-back" (click)="switchToDetail()">←</button>
        <span class="drawer-title">Editar negocio</span>
      </div>
      <button class="drawer-close" (click)="closed.emit()">✕</button>
    </div>
    <div class="drawer-body" [formGroup]="form">
      <div class="drawer-form-section">Datos de contacto</div>
      <div class="drawer-form-row">
        <div class="drawer-form-group">
          <label>Nombre completo</label>
          <input type="text" formControlName="contactName" class="drawer-input">
        </div>
        <div class="drawer-form-group">
          <label>Teléfono contacto</label>
          <input type="text" formControlName="contactPhone" maxlength="10" class="drawer-input">
        </div>
      </div>
      <div class="drawer-form-group">
        <label>Correo</label>
        <input type="email" formControlName="contactEmail" class="drawer-input">
      </div>
      <div class="drawer-form-section">Datos del negocio</div>
      <div class="drawer-form-group">
        <label>Nombre comercial</label>
        <input type="text" formControlName="businessName" class="drawer-input">
      </div>
      <div class="drawer-form-row">
        <div class="drawer-form-group">
          <label>Giro</label>
          <input type="text" formControlName="category" class="drawer-input">
        </div>
        <div class="drawer-form-group">
          <label>Tel. publicación</label>
          <input type="text" formControlName="publicPhone" maxlength="10" class="drawer-input">
        </div>
      </div>
      <div class="drawer-form-group">
        <label>Sitio web</label>
        <input type="text" formControlName="website" class="drawer-input">
      </div>
      <!-- Map -->
      <div class="drawer-form-group">
        <label>Ubicación</label>
        <google-map height="160px" width="100%" [center]="mapCenter" [zoom]="zoom" [options]="mapOptions" (mapClick)="onMapClick($event)" style="border-radius:10px;overflow:hidden;display:block;">
          <map-marker [position]="markerPosition" [options]="{draggable:true}" (mapDragend)="onMarkerDragEnd($event)"></map-marker>
        </google-map>
      </div>
      <div class="drawer-form-group">
        <label>Productos / servicios</label>
        <textarea formControlName="products" rows="3" class="drawer-textarea" placeholder="Hasta 25 palabras separadas por comas"></textarea>
      </div>
      <div class="drawer-form-group">
        <label>Logo</label>
        <label for="logo-edit" class="drawer-logo-drop">
          <img *ngIf="logoPreview" [src]="logoPreview" alt="Logo" style="height:100%;object-fit:contain;padding:4px;">
          <span *ngIf="!logoPreview">📤 Subir logo</span>
        </label>
        <input id="logo-edit" type="file" accept=".jpg,.jpeg,.png,.webp" style="display:none" (change)="onLogoChange($event)">
      </div>
    </div>
    <div class="drawer-footer">
      <button class="btn-primary" style="width:100%" (click)="onSave()" [disabled]="form.invalid">💾 Guardar cambios</button>
      <button class="btn-secondary" style="width:100%;margin-top:8px" (click)="switchToDetail()">Cancelar</button>
    </div>
  </ng-container>

  <!-- MODO: ADD -->
  <ng-container *ngIf="internalMode === 'add' && form">
    <div class="drawer-header">
      <span class="drawer-title">Nuevo negocio</span>
      <button class="drawer-close" (click)="closed.emit()">✕</button>
    </div>
    <div class="drawer-body" [formGroup]="form">
      <!-- Steps indicator -->
      <div class="drawer-steps">
        <div class="drawer-step" [class.drawer-step--active]="currentStep === 1" [class.drawer-step--done]="currentStep > 1">1</div>
        <div class="drawer-step-line" [class.drawer-step-line--done]="currentStep > 1"></div>
        <div class="drawer-step" [class.drawer-step--active]="currentStep === 2" [class.drawer-step--done]="currentStep > 2">2</div>
        <div class="drawer-step-line" [class.drawer-step-line--done]="currentStep > 2"></div>
        <div class="drawer-step" [class.drawer-step--active]="currentStep === 3">3</div>
      </div>
      <div class="drawer-step-label">Paso {{ currentStep }} de 3 — {{ ['','Contacto','Negocio','Horarios y logo'][currentStep] }}</div>

      <!-- Step 1: Contact -->
      <ng-container *ngIf="currentStep === 1">
        <div class="drawer-form-group">
          <label>Nombre completo *</label>
          <input type="text" formControlName="contactName" class="drawer-input" placeholder="Tu nombre">
        </div>
        <div class="drawer-form-group">
          <label>Correo *</label>
          <input type="email" formControlName="contactEmail" class="drawer-input" placeholder="correo@ejemplo.com">
        </div>
        <div class="drawer-form-group">
          <label>Teléfono de contacto *</label>
          <input type="text" formControlName="contactPhone" maxlength="10" class="drawer-input" placeholder="10 dígitos">
        </div>
      </ng-container>

      <!-- Step 2: Business -->
      <ng-container *ngIf="currentStep === 2">
        <div class="drawer-form-group">
          <label>Nombre comercial *</label>
          <input type="text" formControlName="businessName" class="drawer-input" placeholder="Nombre de tu negocio">
        </div>
        <div class="drawer-form-row">
          <div class="drawer-form-group">
            <label>Giro *</label>
            <input type="text" formControlName="category" class="drawer-input" placeholder="Ej. Restaurantes">
          </div>
          <div class="drawer-form-group">
            <label>Tel. publicación *</label>
            <input type="text" formControlName="publicPhone" maxlength="10" class="drawer-input" placeholder="10 dígitos">
          </div>
        </div>
        <div class="drawer-form-group">
          <label>Sitio web</label>
          <input type="text" formControlName="website" class="drawer-input" placeholder="https://...">
        </div>
        <div class="drawer-form-group">
          <label>Ubicación *</label>
          <google-map height="160px" width="100%" [center]="mapCenter" [zoom]="zoom" [options]="mapOptions" (mapClick)="onMapClick($event)" style="border-radius:10px;overflow:hidden;display:block;">
            <map-marker [position]="markerPosition" [options]="{draggable:true}" (mapDragend)="onMarkerDragEnd($event)"></map-marker>
          </google-map>
        </div>
        <div class="drawer-form-group">
          <label>Productos / servicios *</label>
          <textarea formControlName="products" rows="3" class="drawer-textarea" placeholder="Hasta 25 palabras separadas por comas"></textarea>
        </div>
      </ng-container>

      <!-- Step 3: Logo + Hours -->
      <ng-container *ngIf="currentStep === 3">
        <div class="drawer-form-group">
          <label>Logo</label>
          <label for="logo-add" class="drawer-logo-drop">
            <img *ngIf="logoPreview" [src]="logoPreview" alt="Logo" style="height:100%;object-fit:contain;padding:4px;">
            <span *ngIf="!logoPreview">📤 Subir logo (.jpg, .png, .webp)</span>
          </label>
          <input id="logo-add" type="file" accept=".jpg,.jpeg,.png,.webp" style="display:none" (change)="onLogoChange($event)">
        </div>
        <div class="drawer-form-group">
          <label class="drawer-checkbox-label">
            <input type="checkbox" formControlName="allDay"> 24 horas
          </label>
        </div>
        <ng-container *ngIf="!form.value.allDay">
          <div class="drawer-hours-row">
            <span>Lun–Vie:</span>
            <input type="time" formControlName="wdOpen" class="drawer-time">
            <input type="time" formControlName="wdClose" class="drawer-time">
          </div>
          <div class="drawer-hours-row">
            <span>Sábado:</span>
            <input type="time" formControlName="satOpen" class="drawer-time">
            <input type="time" formControlName="satClose" class="drawer-time">
          </div>
          <div class="drawer-hours-row">
            <span>Domingo:</span>
            <input type="time" formControlName="sunOpen" class="drawer-time">
            <input type="time" formControlName="sunClose" class="drawer-time">
          </div>
        </ng-container>
      </ng-container>
    </div>
    <div class="drawer-footer">
      <button *ngIf="currentStep < 3" class="btn-primary" style="width:100%" (click)="nextStep()">Siguiente →</button>
      <button *ngIf="currentStep === 3" class="btn-primary" style="width:100%" (click)="onSave()" [disabled]="form.invalid">Registrar negocio →</button>
      <button *ngIf="currentStep > 1" class="btn-secondary" style="width:100%;margin-top:8px" (click)="prevStep()">← Atrás</button>
    </div>
  </ng-container>

</div>
```

- [ ] **Step 4: Implementar `business-drawer.scss`**

```scss
@use 'styles/variables' as *;
@use 'styles/mixins' as *;

:host {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

.drawer-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,.4);
  backdrop-filter: blur(2px);
}

.drawer-panel {
  position: relative;
  width: 380px;
  max-width: 90vw;
  height: 100%;
  background: $color-white;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 24px rgba(0,0,0,.15);
  animation: slideIn .25s ease-out;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid $color-border;
  flex-shrink: 0;
}

.drawer-title { font-size: 15px; font-weight: $font-weight-black; color: $color-text; }

.drawer-close {
  width: 28px; height: 28px;
  background: $color-bg; border: none; border-radius: $radius-md;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 12px; color: $color-text-light;
  &:hover { background: $color-border; }
}

.drawer-back {
  width: 28px; height: 28px;
  background: $color-bg; border: 1px solid $color-border; border-radius: $radius-md;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 13px; color: $color-text;
  &:hover { background: $color-border; }
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 18px;
}

.drawer-footer {
  padding: 14px 18px;
  border-top: 1px solid $color-border;
  flex-shrink: 0;
}

// Detail mode styles
.drawer-biz-hero {
  display: flex; align-items: center; gap: 12px;
  margin-bottom: $spacing-md;
  padding-bottom: $spacing-md;
  border-bottom: 1px solid $color-border;
}
.drawer-biz-icon {
  width: 52px; height: 52px; background: #FEF9C3;
  border-radius: 14px; display: flex; align-items: center;
  justify-content: center; font-size: 26px; flex-shrink: 0;
}
.drawer-biz-name { font-size: 16px; font-weight: $font-weight-black; color: $color-text; }
.drawer-biz-cat { font-size: 11px; color: $color-text-muted; margin-top: 2px; }

.drawer-kpis {
  display: flex; gap: 8px; margin-bottom: $spacing-md;
}
.drawer-kpi {
  flex: 1; background: $color-bg; border-radius: $radius-lg;
  padding: 10px; text-align: center;
  &__value { font-size: 16px; font-weight: $font-weight-black; color: $color-text; }
  &__label { font-size: 9px; color: $color-text-muted; font-weight: $font-weight-bold; margin-top: 2px; }
}

.drawer-info-grid { display: flex; flex-direction: column; gap: 10px; }
.drawer-info-item { }
.drawer-info-label {
  font-size: 9px; font-weight: $font-weight-bold;
  color: $color-text-muted; letter-spacing: .5px;
  text-transform: uppercase; margin-bottom: 3px;
}
.drawer-info-value { font-size: 12px; font-weight: $font-weight-semibold; color: $color-text; }
.drawer-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
.drawer-tag {
  background: $color-bg; color: $color-text;
  font-size: 10px; font-weight: $font-weight-semibold;
  padding: 3px 8px; border-radius: $radius-md;
}

// Form styles
.drawer-form-section {
  font-size: 10px; font-weight: $font-weight-bold; color: $color-text-muted;
  letter-spacing: .8px; text-transform: uppercase;
  padding-bottom: 6px; border-bottom: 1px solid $color-border;
  margin: 14px 0 10px;
}
.drawer-form-group {
  margin-bottom: 10px;
  label { display: block; font-size: 11px; font-weight: $font-weight-bold; margin-bottom: 4px; }
}
.drawer-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.drawer-input {
  width: 100%; height: 34px;
  border: 1.5px solid $color-border; border-radius: $radius-md;
  padding: 0 10px; font-size: 12px; font-family: $font-family;
  outline: none;
  &:focus { border-color: $color-primary; }
  &[readonly] { background: $color-bg; color: $color-text-light; }
}
.drawer-textarea {
  width: 100%; border: 1.5px solid $color-border; border-radius: $radius-md;
  padding: 8px 10px; font-size: 12px; font-family: $font-family;
  resize: vertical; outline: none;
  &:focus { border-color: $color-primary; }
}
.drawer-logo-drop {
  display: flex; align-items: center; justify-content: center;
  height: 60px; border: 2px dashed $color-border;
  border-radius: $radius-md; cursor: pointer;
  font-size: 12px; font-weight: $font-weight-semibold; color: $color-text-muted;
  &:hover { border-color: $color-primary; color: $color-text; }
}

// Steps
.drawer-steps {
  display: flex; align-items: center; gap: 4px; margin-bottom: 8px;
}
.drawer-step {
  width: 24px; height: 24px; border-radius: 50%;
  background: $color-bg; color: $color-text-muted;
  font-size: 10px; font-weight: $font-weight-black;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  &--active { background: $color-primary; color: $color-text; }
  &--done { background: $color-text; color: $color-primary; }
}
.drawer-step-line {
  flex: 1; height: 2px; background: $color-border;
  &--done { background: $color-text; }
}
.drawer-step-label {
  font-size: 11px; font-weight: $font-weight-bold; color: $color-text;
  margin-bottom: 14px;
}

// Hours
.drawer-checkbox-label {
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: $font-weight-semibold; cursor: pointer;
}
.drawer-hours-row {
  display: grid; grid-template-columns: 1fr auto auto;
  align-items: center; gap: 8px; margin-bottom: 8px;
  font-size: 12px; font-weight: $font-weight-semibold;
}
.drawer-time {
  height: 28px; border: 1.5px solid $color-border;
  border-radius: $radius-md; padding: 0 6px; font-size: 11px;
  outline: none; &:focus { border-color: $color-primary; }
}
```

- [ ] **Step 5: Ejecutar tests**

```bash
ng test --watch=false
```
Expected: spec de `BusinessDrawer` pasa ("should create").

- [ ] **Step 6: Commit**

```bash
git add src/app/features/dashboard/components/business-drawer/ src/app/features/dashboard/metricas/metricas-module.ts
git commit -m "feat: add BusinessDrawer component with detail/edit/add modes"
```

---

## Task 8: Refactor Dashboard layout (sidebar icon-only + header pill nav)

**Files:**
- Modify: `src/app/features/dashboard/dashboard/dashboard.ts`
- Modify: `src/app/features/dashboard/dashboard/dashboard.html`
- Modify: `src/app/features/dashboard/dashboard/dashboard.scss`
- Modify: `src/app/features/dashboard/components/header/header.ts`
- Modify: `src/app/features/dashboard/components/header/header.html`
- Modify: `src/app/features/dashboard/components/header/header.scss`
- Modify: `src/app/features/dashboard/components/nav-lateral/nav-lateral.html`
- Modify: `src/app/features/dashboard/components/nav-lateral/nav-lateral.scss`

- [ ] **Step 1: Actualizar `dashboard.ts`**

```typescript
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthMockService } from '../../../core/services/auth.mock.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  constructor(private auth: AuthMockService, private router: Router) {}

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  get userName(): string {
    return this.auth.currentUser()?.contactName ?? '';
  }
}
```

- [ ] **Step 2: Actualizar `dashboard.html`**

```html
<div class="dashboard">
  <app-header
    [userName]="userName"
    (logoutEvent)="logout()">
  </app-header>
  <div class="dashboard__body">
    <app-nav-lateral class="dashboard__sidebar"></app-nav-lateral>
    <main class="dashboard__content">
      <router-outlet></router-outlet>
    </main>
  </div>
</div>
```

- [ ] **Step 3: Actualizar `dashboard.scss`**

```scss
@use 'styles/variables' as *;
@use 'styles/mixins' as *;

.dashboard {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: $color-bg;

  &__body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  &__sidebar {
    flex-shrink: 0;
  }

  &__content {
    flex: 1;
    overflow-y: auto;
    padding: $spacing-lg;
  }
}
```

- [ ] **Step 4: Actualizar `header.ts`**

```typescript
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  @Input() userName = '';
  @Output() logoutEvent = new EventEmitter<void>();

  constructor(private router: Router) {}

  navigate(path: string): void { this.router.navigate([path]); }

  isActive(path: string): boolean { return this.router.url.startsWith(path); }
}
```

- [ ] **Step 5: Actualizar `header.html`**

```html
<header class="header">
  <div class="header__logo">
    <span class="header__logo-text">SECCI</span>
    <span class="header__logo-pin">📍</span>
    <span class="header__logo-text">N AMARILLA</span>
  </div>

  <nav class="header__nav">
    <button class="header__nav-pill" [class.header__nav-pill--active]="isActive('/dashboard/metricas')" (click)="navigate('/dashboard/metricas')">Panel</button>
    <button class="header__nav-pill" [class.header__nav-pill--active]="isActive('/dashboard/seguridad')" (click)="navigate('/dashboard/seguridad')">Seguridad</button>
  </nav>

  <div class="header__right">
    <div class="header__avatar">{{ userName ? userName[0].toUpperCase() : 'U' }}</div>
    <button class="header__logout" (click)="logoutEvent.emit()">Salir</button>
  </div>
</header>
```

- [ ] **Step 6: Actualizar `header.scss`**

```scss
@use 'styles/variables' as *;

.header {
  background: $color-white;
  border-bottom: 1px solid $color-border;
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 20px 0 80px;
  gap: 16px;
  position: sticky;
  top: 0;
  z-index: 100;
  flex-shrink: 0;

  &__logo {
    display: flex;
    align-items: center;
    gap: 1px;
    margin-right: auto;
  }
  &__logo-text { font-size: 15px; font-weight: $font-weight-black; letter-spacing: -0.5px; }
  &__logo-pin {
    display: inline-flex; align-items: center; justify-content: center;
    width: 16px; height: 16px; background: $color-primary;
    border-radius: 50%; font-size: 8px;
  }

  &__nav {
    display: flex;
    background: $color-bg;
    border-radius: 20px;
    padding: 3px;
    gap: 2px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  &__nav-pill {
    padding: 6px 14px; border-radius: 16px;
    font-size: 12px; font-weight: $font-weight-semibold;
    cursor: pointer; color: $color-text-light;
    background: transparent; border: none; font-family: $font-family;
    transition: all .15s;
    &--active { background: $color-white; color: $color-text; font-weight: $font-weight-bold; box-shadow: 0 1px 3px rgba(0,0,0,.1); }
    &:hover:not(&--active) { color: $color-text; }
  }

  &__right { display: flex; align-items: center; gap: 10px; margin-left: auto; }

  &__avatar {
    width: 32px; height: 32px; background: $color-text;
    border-radius: 50%; display: flex; align-items: center;
    justify-content: center; color: $color-primary;
    font-size: 12px; font-weight: $font-weight-black;
  }

  &__logout {
    background: transparent; color: $color-text-light;
    border: 1px solid $color-border; border-radius: $radius-full;
    padding: 5px 12px; font-size: 11px; font-weight: $font-weight-semibold;
    cursor: pointer; font-family: $font-family;
    &:hover { background: $color-bg; color: $color-text; }
  }
}
```

- [ ] **Step 7: Actualizar `nav-lateral.html` (ahora sidebar icon-only)**

```html
<nav class="sidebar">
  <a routerLink="/dashboard/metricas" routerLinkActive="sidebar__item--active" class="sidebar__item" title="Panel">
    📊
  </a>
  <a routerLink="/dashboard/seguridad" routerLinkActive="sidebar__item--active" class="sidebar__item" title="Seguridad">
    🔒
  </a>
  <div class="sidebar__spacer"></div>
  <div class="sidebar__item sidebar__item--settings" title="Configuración">⚙️</div>
</nav>
```

- [ ] **Step 8: Actualizar `nav-lateral.scss`**

```scss
@use 'styles/variables' as *;

.sidebar {
  width: 60px;
  background: $color-white;
  border-right: 1px solid $color-border;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  gap: 4px;

  &__item {
    width: 40px; height: 40px;
    display: flex; align-items: center; justify-content: center;
    border-radius: $radius-md; cursor: pointer;
    font-size: 18px; text-decoration: none; color: $color-text-muted;
    transition: all .15s;
    &:hover { background: $color-bg; }
    &--active { background: $color-primary; }
    &--settings { color: $color-text-muted; }
  }

  &__spacer { flex: 1; }
}
```

- [ ] **Step 9: Ejecutar tests**

```bash
ng test --watch=false
```
Expected: specs de Dashboard y Header pasan.

- [ ] **Step 10: Commit**

```bash
git add src/app/features/dashboard/dashboard/ src/app/features/dashboard/components/header/ src/app/features/dashboard/components/nav-lateral/
git commit -m "feat: redesign dashboard layout — icon sidebar, pill nav header"
```

---

## Task 9: Refactor MetricasComponent — Bento Grid

**Files:**
- Modify: `src/app/features/dashboard/metricas/metricas/metricas.ts`
- Modify: `src/app/features/dashboard/metricas/metricas/metricas.html`
- Modify: `src/app/features/dashboard/metricas/metricas/metricas.scss`
- Modify: `src/app/features/dashboard/metricas/metricas-module.ts`

- [ ] **Step 1: Actualizar `metricas-module.ts` con todos los componentes**

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { Metricas } from './metricas/metricas';
import { LineChart } from './line-chart/line-chart';
import { KpiCard } from './kpi-card/kpi-card';
import { BusinessListCard } from './business-list-card/business-list-card';
import { BusinessDrawer } from '../components/business-drawer/business-drawer';

const routes: Routes = [{ path: '', component: Metricas }];

@NgModule({
  declarations: [Metricas, LineChart, KpiCard, BusinessListCard, BusinessDrawer],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes), GoogleMapsModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())]
})
export class MetricasModule {}
```

- [ ] **Step 2: Actualizar `metricas.ts`**

```typescript
import { Component, OnInit } from '@angular/core';
import { MetricsMockService } from '../../../../core/services/metrics.mock.service';
import { BusinessMockService } from '../../../../core/services/business.mock.service';
import { AuthMockService } from '../../../../core/services/auth.mock.service';
import { DailyMetric, Metrics } from '../../../../core/models/metrics.model';
import { Business } from '../../../../core/models/business.model';

@Component({
  selector: 'app-metricas',
  standalone: false,
  templateUrl: './metricas.html',
  styleUrl: './metricas.scss'
})
export class Metricas implements OnInit {
  businesses: Business[] = [];
  metrics: Metrics | null = null;
  chartData: DailyMetric[] = [];
  totalClicks = 0;
  totalImpressions = 0;

  // Drawer state
  drawerOpen = false;
  drawerMode: 'detail' | 'edit' | 'add' = 'detail';
  selectedBusiness: Business | null = null;

  get userName(): string {
    return this.auth.currentUser()?.contactName ?? '';
  }

  get ctr(): string {
    if (!this.totalImpressions) return '0%';
    return ((this.totalClicks / this.totalImpressions) * 100).toFixed(1) + '%';
  }

  constructor(
    private metricsService: MetricsMockService,
    private businessService: BusinessMockService,
    private auth: AuthMockService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.businesses = this.businessService.businesses();
    const ids = this.businesses.map(b => b.id);
    if (!ids.length) return;
    this.metricsService.getMetrics(ids).subscribe(m => {
      this.metrics = m;
      this.chartData = m.last30Days;
      this.totalClicks = m.last30Days.reduce((s, d) => s + d.clicks, 0);
      this.totalImpressions = m.last30Days.reduce((s, d) => s + d.impressions, 0);
    });
  }

  openDrawerDetail(biz: Business): void {
    this.selectedBusiness = biz;
    this.drawerMode = 'detail';
    this.drawerOpen = true;
  }

  openDrawerAdd(): void {
    this.selectedBusiness = null;
    this.drawerMode = 'add';
    this.drawerOpen = true;
  }

  closeDrawer(): void { this.drawerOpen = false; }

  onDrawerSaved(biz: Business): void {
    this.closeDrawer();
    this.loadData();
  }

  onDrawerDeleted(id: string): void {
    this.closeDrawer();
    this.loadData();
  }
}
```

- [ ] **Step 3: Actualizar `metricas.html`**

```html
<div class="metricas">
  <!-- Welcome -->
  <div class="metricas__welcome">
    <div>
      <h1 class="metricas__welcome-title">Bienvenido, <span>{{ userName }} 📍</span></h1>
      <p class="metricas__welcome-sub">Panel de control · Últimos 30 días · {{ businesses.length }} negocio{{ businesses.length !== 1 ? 's' : '' }} activo{{ businesses.length !== 1 ? 's' : '' }}</p>
    </div>
    <button class="btn-accent" (click)="openDrawerAdd()">+ Agregar negocio</button>
  </div>

  <!-- KPI row -->
  <div class="metricas__kpi-row">
    <app-kpi-card label="Clics totales"  [value]="totalClicks"      badge="↑ 8%"  badgeType="up"></app-kpi-card>
    <app-kpi-card label="Impresiones"    [value]="totalImpressions"  badge="↓ 3%"  badgeType="down"></app-kpi-card>
    <app-kpi-card label="CTR promedio"   [value]="ctr"               badge="↑ 2%"  badgeType="up"></app-kpi-card>
    <app-kpi-card label="Mis negocios"   [value]="businesses.length" [accent]="true"></app-kpi-card>
  </div>

  <!-- Main grid: chart + business list -->
  <div class="metricas__grid">
    <div class="metricas__chart-card">
      <div class="metricas__chart-header">
        <div>
          <div class="metricas__chart-title">Engagement — últimos 30 días</div>
          <div class="metricas__chart-sub">Clics e impresiones · todos los negocios</div>
        </div>
      </div>
      <app-line-chart [data]="chartData"></app-line-chart>
    </div>
    <app-business-list-card
      [businesses]="businesses"
      [metrics]="metrics"
      (businessSelected)="openDrawerDetail($event)">
    </app-business-list-card>
  </div>
</div>

<!-- Drawer -->
<app-business-drawer
  *ngIf="drawerOpen"
  [mode]="drawerMode"
  [business]="selectedBusiness"
  [metrics]="metrics"
  (closed)="closeDrawer()"
  (saved)="onDrawerSaved($event)"
  (deleted)="onDrawerDeleted($event)">
</app-business-drawer>
```

- [ ] **Step 4: Actualizar `metricas.scss`**

```scss
@use 'styles/variables' as *;
@use 'styles/mixins' as *;

.metricas {
  max-width: 1200px;
  margin: 0 auto;

  &__welcome {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: $spacing-lg;
    gap: $spacing-md;
  }

  &__welcome-title {
    font-size: 24px;
    font-weight: $font-weight-black;
    color: $color-text;
    span { font-weight: $font-weight-regular; color: $color-text-muted; }
  }

  &__welcome-sub {
    font-size: 12px;
    color: $color-text-muted;
    margin-top: 2px;
  }

  &__kpi-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 12px;
    margin-bottom: $spacing-md;

    @include md { grid-template-columns: 1fr 1fr 1fr 1fr; }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    gap: 14px;
    align-items: start;
  }

  &__chart-card {
    background: $color-card-bg;
    border-radius: $radius-xl;
    padding: $spacing-md;
    box-shadow: 0 1px 3px rgba(0,0,0,.06);
  }

  &__chart-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: $spacing-md;
  }

  &__chart-title {
    font-size: 14px;
    font-weight: $font-weight-extrabold;
    color: $color-text;
  }

  &__chart-sub {
    font-size: 11px;
    color: $color-text-muted;
    margin-top: 2px;
  }
}
```

- [ ] **Step 5: Verificar que `metricas-module.ts` declara `BusinessDrawer` (ya hecho en Task 7)**

`BusinessDrawer` ya quedó declarado en `MetricasModule` desde Task 7, junto con `ReactiveFormsModule` y `GoogleMapsModule`. La versión final del módulo, con todos los componentes, es:

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { Metricas } from './metricas/metricas';
import { LineChart } from './line-chart/line-chart';
import { KpiCard } from './kpi-card/kpi-card';
import { BusinessListCard } from './business-list-card/business-list-card';
import { BusinessDrawer } from '../components/business-drawer/business-drawer';

const routes: Routes = [{ path: '', component: Metricas }];

@NgModule({
  declarations: [Metricas, LineChart, KpiCard, BusinessListCard, BusinessDrawer],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes), GoogleMapsModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())]
})
export class MetricasModule {}
```

> `BusinessDrawer` NO se declara en `DashboardModule` — solo en `MetricasModule` — para evitar la dependencia circular (DashboardModule lazy-loads MetricasModule). Confirmar que `DashboardModule.declarations` NO lo incluye.

- [ ] **Step 6: Ejecutar tests**

```bash
ng test --watch=false
```
Expected: specs de `Metricas`, `KpiCard`, `BusinessListCard`, `BusinessDrawer` pasan.

- [ ] **Step 7: Verificar build**

```bash
ng build
```
Expected: build limpio. Si hay circular dependency, aplicar la alternativa del Step 5.

- [ ] **Step 8: Commit**

```bash
git add src/app/features/dashboard/metricas/ src/app/features/dashboard/dashboard-module.ts
git commit -m "feat: refactor MetricasComponent to Bento Grid with multi-business support and drawer"
```

---

## Task 10: Cleanup — eliminar /mi-negocio y componentes obsoletos

**Files:**
- Delete: `src/app/features/dashboard/mi-negocio/` (directorio completo)
- Modify: `src/app/features/dashboard/dashboard-routing-module.ts`
- Delete: `src/app/features/dashboard/components/nav-inferior/` (directorio)

- [ ] **Step 1: Eliminar la ruta `/mi-negocio` del routing**

Actualizar `dashboard-routing-module.ts`:
```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';

const routes: Routes = [
  {
    path: '',
    component: Dashboard,
    children: [
      { path: '', redirectTo: 'metricas', pathMatch: 'full' },
      {
        path: 'metricas',
        loadChildren: () =>
          import('./metricas/metricas-module').then(m => m.MetricasModule)
      },
      {
        path: 'seguridad',
        loadChildren: () =>
          import('./seguridad/seguridad-module').then(m => m.SeguridadModule)
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

- [ ] **Step 2: Eliminar directorio `mi-negocio`**

```bash
rm -rf src/app/features/dashboard/mi-negocio
```

- [ ] **Step 3: Eliminar `NavInferior` de `dashboard-module.ts`**

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { DashboardRoutingModule } from './dashboard-routing-module';
import { Dashboard } from './dashboard/dashboard';
import { Header } from './components/header/header';
import { NavLateral } from './components/nav-lateral/nav-lateral';

@NgModule({
  declarations: [Dashboard, Header, NavLateral],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, GoogleMapsModule, DashboardRoutingModule]
})
export class DashboardModule {}
```

- [ ] **Step 4: Eliminar directorio `nav-inferior`**

```bash
rm -rf src/app/features/dashboard/components/nav-inferior
```

- [ ] **Step 5: Ejecutar todos los tests**

```bash
ng test --watch=false
```
Expected: todos los tests pasan. No deben quedar referencias a `MiNegocio`, `NavInferior` o `mi-negocio`.

- [ ] **Step 6: Build de producción**

```bash
ng build --configuration=production
```
Expected: build limpio, 5 lazy chunks (crear-contrasena, login, metricas, seguridad — sin mi-negocio).

- [ ] **Step 7: Commit final**

```bash
git add -A
git commit -m "feat: remove /mi-negocio route, cleanup obsolete components"
```

---

## Task 11: Verificación final

- [ ] **Step 1: Ejecutar suite completa de tests**

```bash
ng test --watch=false
```
Expected: todos los specs pasan.

- [ ] **Step 2: Build de producción**

```bash
ng build --configuration=production
```
Expected: sin errores. Bundle < 1 MB para el chunk principal.

- [ ] **Step 3: Verificar flujos manualmente con `ng serve`**

```bash
ng serve
```

Verificar en `http://localhost:4200`:

1. `/crear-contrasena?email=test@prueba.com` → formulario con password strength
2. `/login` → formulario, error inline con credenciales malas
3. Login exitoso → redirige a `/dashboard/metricas`
4. Dashboard muestra: header con pill nav, sidebar icon-only, 4 KPI cards, gráfica, lista de 2 negocios
5. Clic en negocio → drawer lateral se abre con detalle + KPIs + CTAs
6. "Editar información" → drawer cambia a modo edit con formulario y mapa
7. Guardar cambios → drawer cierra, lista se actualiza
8. "Eliminar negocio" → confirm dialog, negocio desaparece de la lista
9. "+ Agregar negocio" → drawer en modo add con 3 pasos
10. `/dashboard/seguridad` → formulario cambio de contraseña
11. Cerrar sesión → redirige a `/login`
12. Acceso directo a `/dashboard` sin sesión → redirige a `/login`

- [ ] **Step 4: Commit final con tag**

```bash
git add .
git commit -m "feat: complete dashboard redesign with Bento Grid and multi-business support"
```

---

## Notas importantes

1. **Circular dependency:** Si `MetricasModule` importa `DashboardModule` y `DashboardModule` lazy-loads `MetricasModule`, habrá circular dependency. La solución es declarar `BusinessDrawer` en `MetricasModule` directamente (no en `DashboardModule`).

2. **Angular 22 naming:** Los archivos generados por el CLI no tienen `.component.` ni `.module.` en el nombre. Las clases tampoco llevan sufijo (`Metricas`, no `MetricasComponent`).

3. **Google Maps API key:** Debe reemplazarse `TU_API_KEY_AQUI` en `src/index.html` y `environment.ts` con una key real que tenga Maps JavaScript API + Geocoding API habilitadas.

4. **`ng generate`:** Todo artefacto Angular (componentes, módulos, services, guards) DEBE generarse con el CLI. Nunca crear archivos a mano.
