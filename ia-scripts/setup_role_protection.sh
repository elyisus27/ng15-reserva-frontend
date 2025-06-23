#!/bin/bash

# --- Configuración ---
PROJECT_ROOT=$(pwd) # Asume que el script se ejecuta desde la raíz del proyecto Angular
APP_DIR="$PROJECT_ROOT/src/app"
VIEWS_PORTAL_DIR="$APP_DIR/views/pages/portal"
DEFAULT_LAYOUT_DIR="$APP_DIR/containers/default-layout"

PORTAL_ROUTING_FILE="$VIEWS_PORTAL_DIR/portal.routing.ts"
NAV_FILE="$DEFAULT_LAYOUT_DIR/_nav.ts"
DEFAULT_LAYOUT_COMPONENT_FILE="$DEFAULT_LAYOUT_DIR/default-layout.component.ts"
DEFAULT_LAYOUT_HTML_FILE="$DEFAULT_LAYOUT_DIR/default-layout.component.html"

# Define los roles exactos que vienen de tu backend
ROLE_ADMIN="ADMIN-PROFILE"
ROLE_MODERATOR="GUARD-PROFILE" # Usamos GUARD-PROFILE según tu log para moderadores
ROLE_USER="USER-PROFILE"

echo "Iniciando script de configuración de protección por roles en: $PROJECT_ROOT"
echo "-------------------------------------------------------------------"

# --- 1. Modificar portal.routing.ts para aplicar AuthGuard con roles ---
echo "Modificando $PORTAL_ROUTING_FILE para aplicar protección por roles..."

# Crear un archivo temporal con el nuevo contenido
cat > "$PORTAL_ROUTING_FILE.new" << EOF
// src/app/views/pages/portal/portal.routing.ts

import { Routes } from '@angular/router';
import { HousesListComponent } from './houses-list/houses-list.component';
import { CfeListComponent } from './cfe-list/cfe-list.component';
import { TestComponent } from '../../../../app/avanza/components/test/test.component';

import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardUserComponent } from './board-user/board-user.component';

// Importa AuthGuard
import { AuthGuard } from '../../../../app/_guards/auth.guard'; // Ajusta la ruta si es necesario

export const ROUTES: Routes = [
  {
    path: '', // Ruta base del módulo de portal (ej. cuando se entra a '/dashboard')
    children: [
      {
        path: 'user-board',
        component: BoardUserComponent,
        canActivate: [AuthGuard],
        data: { roles: ['$ROLE_USER', '$ROLE_MODERATOR', '$ROLE_ADMIN'] } // Todos los autenticados
      },
      {
        path: 'moderator-board',
        component: BoardModeratorComponent,
        canActivate: [AuthGuard],
        data: { roles: ['$ROLE_MODERATOR', '$ROLE_ADMIN'] }, // Moderadores y Administradores
        children: [
          {
            path: 'houseslist', // Ruta completa: /dashboard/moderator-board/houseslist
            component: HousesListComponent,
            // Esta ruta hereda la protección de su padre 'moderator-board'.
            // Si necesitaras una protección más estricta o diferente, la añadirías aquí.
          },
          // Otras rutas específicas para moderadores
        ]
      },
      {
        path: 'admin-board',
        component: BoardAdminComponent,
        canActivate: [AuthGuard],
        data: { roles: ['$ROLE_ADMIN'] }, // ¡Solo administradores!
        children: [
          {
            path: 'cfe-list', // Ruta completa: /dashboard/admin-board/cfe-list
            component: CfeListComponent,
            // Esta ruta hereda la protección de su padre 'admin-board'.
          },
          // Otras rutas específicas para administradores
        ]
      },
      // Ruta por defecto si se accede a '/dashboard' sin sub-ruta
      {
        path: '',
        redirectTo: 'user-board', // Redirige al board de usuario por defecto
        pathMatch: 'full'
      },
      {
        path: 'smartdt',
        component: TestComponent,
        canActivate: [AuthGuard],
        data: { roles: ['$ROLE_USER', '$ROLE_MODERATOR', '$ROLE_ADMIN'] } // Accesible por todos los autenticados
      },
    ]
  }
];
EOF

# Reemplazar los marcadores de posición de rol con las variables reales
sed -i "s/\$ROLE_USER/$ROLE_USER/g" "$PORTAL_ROUTING_FILE.new"
sed -i "s/\$ROLE_MODERATOR/$ROLE_MODERATOR/g" "$PORTAL_ROUTING_FILE.new"
sed -i "s/\$ROLE_ADMIN/$ROLE_ADMIN/g" "$PORTAL_ROUTING_FILE.new"

# Reemplazar el archivo original
mv "$PORTAL_ROUTING_FILE.new" "$PORTAL_ROUTING_FILE"
echo "  - $PORTAL_ROUTING_FILE actualizado con protección por roles."
echo "---"

