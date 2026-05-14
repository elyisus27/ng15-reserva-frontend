# README rapido del proyecto

Chuleta corta para recordar donde tocar cuando se agrega una pantalla, ruta o menu en este frontend Angular 15 + CoreUI.

## Mapa mental

```text
src/app
|-- app-routing.module.ts                  # rutas raiz: login + layout protegido
|-- app.module.ts                          # modulo principal
|-- _guards/auth.guard.ts                  # valida si hay token/sesion
|-- _helpers/http.interceptor.ts           # agrega token a requests
|-- _services/
|   |-- auth.service.ts                    # login/logout contra API
|   |-- storage.service.ts                 # lee token, usuario, perfiles
|   |-- cfe.service.ts / house.service.ts  # servicios de datos
|-- containers/default-layout/
|   |-- _nav.ts                           # MENU LATERAL IZQUIERDO
|   |-- default-layout.component.*         # shell: sidebar + header + router-outlet
|   |-- default-header/                    # header, logout
|   |-- default-footer/
|-- views/pages/
|   |-- portal/
|   |   |-- portal.module.ts               # declara/importa vistas del portal
|   |   |-- portal.routing.ts              # rutas hijas bajo /mod
|   |   |-- cfe-list/                      # vista /mod/cfe-list
|   |   |-- board-admin/
|   |   |-- board-moderator/
|   |   |-- board-user/
|   |-- cfe/
|       |-- cfe.module.ts                  # submodulo CFE
|       |-- cfe.routing.ts                 # rutas hijas bajo /mod/cfe
|       |-- cfe-dashboard.component.*      # /mod/cfe
|       |-- mapa/                          # /mod/cfe/mapa
|       |-- comparativa/                   # /mod/cfe/comparativa
|       |-- historicos/                    # /mod/cfe/historicos
|-- avanza/components/
    |-- smart-datatable/                   # componentes reutilizables
    |-- avdatatable/
    |-- test/
```

## Flujo de rutas

```text
/login
  -> LoginComponent

/
  -> redirect a /login

/mod
  -> DefaultLayoutComponent protegido por AuthGuard
  -> carga lazy PortalModule
  -> redirect a /mod/cfe-list

/mod/cfe-list
  -> CfeListComponent

/mod/cfe
  -> carga lazy CfeModule
  -> CfeDashboardComponent

/mod/cfe/mapa
/mod/cfe/comparativa
/mod/cfe/historicos
  -> pantallas CFE hijas
```

Archivos clave:

- `src/app/app-routing.module.ts`: monta `/login`, el `DefaultLayoutComponent` y el lazy load de `/mod`.
- `src/app/views/pages/portal/portal.routing.ts`: rutas internas del portal bajo `/mod`.
- `src/app/views/pages/cfe/cfe.routing.ts`: rutas internas del modulo CFE bajo `/mod/cfe`.

## Agregar una pantalla al menu lateral

Caso comun: quiero una pantalla nueva visible en el sidebar.

1. Generar el componente.

```bash
ng generate component views/pages/portal/mi-pantalla
```

Si pertenece al modulo CFE:

```bash
ng generate component views/pages/cfe/mi-pantalla
```

2. Declarar/importar en el modulo correcto.

- Para vistas directas de `/mod`: revisar `src/app/views/pages/portal/portal.module.ts`.
- Para vistas bajo `/mod/cfe`: revisar `src/app/views/pages/cfe/cfe.module.ts`.

Normalmente Angular CLI agrega la declaracion solo si detecta bien el modulo; si no, agregar el componente en `declarations`.

3. Agregar la ruta.

Para una ruta directa tipo `/mod/mi-pantalla`, editar:

```ts
// src/app/views/pages/portal/portal.routing.ts
{
  path: 'mi-pantalla',
  component: MiPantallaComponent
}
```

Para una ruta tipo `/mod/cfe/mi-pantalla`, editar:

```ts
// src/app/views/pages/cfe/cfe.routing.ts
{
  path: 'mi-pantalla',
  component: MiPantallaComponent
}
```

4. Agregar el item al sidebar.

