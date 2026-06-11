# Spec: Dashboard Rediseño + Multi-Negocio

**Fecha:** 2026-06-10
**Proyecto:** SACOM-modulo-free-account
**Tipo:** Refactor + feature

---

## 1. Resumen

Rediseño completo del dashboard con estilo Bento Grid fiel al look & feel real de seccionamarilla.com.mx, más soporte para que un usuario gestione múltiples negocios (1:N). El formulario de edición y alta de negocios se mueve a un drawer lateral reutilizable.

---

## 2. Decisiones de diseño

### 2.1 Estilo visual
- **Fondo:** `#F4F4F4` (igual al sitio real)
- **Cards:** `#FFFFFF` con `box-shadow: 0 1px 3px rgba(0,0,0,.06)`
- **Texto principal:** `#1A1A1A` (más oscuro que el anterior `#333333`)
- **Acento:** `#FFD800` (sin cambio — solo como acento, no fondo)
- **Botón primario:** negro `#1A1A1A`, pill redondeado
- **Botón peligro:** borde rojo `#DC2626`, fondo transparente
- **Tipografía:** Inter, `font-weight: 900` para KPIs y títulos principales

### 2.2 Layout del dashboard
- **Sidebar:** icon-only (60px), amarillo en ícono activo
- **Header:** logo SA centrado con pill nav: Panel | Métricas | Negocios | Seguridad
- **Área principal:** Bento Grid de cards mixtos (3 columnas, filas variables)
- **Sin nav inferior en móvil:** reemplazado por el pill nav en header que colapsa a hamburguesa

### 2.3 Drawer lateral
- Un único `BusinessDrawerComponent` con `@Input() mode: 'detail' | 'edit' | 'add'`
- Se desliza desde la derecha; fondo de la página queda oscurecido pero visible
- **Modo `detail`:** hero del negocio, mini-KPIs (clics/impresiones/CTR), datos guardados, CTAs Editar y Eliminar
- **Modo `edit`:** botón "← volver" al detalle, formulario pre-cargado con datos del negocio (igual campos que el formulario original), mapa Google Maps, logo upload
- **Modo `add`:** formulario en blanco con indicador de 3 pasos (Contacto → Negocio → Horarios/Logo)

---

## 3. Cambios en modelos

### `metrics.model.ts`
```typescript
// Antes
interface Metrics {
  businessId: string;
  last30Days: DailyMetric[];
}

// Después
interface Metrics {
  businessIds: string[];
  last30Days: DailyMetric[];
}
```

### `mock-data.json`
```json
{
  "businesses": [
    {
      "id": "biz-001", "userId": "usr-001",
      "businessName": "Taquería El Buen Sabor",
      "contactName": "Juan Pérez García", "contactEmail": "juan@buensabor.com",
      "contactPhone": "5551234567", "categoryCode": 5812, "category": "Restaurantes",
      "website": "https://www.buensabor.com", "publicPhone": "5559876543",
      "products": "tacos, quesadillas, tortas, burritos, sopes",
      "logoUrl": "",
      "address": { "fullAddress": "Av. Insurgentes Sur 123, Roma Norte, 06700 CDMX",
        "street": "Av. Insurgentes Sur", "exteriorNumber": "123", "colony": "Roma Norte",
        "postalCode": "06700", "city": "Ciudad de México", "state": "CDMX",
        "lat": 19.4195, "lng": -99.1674 },
      "hours": { "allDay": false,
        "weekdays": { "open": "08:00", "close": "22:00" },
        "saturday": { "open": "09:00", "close": "23:00" },
        "sunday": { "open": "10:00", "close": "21:00" } }
    },
    {
      "id": "biz-002", "userId": "usr-001",
      "businessName": "Tech Solutions MX",
      "contactName": "Juan Pérez García", "contactEmail": "juan@techsolutions.mx",
      "contactPhone": "5551234567", "categoryCode": 7372, "category": "Tecnología",
      "website": "https://www.techsolutions.mx", "publicPhone": "5554567890",
      "products": "desarrollo web, apps móviles, consultoría IT",
      "logoUrl": "",
      "address": { "fullAddress": "Av. Presidente Masaryk 111, Polanco, 11560 CDMX",
        "street": "Av. Presidente Masaryk", "exteriorNumber": "111", "colony": "Polanco",
        "postalCode": "11560", "city": "Ciudad de México", "state": "CDMX",
        "lat": 19.4326, "lng": -99.1962 },
      "hours": { "allDay": false,
        "weekdays": { "open": "09:00", "close": "18:00" },
        "saturday": null, "sunday": null }
    }
  ]
}
```

---

## 4. Cambios en servicios

### `BusinessMockService`

```typescript
// Signal cambia de singular a plural
businesses = signal<Business[]>(this.load());

// Métodos actualizados
getBusiness(id: string): Observable<Business>
getBusinessById(id: string): Business | undefined
addBusiness(data: Omit<Business, 'id' | 'userId'>): Observable<Business>
updateBusiness(id: string, data: Partial<Business>): Observable<Business>
deleteBusiness(id: string): Observable<void>
uploadLogo(file: File): Observable<string>  // sin cambios

// Storage key actualizada
private readonly KEY = 'sa_businesses'; // antes: 'sa_business'
```

