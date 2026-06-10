# Contexto para Superpower: Desarrollo de Módulo de Autogestión de Negocios (Sección Amarilla)

## 1. Descripción del Proyecto
Desarrollo de un módulo frontend para [seccionamarilla.com.mx](https://www.seccionamarilla.com.mx/) que permita a usuarios gratuitos gestionar su empresa. 
* **NOTA CRÍTICA:** Se trabajará exclusivamente en el **Frontend**. No existe backend por el momento; toda la capa de datos debe ser implementada mediante **Mocks** (datos simulados).

## 2. Estrategia de Mocking (Frontend-Only)
* **Servicios:** Crear servicios de Angular que implementen la interfaz de consumo de datos usando `of()` de RxJS para simular latencia de red y respuestas asíncronas.
* **Modelos:** Definir interfaces estrictas para asegurar que, cuando el backend real esté disponible, solo sea necesario cambiar el endpoint del servicio.
* **Estado:** Gestionar los mocks mediante un estado local o `BehaviorSubject` para permitir ediciones persistentes dentro de la sesión de navegación actual.

## 3. Stack Tecnológico
* **Framework:** Angular (Última versión LTS).
* **Gestión de Estado:** NgRx o Signals (arquitectura escalable).
* **Estilos:** SCSS (metodología BEM) para replicar la identidad visual del sitio.
* **Animaciones:** Angular Animations + librerías de bajo impacto (ej. Lottie-web).
* **Performance:** Implementación estricta de *Lazy Loading*.

## 4. Arquitectura del Panel
* **Módulo Auth:** Registro y Login (simulados con validación local).
* **Dashboard de Negocios:** * Métricas: Gráficos de visualizaciones (clics/impresiones). *Nota: Diseño móvil 9:16 obligatorio.*
    * CRUD: Formulario reactivo para edición de datos del negocio.
    * Seguridad: Actualización de contraseña (mock).

## 5. Requisitos de Diseño
* **Integración:** El diseño debe ser indistinguible del portal original (paleta de colores, tipografía, componentes).
* **Responsividad:** *Mobile-first* con enfoque en el formato vertical 9:16.

## 6. Instrucciones para Claude Code (Superpower)
Basado en que no tenemos backend:
1. Define la estructura de archivos y el uso de `mock-data.json` o servicios de Mocking.
2. Propón la estructura de interfaces (`Business`, `User`, `Metrics`) que actúen como "contrato" para el futuro backend.
3. Diseña la estrategia de estilos globales replicando el look & feel del sitio original.
4. Define el plan de *Lazy Loading* para separar módulos de Auth y Dashboard.