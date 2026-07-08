# Mis tareas

Aplicación de gestión de tareas multiplataforma construida con **Ionic** y **Angular**. Funciona en navegador y como app nativa (Android/iOS) mediante **Cordova**, con persistencia local y sincronización opcional en la nube vía **Firebase Firestore**.

## Arquetipo

El proyecto se generó a partir del starter **Blank** de Ionic (`ionic.starter.json`):

| Propiedad | Valor |
|-----------|-------|
| Nombre del starter | `Blank Starter` |
| Tipo de integración | `angular-standalone` |
| App ID (Cordova) | `com.todo.app` |
| Nombre de la app | Mis tareas |

Es el arquetipo mínimo de Ionic: una app Angular standalone con routing, sin tabs ni menú lateral. Sobre esa base se implementó la funcionalidad de tareas y la arquitectura en capas descrita más abajo.

## Contenido del proyecto

### Stack tecnológico

- **Angular 20** (componentes standalone)
- **Ionic 8**
- **TypeScript 5.9**
- **Cordova 12** (Android / iOS)
- **Firebase 12** (Remote Config + Firestore)
- **Ionic Storage** (persistencia local)
- **pnpm** como gestor de paquetes
- **Node.js 20.20.2** (definido en Volta)

### Arquitectura

El código sigue una organización por capas inspirada en **Clean Architecture**:

```
src/app/
├── domain/          # Reglas de negocio puras
│   ├── models/      # Task, Category, filtros
│   ├── repositories/# Contrato TaskRepository (abstracto)
│   └── usecases/    # ManageTasksUseCase, FilterTasksUseCase
├── core/            # Infraestructura e integraciones
│   ├── task-storage.repository.ts   # Persistencia local + orquestación cloud
│   ├── task-cloud.repository.ts     # Firestore
│   ├── task-memory.repository.ts    # Implementación en memoria (tests)
│   ├── feature-flag.service.ts      # Feature flag de sync en la nube
│   ├── firebase/                    # Inicialización de Firebase
│   └── cordova/                       # Plugins nativos (status bar, teclado, splash)
├── presentation/    # UI y estado
│   ├── pages/home/                  # Pantalla principal
│   ├── components/                  # task-item, filter-bar, add-task-modal, toast
│   ├── state/task.store.ts          # Estado reactivo con signals
│   └── constants/
└── data/            # Datos de prueba para desarrollo
```

**Flujo de datos:** la UI (`HomePage`) consume `TaskStore` → casos de uso del dominio → `TaskRepository` (inyectado como `TaskStorageRepository` en `main.ts`).

### Funcionalidades

- Crear, completar, eliminar y categorizar tareas
- Filtrar por estado (todas / pendientes / completadas) o por categoría (Personal, Trabajo, Compras)
- Persistencia local con Ionic Storage
- Sincronización opcional con Firestore, controlada por feature flag (`enable_cloud_sync` en Firebase Remote Config)
- Soporte nativo Cordova: status bar, splash screen, teclado

## Requisitos previos

- [Node.js 20](https://nodejs.org/) (recomendado 20.20.2, ver `volta` en `package.json`)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- [Ionic CLI](https://ionicframework.com/docs/cli) (`npm install -g @ionic/cli`)
- Para builds móviles:
  - **Android:** Android Studio + SDK
  - **iOS:** Xcode (solo macOS)

## Instalación

```bash
git clone <url-del-repositorio>
cd todo-app
pnpm install
```

## Levantar el proyecto

### Desarrollo web

```bash
pnpm start
# equivalente a: ionic serve
```

La app quedará disponible en `http://localhost:8100` (puerto por defecto de Ionic).

En modo desarrollo se cargan tareas de ejemplo desde `src/app/data/test-tasks.data.ts`. En producción la lista arranca vacía.

### Build de producción (web)

```bash
pnpm build
# salida en www/
```

### Tests y lint

```bash
pnpm test
pnpm lint
```

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `pnpm start` | Servidor de desarrollo (`ionic serve`) |
| `pnpm build` | Build web |
| `pnpm build:mobile` | Build con configuración de producción |
| `pnpm watch` | Build en modo watch (desarrollo) |
| `pnpm test` | Tests unitarios (Karma + Jasmine) |
| `pnpm lint` | ESLint |
| `pnpm cordova:prepare` | Build + `cordova prepare` |
| `pnpm cordova:android` | Build y ejecución en Android |
| `pnpm cordova:ios` | Build y ejecución en iOS |

## Ejecución en dispositivo móvil

```bash
# Preparar plataforma (primera vez)
ionic cordova platform add android
# o: ionic cordova platform add ios

# Compilar y ejecutar
pnpm cordova:android
pnpm cordova:ios
```

Los recursos nativos (iconos y splash) están en `resources/`. Para regenerarlos:

```bash
ionic cordova resources
```

## Configuración de Firebase

Las credenciales de Firebase están en:

- `src/environments/environment.ts` (desarrollo)
- `src/environments/environment.prod.ts` (producción)

Proyecto configurado: `todo-ionic-angular`.

**Remote Config:** clave `enable_cloud_sync` (boolean). Si no hay valor guardado localmente, la app consulta Remote Config al iniciar.

**Firestore:** colección `tasks` para la sincronización en la nube.

> Si usas tu propio proyecto Firebase, reemplaza los valores en ambos archivos de entorno y configura Remote Config y Firestore en la consola de Firebase.

## Estructura de archivos relevante

```
todo-app/
├── src/
│   ├── app/                 # Código de la aplicación
│   ├── environments/        # Configuración por entorno
│   ├── theme/               # Variables SCSS de Ionic
│   └── global.scss
├── resources/               # Iconos y splash Cordova
├── config.xml               # Configuración Cordova
├── angular.json             # Configuración Angular CLI
├── ionic.config.json        # Configuración Ionic
└── package.json
```

## Licencia

Proyecto privado.
