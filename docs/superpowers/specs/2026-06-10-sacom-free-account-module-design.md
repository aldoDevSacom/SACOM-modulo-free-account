# Spec: Módulo de Autogestión de Negocios — Sección Amarilla (Free Account)

**Fecha:** 2026-06-10
**Proyecto:** SACOM-modulo-free-account
**Stack:** Angular (último LTS) · Signals · SCSS/BEM · @angular/google-maps · ng2-charts

---

## 1. Alcance

Módulo frontend-only (sin backend) que permite a usuarios gratuitos de seccionamarilla.com.mx gestionar su empresa. Toda la capa de datos se implementa con mocks (RxJS `of()` + Signals + `sessionStorage`).

El formulario de registro en `https://www.seccionamarilla.com.mx/registra-tu-empresa` ya existe y no se modifica. Este módulo agrega tres nuevas páginas:

| Ruta | Propósito |
|---|---|
| `/crear-contrasena` | Define contraseña tras completar el registro |
| `/login` | Acceso para usuarios existentes |
| `/dashboard` | Panel de gestión del negocio |

---

## 2. Flujos de usuario

### 2.1 Usuario nuevo

1. Llena el formulario en `seccionamarilla.com.mx/registra-tu-empresa`
2. Al hacer submit, el sitio original redirige a `/crear-contrasena?email=usuario@correo.com`
3. En `/crear-contrasena`: define y confirma contraseña (el username es el correo)
4. Al guardar: sesión iniciada automáticamente → redirige a `/dashboard/metricas`

### 2.2 Usuario existente

1. Navega directamente a `/login`
2. Ingresa email + contraseña
3. Si válido → `/dashboard/metricas`
4. Si inválido → mensaje de error inline

### 2.3 Protección de rutas

`AuthGuard` protege todas las rutas bajo `/dashboard`. Si no hay sesión activa, redirige a `/login`. Cualquier ruta no definida (`**`) redirige a `/login`.

---

## 3. Arquitectura

### 3.1 Estructura de carpetas

```
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   ├── business.model.ts
│   │   │   └── metrics.model.ts
│   │   └── services/
│   │       ├── auth.mock.service.ts
│   │       ├── business.mock.service.ts
│   │       └── metrics.mock.service.ts
│   ├── features/
│   │   ├── crear-contrasena/
│   │   │   └── crear-contrasena.component.ts
│   │   ├── login/
│   │   │   └── login.component.ts
│   │   └── dashboard/
│   │       ├── dashboard.component.ts       ← layout con header + nav
│   │       ├── metricas/
│   │       │   ├── metricas.component.ts
│   │       │   └── line-chart/
│   │       │       └── line-chart.component.ts
│   │       ├── mi-negocio/
│   │       │   ├── mi-negocio.component.ts
│   │       │   ├── business-form/
│   │       │   │   └── business-form.component.ts
│   │       │   └── map-picker/
│   │       │       └── map-picker.component.ts
│   │       └── seguridad/
│   │           └── seguridad.component.ts
│   └── shared/
│       └── components/
│           └── password-strength/
│               └── password-strength.component.ts
├── assets/
│   └── mock-data.json
└── styles/
    ├── _variables.scss
    ├── _mixins.scss
    ├── _reset.scss
    ├── _typography.scss
    └── styles.scss
```

> **Regla:** Todo artefacto Angular se genera con el CLI (`ng generate`). No se crean archivos de componentes, servicios o guards a mano.

### 3.2 Routing

```
AppRoutingModule
├── /crear-contrasena  → CrearContrasenaModule (lazy)
├── /login             → LoginModule (lazy)
├── /dashboard         → DashboardModule (lazy, AuthGuard)
│   ├── /metricas      → MetricasComponent
│   ├── /mi-negocio    → MiNegocioComponent
│   └── /seguridad     → SeguridadComponent
└── **                 → redirect /login
```

### 3.3 Gestión de estado

Angular Signals para estado reactivo. `sessionStorage` para persistir datos del usuario y negocio dentro de la sesión. No se usa NgRx.

---

## 4. Capa de datos mock

### 4.1 Modelos

**`user.model.ts`**
```ts
interface User {
  id: string;
  email: string;
  contactName: string;
  phone: string;
  password: string;
}
```

**`business.model.ts`**
```ts
interface BusinessHours {
  open: string;
  close: string;
}

interface Business {
  id: string;
  userId: string;
  businessName: string;
  categoryCode: number;
  category: string;
  website: string;
  publicPhone: string;
  products: string;
  logoUrl: string;
  address: {
    fullAddress: string;
    street: string;
    exteriorNumber: string;
    colony: string;
    postalCode: string;
    city: string;
    state: string;
    lat: number;
    lng: number;
  };
  hours: {
    allDay: boolean;
    weekdays: BusinessHours | null;
    saturday: BusinessHours | null;
    sunday: BusinessHours | null;
  };
}
```

**`metrics.model.ts`**
```ts
interface DailyMetric {
  date: string;
  clicks: number;
  impressions: number;
}

interface Metrics {
  businessId: string;
  last30Days: DailyMetric[];
}
```

### 4.2 Servicios mock

**`AuthMockService`**
- `currentUser: Signal<User | null>`
- `login(email, password): Observable<boolean>` — verifica contra sessionStorage
- `setPassword(email, password): Observable<void>` — crea usuario, guarda en sessionStorage
- `logout(): void` — limpia sesión

**`BusinessMockService`**
- `business: Signal<Business>` — inicializado desde `mock-data.json`
- `getBusiness(): Observable<Business>`
- `updateBusiness(data: Partial<Business>): Observable<Business>` — persiste en sessionStorage
- `uploadLogo(file: File): Observable<string>` — convierte a base64, retorna data URL