# --- 2. Preparar default-layout/_nav.ts para navegación dinámica ---
echo "Generando plantilla para $NAV_FILE con propiedades de rol..."
# Nota: Esto es una plantilla. DEBES revisar y ajustar tu archivo _nav.ts
# para integrar las propiedades 'requiredRoles' en tus ítems existentes.
cat > "$NAV_FILE.template" << EOF
// src/app/containers/default-layout/_nav.ts

import { INavData } from '@coreui/angular'; // Asumiendo que usas CoreUI

export const navItems: INavData[] = [
  {
    name: 'Dashboard (Usuario)',
    url: '/dashboard/user-board',
    iconComponent: { name: 'cil-speedometer' },
    requiredRoles: ['$ROLE_USER', '$ROLE_MODERATOR', '$ROLE_ADMIN'] // Visible para todos
  },
  {
    title: true,
    name: 'Gestión por Rol',
  },
  {
    name: 'Panel de Moderador',
    url: '/dashboard/moderator-board',
    iconComponent: { name: 'cil-shield-alt' },
    requiredRoles: ['$ROLE_MODERATOR', '$ROLE_ADMIN'] // Solo moderadores y administradores
  },
  {
    name: 'Listado de Casas',
    url: '/dashboard/moderator-board/houseslist',
    iconComponent: { name: 'cil-home' },
    requiredRoles: ['$ROLE_MODERATOR', '$ROLE_ADMIN'] // Visible para moderadores y admins
  },
  {
    name: 'Panel de Administrador',
    url: '/dashboard/admin-board',
    iconComponent: { name: 'cil-settings' },
    requiredRoles: ['$ROLE_ADMIN'] // Solo administradores
  },
  {
    name: 'Contratos CFE',
    url: '/dashboard/admin-board/cfe-list',
    iconComponent: { name: 'cil-calculator' },
    requiredRoles: ['$ROLE_ADMIN'] // Visible solo para admins
  },
  {
    name: 'Smart Datatable Demo',
    url: '/dashboard/smartdt',
    iconComponent: { name: 'cil-grid' },
    requiredRoles: ['$ROLE_USER', '$ROLE_MODERATOR', '$ROLE_ADMIN']
  },
  {
    name: 'Mi Perfil',
    url: '/profile',
    iconComponent: { name: 'cil-user' },
    requiredRoles: ['$ROLE_USER', '$ROLE_MODERATOR', '$ROLE_ADMIN']
  },
  // ... Añade más ítems de navegación aquí con sus respectivos 'requiredRoles'
];
EOF

sed -i "s/\$ROLE_USER/$ROLE_USER/g" "$NAV_FILE.template"
sed -i "s/\$ROLE_MODERATOR/$ROLE_MODERATOR/g" "$NAV_FILE.template"
sed -i "s/\$ROLE_ADMIN/$ROLE_ADMIN/g" "$NAV_FILE.template"

echo "  - Se ha creado un archivo de plantilla '$NAV_FILE.template'. Por favor, compara y fusiona manualmente estos cambios en tu '$NAV_FILE' existente."
echo "---"

# --- 3. Modificar default-layout.component.ts para la lógica de visibilidad ---
echo "Modificando $DEFAULT_LAYOUT_COMPONENT_FILE para la lógica de visibilidad del menú..."

# Contenido para default-layout.component.ts
# Importa StorageService, define userRoles y el método hasRequiredRoles
cat > "$DEFAULT_LAYOUT_COMPONENT_FILE.new" << EOF
// src/app/containers/default-layout/default-layout.component.ts

import { Component, OnInit } from '@angular/core';
import { navItems } from './_nav';
import { StorageService } from '../../_services/storage.service'; // Ajusta la ruta si es necesario

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {

  public navItems = navItems;
  public userRoles: string[] = [];

  constructor(private storageService: StorageService) { }

  ngOnInit(): void {
    this.userRoles = this.storageService.getUserRoles();
    // Puedes suscribirte a eventos de login/logout si el menú no se actualiza al instante
    // this.eventBusService.on('loginSuccess', () => this.userRoles = this.storageService.getUserRoles());
    // this.eventBusService.on('logout', () => this.userRoles = []);
  }

  // Método para verificar si el usuario tiene los roles necesarios para mostrar un ítem de menú
  hasRequiredRoles(item: any): boolean {
    // Si el ítem no tiene 'requiredRoles' o es un array vacío, es visible para todos autenticados.
    if (!item.requiredRoles || item.requiredRoles.length === 0) {
      return true;
    }
    // Comprueba si el usuario tiene AL MENOS UNO de los roles requeridos.
    return item.requiredRoles.some((role: string) => this.userRoles.includes(role));
  }
}
EOF

# Reemplazar el archivo original
mv "$DEFAULT_LAYOUT_COMPONENT_FILE.new" "$DEFAULT_LAYOUT_COMPONENT_FILE"
echo "  - $DEFAULT_LAYOUT_COMPONENT_FILE actualizado con lógica de roles."
echo "---"

