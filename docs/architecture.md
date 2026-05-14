# Arquitectura General

Proyecto Angular basado en CoreUI y Angular Material.

## Frontend

Frameworks:
- Angular
- CoreUI
- Angular Material

## Organización

- app/
  - _services
  - _guards
  - _shared
  - avanza/
  - views/pages

## Módulos principales

### PortalModule
Contenedor principal del portal autenticado.

### CfeModule
Módulo dedicado a analítica y visualización CFE.

Submódulos:
- comparativa
- historicos
- mapa

### AvanzaModule
Framework interno reutilizable.

Componentes:
- SmartDatatableComponent

## Routing

Ruta principal:
- /mod

Rutas CFE:
- /mod/cfe
- /mod/cfe/comparativa
- /mod/cfe/historicos
- /mod/cfe/mapa