**`MetricsMockService`**
- `getMetrics(): Observable<Metrics>` — genera 30 puntos con seed fijo para resultados consistentes

### 4.3 mock-data.json

Contiene un negocio de ejemplo pre-cargado con datos realistas (nombre, dirección en CDMX, horarios, coordenadas) para que el dashboard siempre muestre algo al abrir.

---

## 5. Páginas

### 5.1 `/crear-contrasena`

- Lee `?email=` del query param. Si está vacío, redirige a `/login`
- Muestra el email como campo de solo lectura
- Formulario reactivo: `password` + `confirmPassword`
- Validaciones: mínimo 8 caracteres, al menos 1 número, al menos 1 mayúscula, los dos campos deben coincidir
- `PasswordStrengthComponent`: barra visual que refleja la fortaleza en tiempo real
- Al submit válido: llama `AuthMockService.setPassword()` → redirige a `/dashboard/metricas`

### 5.2 `/login`

- Formulario reactivo: `email` (validación de formato) + `password` (requerido)
- Errores inline, sin alerts nativos del navegador
- Al submit válido: llama `AuthMockService.login()` → redirige a `/dashboard/metricas`
- Link "¿Aún no tienes cuenta?" apunta a `https://www.seccionamarilla.com.mx/registra-tu-empresa`

### 5.3 `/dashboard` — Layout

- **Header:** logo de Sección Amarilla + nombre del negocio + botón "Cerrar sesión"
- **Nav desktop:** sidebar izquierdo con 3 ítems (Métricas, Mi negocio, Seguridad)
- **Nav móvil:** barra de navegación inferior con íconos + etiquetas
- El contenido de cada subruta se renderiza en el `<router-outlet>` del layout

### 5.4 `/dashboard/metricas`

- 2 tarjetas KPI: total clics y total impresiones (suma de los 30 días)
- `LineChartComponent` con ng2-charts: dos series (Clics / Impresiones), eje X con fechas `DD/MM`, tooltip al hover, responsivo
- Datos provistos por `MetricsMockService`

### 5.5 `/dashboard/mi-negocio`

- `BusinessFormComponent`: formulario reactivo pre-cargado con datos del `BusinessMockService`
- Campos idénticos al formulario de registro original:
  - Nombre completo del contacto, correo, teléfono de contacto
  - Nombre comercial
  - Dirección (via `MapPickerComponent`)
  - Giro del negocio, sitio web, teléfono de publicación
  - Logo (drag-and-drop o click, base64 en mock)
  - Productos/servicios (hasta 25 palabras)
  - Horarios (checkbox 24hrs o rangos por día)
- `MapPickerComponent`: mapa de Google Maps con marcador arrastrable. Al mover el marcador o buscar nueva dirección, los campos de calle/colonia/CP/ciudad/estado/lat/lng se actualizan vía Geocoding API. Recibe y emite coordenadas y datos de dirección como `@Input`/`@Output`
- Botón "Guardar cambios" → `BusinessMockService.updateBusiness()` → persiste en sessionStorage
- Botón "Cancelar" → revierte al último estado guardado (re-carga desde sessionStorage)

### 5.6 `/dashboard/seguridad`

- Formulario reactivo: `currentPassword`, `newPassword`, `confirmNewPassword`
- Validaciones: `currentPassword` debe coincidir con el guardado en sessionStorage; `newPassword` mismas reglas que en crear contraseña; `confirmNewPassword` debe coincidir con `newPassword`
- Al submit válido: `AuthMockService` actualiza el password en sessionStorage + mensaje de éxito inline

---

## 6. Estilos

### 6.1 Paleta de colores

| Token SCSS | Valor | Uso |
|---|---|---|
| `$color-primary` | `#FFD800` | Botones principales, acentos |
| `$color-primary-dark` | `#E5C200` | Hover de botones |
| `$color-bg` | `#F4F4F4` | Fondo general |
| `$color-white` | `#FFFFFF` | Cards, inputs |
| `$color-text` | `#333333` | Texto principal |
| `$color-text-light` | `#666666` | Labels, secundario |
| `$color-border` | `#CCCCCC` | Bordes de inputs |
| `$color-error` | `#D32F2F` | Mensajes de error |
| `$color-success` | `#388E3C` | Mensajes de éxito |

### 6.2 Tipografía

Fuente: **Roboto** cargada desde Google Fonts en `index.html`. Pesos: 400, 600, 700.

### 6.3 Metodología BEM

Cada componente tiene su `.scss` propio con nomenclatura BEM:
```scss
.business-form { }
.business-form__field { }
.business-form__field--error { }
.business-form__btn--primary { }
```

### 6.4 Breakpoints (mobile-first)

```scss
$bp-md: 768px;
$bp-lg: 1024px;
```

Diseño base en móvil 9:16. El grid de formularios pasa de 1 columna (móvil) a 3 columnas (≥768px), igual que el sitio original.

### 6.5 Animaciones

Transiciones de ruta con `@angular/animations`: fade-in de 200ms. Sin librerías adicionales de animación.

---

## 7. Dependencias externas

| Paquete | Propósito |
|---|---|
| `@angular/google-maps` | Mapa interactivo en Mi negocio |
| `ng2-charts` + `chart.js` | Gráfica de línea en Métricas |

La API key de Google Maps se configura en `environment.ts` y `environment.prod.ts`.

---

## 8. Lo que está fuera de alcance

- El formulario de registro en `/registra-tu-empresa` (ya existe, no se modifica)
- Backend real (todo es mock)
- Autenticación real (JWT, OAuth, etc.)
- Subida real de imágenes a un servidor
- Notificaciones por email