# --- 4. Modificar default-layout.component.html para renderizado condicional ---
echo "Modificando $DEFAULT_LAYOUT_HTML_FILE para renderizado condicional del menú..."

# Buscar la sección <c-sidebar-nav> y añadir el *ngIf
# NOTA: Este 'sed' puede ser delicado. Si tu HTML es muy diferente, hazlo manualmente.
# Busca la línea que contiene "<c-nav-item *ngFor="let item of navItems">"
# y envuélvela en un <ng-container *ngIf="hasRequiredRoles(item)">...</ng-container>

# Ejemplo de cómo se haría (puede que necesites ajustarlo a tu HTML exacto)
# sed -i '/<c-nav-item \*ngFor="let item of navItems">/ {
#     s/.*/<ng-container \*ngIf="hasRequiredRoles(item)">\n&/;
#     N;
#     s/\n\(.*\)/\1\n<\/ng-container>/;
# }' "$DEFAULT_LAYOUT_HTML_FILE"

# Debido a la complejidad de 'sed' para HTML con anidamientos, te daré la instrucción manual.
echo "  - Por favor, revisa manualmente tu '$DEFAULT_LAYOUT_HTML_FILE'."
echo "    Debes envolver cada 'c-nav-item' con un '<ng-container *ngIf=\"hasRequiredRoles(item)\">' como se explica en el README."
echo "---"

# --- 5. Crear el componente de Access Denied si no existe ---
ACCESS_DENIED_DIR="$APP_DIR/views/pages/access-denied"
ACCESS_DENIED_COMPONENT_TS="$ACCESS_DENIED_DIR/access-denied.component.ts"
ACCESS_DENIED_HTML="$ACCESS_DENIED_DIR/access-denied.component.html"
APP_ROUTING_FILE="$APP_DIR/app-routing.module.ts"

echo "Verificando y creando componente de Acceso Denegado..."
if [ ! -d "$ACCESS_DENIED_DIR" ]; then
    mkdir -p "$ACCESS_DENIED_DIR"
    echo "  - Carpeta $ACCESS_DENIED_DIR creada."

    cat > "$ACCESS_DENIED_COMPONENT_TS" << EOF
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.scss']
})
export class AccessDeniedComponent implements OnInit {
  constructor() { }
  ngOnInit(): void { }
}
EOF
    cat > "$ACCESS_DENIED_HTML" << EOF
<div style="text-align: center; margin-top: 50px; padding: 20px; background-color: #f8d7da; border: 1px solid #dc3545; border-radius: 5px; color: #721c24;">
  <h1 style="color: #dc3545;">¡Acceso Denegado!</h1>
  <p style="font-size: 1.1em;">No tienes los permisos necesarios para acceder a esta sección.</p>
  <button type="button" class="btn btn-primary mt-3" routerLink="/dashboard">Volver al Dashboard</button>
</div>
EOF
    touch "$ACCESS_DENIED_DIR/access-denied.component.scss"
    echo "  - Archivos base para access-denied creados."

    echo "  - Añadiendo ruta para AccessDeniedComponent en $APP_ROUTING_FILE..."
    # Buscar el último ']' antes de la última llave '}' para insertar la nueva ruta
    # Esto asume una estructura simple al final del array de rutas.
    # Es crucial que la ruta '**' sea la ÚLTIMA en el archivo app-routing.module.ts.
    sed -i "/{ path: '**', redirectTo: 'login', pathMatch: 'full' }/i \\
  { path: 'access-denied', component: AccessDeniedComponent }," "$APP_ROUTING_FILE"
    
    # Añadir el import si no está ya
    if ! grep -q "import { AccessDeniedComponent } from './views/pages/access-denied/access-denied.component';" "$APP_ROUTING_FILE"; then
        sed -i "1s/^/import { AccessDeniedComponent } from '.\/views\/pages\/access-denied\/access-denied.component';\n/" "$APP_ROUTING_FILE"
    fi
    echo "  - Ruta de acceso denegado y su importación añadidas a $APP_ROUTING_FILE."

else
    echo "  - Carpeta $ACCESS_DENIED_DIR ya existe. Omitiendo creación."
fi
echo "---"

echo "Script de configuración de roles completado. ¡Pasos manuales restantes:"
echo "1. Revisa '$NAV_FILE.template' y fusiona su contenido con tu '$NAV_FILE' real."
echo "2. Modifica '$DEFAULT_LAYOUT_HTML_FILE' para envolver los ítems del menú con *ngIf."
echo "3. Ejecuta 'ng serve' y prueba tus roles (ADMIN-PROFILE, GUARD-PROFILE, USER-PROFILE)."
echo "   Si los nombres de los roles en tu backend son diferentes, ajusta las variables ROLE_ADMIN, ROLE_MODERATOR, ROLE_USER en este script y en tus archivos."
echo "-------------------------------------------------------------------"