Editar:

```text
src/app/containers/default-layout/_nav.ts
```

Ejemplo:

```ts
{
  name: 'Mi Pantalla',
  url: '/mod/mi-pantalla',
  iconComponent: { name: 'cil-list-rich' }
}
```

Si el icono no aparece, revisar que exista/importe en:

```text
src/app/icons/icon-subset.ts
```

## Menu lateral

El sidebar se pinta asi:

```text
default-layout.component.ts
  -> importa navItems desde ./_nav

default-layout.component.html
  -> <c-sidebar-nav [navItems]="navItems">

_nav.ts
  -> lista real de opciones visibles
```

Hoy el menu activo contiene:

- `/mod/cfe-list`: Contratos CFE.
- `/mod/cfe`: CFE Dashboard.
- `/mod/cfe/mapa`: CFE Mapa.
- `/mod/cfe/comparativa`: CFE Comparativa.
- `/mod/cfe/historicos`: CFE Historicos.

## Login, token y perfiles

Archivos:

- `src/app/login/login.component.ts`: hace login, guarda token y recarga pagina.
- `src/app/_services/auth.service.ts`: llama a `/auth/login` y `/auth/logout`.
- `src/app/_services/storage.service.ts`: lee el JWT guardado en `localStorage` con llave `Token`.
- `src/app/_guards/auth.guard.ts`: solo verifica si hay token; si no hay, manda a `/`.

El token se decodifica en `StorageService`:

```ts
getUser()       -> payload.username
getEmail()      -> payload.email
getUserRoles()  -> payload.profiles
```

Roles/perfiles que aparecen en el codigo:

```text
ADMIN-PROFILE
GUARD-PROFILE
```

## Importante sobre roles y pagina default

Estado actual del codigo:

- `AppComponent` lee roles y calcula `showAdminBoard` / `showModeratorBoard`.
- `AuthGuard` actualmente NO valida roles por ruta; solo valida que exista token.
- `_nav.ts` actualmente NO filtra items por rol; todos los items definidos ahi se muestran.
- Al entrar ya logueado, `LoginComponent.ngOnInit()` navega a `mod/cfe-list`.
- Despues de login exitoso se guarda el token y se hace `window.location.reload()`. La ruta base termina redirigiendo a `/mod/cfe-list`.

O sea: aunque existen componentes `board-admin`, `board-moderator` y `board-user`, la navegacion default por perfil no esta activa en el flujo actual. La pagina default practica es:

```text
/mod/cfe-list
```

Hay scripts en `ia-scripts/` que parecen documentar o preparar proteccion por roles:

- `ia-scripts/setup_role_protection.sh`
- `ia-scripts/setup_roles.sh`

Pero lo que manda hoy es el codigo real en `src/app`.

## Donde poner cada cosa

```text
Pantalla de negocio del portal:
  src/app/views/pages/portal/nombre/

Pantalla hija de CFE:
  src/app/views/pages/cfe/nombre/

Componente reutilizable:
  src/app/avanza/components/nombre/

Servicio para API:
  src/app/_services/nombre.service.ts

Guard:
  src/app/_guards/nombre.guard.ts

Helper/interceptor:
  src/app/_helpers/

Layout/sidebar/header:
  src/app/containers/default-layout/
```

## Checklist rapido para nueva vista

```text
[ ] Crear componente.
[ ] Confirmar que quedo declarado en el modulo correcto.
[ ] Agregar ruta en portal.routing.ts o cfe.routing.ts.
[ ] Agregar item en _nav.ts si debe salir en sidebar.
[ ] Si usa icono nuevo, agregarlo en icon-subset.ts.
[ ] Si consume API, crear/usar service en _services.
[ ] Probar URL directa en navegador.
```

## Comandos utiles

```bash
npm start
npm run build
npm test
```

Generar componente:

```bash
ng generate component views/pages/portal/mi-pantalla
ng generate component views/pages/cfe/mi-pantalla
ng generate component avanza/components/mi-componente
```

Generar servicio:

```bash
ng generate service _services/mi-servicio
```