### `MetricsMockService`

```typescript
// Acepta múltiples IDs y suma los datos
getMetrics(businessIds: string[]): Observable<Metrics>

// Genera datos por negocio y los agrega
private generateForId(id: string): DailyMetric[]
private aggregate(perBusiness: DailyMetric[][]): DailyMetric[]
```

---

## 5. Componentes nuevos

Todos generados con `ng generate`:

### `BusinessDrawerComponent`
- **Selector:** `app-business-drawer`
- **Inputs:** `mode: 'detail' | 'edit' | 'add'`, `business: Business | null`
- **Outputs:** `closed: EventEmitter<void>`, `saved: EventEmitter<Business>`, `deleted: EventEmitter<string>`
- **Módulo:** `DashboardModule`
- Maneja internamente la transición `detail → edit` sin cerrar el drawer

### `MetricasKpiCardComponent`
- **Selector:** `app-metricas-kpi-card`
- **Inputs:** `label: string`, `value: string | number`, `badge?: string`, `badgeType?: 'up' | 'down'`, `accent?: boolean`
- Cuando `accent: true` → fondo `#FFD800`

### `BusinessListCardComponent`
- **Selector:** `app-business-list-card`
- **Inputs:** `businesses: Business[]`, `metrics: Metrics`
- **Output:** `businessSelected: EventEmitter<Business>`
- Muestra cada negocio con clics individuales y tendencia (↑/↓)

---

## 6. Componentes modificados

### `DashboardComponent`
- Nuevo layout: icon sidebar 60px + header con pill nav
- Gestiona el estado del drawer: `drawerOpen`, `drawerMode`, `selectedBusiness`
- `openDrawer(mode, business?)` / `closeDrawer()`

### `MetricasComponent`
- Usa `BusinessMockService.businesses()` para obtener todos los IDs
- Llama `MetricsMockService.getMetrics(allIds)` para el KPI agregado
- Renderiza: 4 `MetricasKpiCardComponent` + gráfica de barras + `BusinessListCardComponent` + `BusinessDrawerComponent`
- Botón "+ Agregar negocio" abre el drawer en modo `add`

### `HeaderComponent`
- Nuevo diseño: logo SA izquierda, pill nav centrado, avatar + botón salir derecha
- `@Input() activeTab: 'metricas' | 'seguridad'`
- `@Output() tabChanged: EventEmitter<string>`
- `@Output() logoutEvent` (sin cambios)

### `NavLateralComponent` → renombrado a `SidebarComponent`
- Icon-only, 60px, sin texto
- Ícono activo con fondo `#FFD800`
- Íconos: 📊 Métricas, 🏪 Negocios (abre drawer de lista), 🔒 Seguridad, ⚙️ Config (bottom)

---

## 7. Rutas eliminadas

- `/dashboard/mi-negocio` **se elimina** — reemplazada por el drawer
- `MiNegocioModule` y `MiNegocioComponent` se eliminan (ya no tienen ruta propia)
- `BusinessFormComponent` y `MapPickerComponent` se mueven a `DashboardModule` y son usados directamente por `BusinessDrawerComponent` en los modos `edit` y `add`

---

## 8. Routing actualizado

```typescript
// dashboard-routing-module.ts
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'metricas', pathMatch: 'full' },
      { path: 'metricas', loadChildren: () => import('./metricas/metricas-module').then(m => m.MetricasModule) },
      { path: 'seguridad', loadChildren: () => import('./seguridad/seguridad-module').then(m => m.SeguridadModule) }
      // /mi-negocio eliminado
    ]
  }
];
```

---

## 9. Tokens SCSS actualizados

```scss
// _variables.scss — cambios y adiciones
$color-text:          #1A1A1A;  // era #333333
$color-border:        #E5E5E5;  // era #CCCCCC
$color-card-bg:       #FFFFFF;  // nuevo
$color-btn-primary:   #1A1A1A;  // nuevo
$color-danger:        #DC2626;  // nuevo (era $color-error: #D32F2F)
$color-success:       #16A34A;  // era #388E3C
```

```scss
// _typography.scss — clases nuevas
.btn-primary   { background: $color-btn-primary; color: #fff; border-radius: $radius-full; ... }
.btn-secondary { background: transparent; border: 1.5px solid $color-border; ... }
.btn-danger    { background: transparent; color: $color-danger; border: 1.5px solid $color-danger; ... }
.kpi-value     { font-size: 28px; font-weight: 900; color: $color-text; line-height: 1; }
.badge-up      { background: #F0FDF4; color: $color-success; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 10px; }
.badge-down    { background: #FEF2F2; color: $color-danger; ... }
```

---

## 10. Fuera de alcance

- Autenticación real
- Backend real
- Ruta `/dashboard/mi-negocio` (se elimina)
- Paginación de negocios (el mock soporta hasta ~10 sin problema)
- Notificaciones push
