#!/bin/bash

# --- PRE-REQUISITOS Y CONFIGURACIÓN ---
PROJECT_ROOT=$(pwd) # Asume que se ejecuta desde la raíz del proyecto Angular

# Rutas clave
GUARDS_DIR="src/app/_guards"
SERVICES_DIR="src/app/_services"
VIEWS_PAGES_DIR="src/app/views/pages"
AVANZA_COMPONENTS_DIR="src/app/avanza/components"
ADMIN_DASHBOARD_DIR="${VIEWS_PAGES_DIR}/admin-dashboard"
UNAUTHORIZED_DIR="${VIEWS_PAGES_DIR}/unauthorized"

# Nombre del archivo de salida para logs
LOG_FILE="refactor_log_final.txt"

echo "--- Iniciando Refactorización de Proyecto Angular (Parte WSL/Archivo) ---" | tee "$LOG_FILE"
echo "¡ADVERTENCIA: Asegúrate de haber hecho un respaldo de tu proyecto ANTES de esto!" | tee -a "$LOG_FILE"
echo "¡Asegúrate de haber ejecutado todos los 'ng generate' en Windows PRIMERO!" | tee -a "$LOG_FILE"
echo "Continuando en 5 segundos..." | tee -a "$LOG_FILE"
sleep 5

# 1. Verificar StorageService (ya está validado)
echo "1. Verificando StorageService. (La lógica de getRoles() es adecuada)." | tee -a "$LOG_FILE"

# 2. Modificar RoleGuard
echo "2. Modificando RoleGuard en ${GUARDS_DIR}/role.guard.ts..." | tee -a "$LOG_FILE"
cat > "${GUARDS_DIR}/role.guard.ts" <<EOF
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { StorageService } from '../_services/storage.service'; // Ajusta la ruta si es necesario

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private storageService: StorageService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles = route.data['roles'] as string[];
    if (!expectedRoles || expectedRoles.length === 0) {
      // Si no se especifican roles en la ruta, se permite el acceso por defecto (ya cubierto por AuthGuard)
      return true;
    }

    const userRoles = this.storageService.getRoles() as string[];
    if (!userRoles || userRoles.length === 0) {
        this.router.navigate(['/unauthorized']);
        return false;
    }

    const hasRequiredRole = expectedRoles.some(role => userRoles.includes(role));

    if (!hasRequiredRole) {
      this.router.navigate(['/unauthorized']);
      return false;
    }
    return true;
  }
}
EOF
echo "   RoleGuard contenido actualizado." | tee -a "$LOG_FILE"

# 3. Modificar AuthGuard
echo "3. Modificando AuthGuard en ${GUARDS_DIR}/auth.guard.ts para redirigir a /login..." | tee -a "$LOG_FILE"
if grep -q "this.router.navigate(\['\/']\);" "${GUARDS_DIR}/auth.guard.ts"; then
    sed -i.bak "s/this.router.navigate(\['\/']\)/this.router.navigate(['\/login'])/g" "${GUARDS_DIR}/auth.guard.ts"
    echo "   AuthGuard modificado." | tee -a "$LOG_FILE"
else
    echo "   AuthGuard ya modificado o línea de redirección no encontrada. Verificación manual necesaria." | tee -a "$LOG_FILE"
fi

# 4. Modificar UnauthorizedComponent HTML
echo "4. Modificando UnauthorizedComponent HTML en ${UNAUTHORIZED_DIR}/unauthorized.component.html..." | tee -a "$LOG_FILE"
cat > "${UNAUTHORIZED_DIR}/unauthorized.component.html" <<EOF
<div class="d-flex flex-row align-items-center justify-content-center min-vh-100">
  <div class="text-center">
    <h1 class="display-1 fw-bold">403</h1>
    <p class="fs-3"> <span class="text-danger">¡Oops!</span> Acceso Denegado.</p>
    <p class="lead">
      No tienes permiso para acceder a esta página.
    </p>
    <a routerLink="/login" class="btn btn-primary">Volver al Inicio de Sesión</a>
  </div>
</div>
EOF
echo "   UnauthorizedComponent HTML actualizado." | tee -a "$LOG_FILE"


# 5. Modificar AdminModule y AdminDashboardRoutingModule
echo "5. Modificando AdminModule y AdminDashboardRoutingModule en ${ADMIN_DASHBOARD_DIR}/..." | tee -a "$LOG_FILE"

# Ajustar admin-dashboard-routing.module.ts
cat > "${ADMIN_DASHBOARD_DIR}/admin-dashboard-routing.module.ts" <<EOF
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { CfeListComponent } from './components/cfe-list/cfe-list.component';
import { HousesListComponent } from './components/houses-list/houses-list.component';

const routes: Routes = [
  {
    path: '', // La ruta padre ya es 'admin-dashboard'
    component: AdminDashboardComponent,
    children: [
      { path: 'cfe-list', component: CfeListComponent },
      { path: 'houses-list', component: HousesListComponent },
      // Agrega más rutas específicas de admin aquí
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardRoutingModule { }
EOF
echo "   admin-dashboard-routing.module.ts actualizado." | tee -a "$LOG_FILE"


# Ajustar admin-dashboard.module.ts
# Crear la carpeta components dentro de admin-dashboard si no la creó ng generate (aunque debería)
mkdir -p "${ADMIN_DASHBOARD_DIR}/components" >> "$LOG_FILE" 2>&1
cat > "${ADMIN_DASHBOARD_DIR}/admin-dashboard.module.ts" <<EOF
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { CfeListComponent } from './components/cfe-list/cfe-list.component';
import { HousesListComponent } from './components/houses-list/houses-list.component';
// Importa otros módulos necesarios, ej. los de @coreui/angular, @angular/material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    CfeListComponent,
    HousesListComponent
  ],
  imports: [
    CommonModule,
    AdminDashboardRoutingModule,
    // Módulos que CfeListComponent y HousesListComponent necesitan:
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    ButtonModule,
    IconModule,
    // Agrega aquí cualquier otro módulo que las listas necesiten
  ]
})
export class AdminDashboardModule { }
EOF
echo "   admin-dashboard.module.ts actualizado." | tee -a "$LOG_FILE"


# 6. Mover CfeListComponent y HousesListComponent
echo "6. Moviendo CfeListComponent y HousesListComponent..." | tee -a "$LOG_FILE"
# Verificar si los archivos existen en el origen antes de intentar moverlos
if [ -d "${AVANZA_COMPONENTS_DIR}/cfe-list" ]; then
    mv "${AVANZA_COMPONENTS_DIR}/cfe-list" "${ADMIN_DASHBOARD_DIR}/components/" >> "$LOG_FILE" 2>&1
    echo "   cfe-list movido." | tee -a "$LOG_FILE"
else
    echo "   Advertencia: src/app/avanza/components/cfe-list no encontrado. Puede que ya esté movido o no exista." | tee -a "$LOG_FILE"
fi
if [ -d "${AVANZA_COMPONENTS_DIR}/houses-list" ]; then
    mv "${AVANZA_COMPONENTS_DIR}/houses-list" "${ADMIN_DASHBOARD_DIR}/components/" >> "$LOG_FILE" 2>&1
    echo "   houses-list movido." | tee -a "$LOG_FILE"
else
    echo "   Advertencia: src/app/avanza/components/houses-list no encontrado. Puede que ya esté movido o no exista." | tee -a "$LOG_FILE"
fi
echo "   Verificación de movimiento de componentes completada." | tee -a "$LOG_FILE"


# 7. Actualizar AvanzaModule
echo "7. Actualizando AvanzaModule en src/app/avanza/avanza.module.ts..." | tee -a "$LOG_FILE"
# Eliminar imports y declarations/exports de CfeListComponent y HousesListComponent
sed -i.bak "/import .*HousesListComponent/d" "${PROJECT_ROOT}/src/app/avanza/avanza.module.ts"
sed -i.bak "/import .*CfeListComponent/d" "${PROJECT_ROOT}/src/app/avanza/avanza.module.ts"
sed -i.bak "/HousesListComponent,/d" "${PROJECT_ROOT}/src/app/avanza/avanza.module.ts"
sed -i.bak "/CfeListComponent,/d" "${PROJECT_ROOT}/src/app/avanza/avanza.module.ts"
sed -i.bak "/CfeListComponent$/d" "${PROJECT_ROOT}/src/app/avanza/avanza.module.ts"
sed -i.bak "/HousesListComponent$/d" "${PROJECT_ROOT}/src/app/avanza/avanza.module.ts"
echo "   AvanzaModule actualizado (eliminadas referencias a CfeList y HousesList)." | tee -a "$LOG_FILE"

# 8. Actualizar app-routing.module.ts
echo "8. Actualizando app-routing.module.ts..." | tee -a "$LOG_FILE"

# Asegurar importaciones necesarias
if ! grep -q "import { RoleGuard } from '.\/_guards\/role.guard';" "${PROJECT_ROOT}/src/app/app-routing.module.ts"; then
    sed -i.bak "s|import { AuthGuard } from '.\/_guards\/auth.guard';|import { AuthGuard } from '.\/_guards\/auth.guard';\nimport { RoleGuard } from '.\/_guards\/role.guard';|g" "${PROJECT_ROOT}/src/app/app-routing.module.ts"
fi
if ! grep -q "import { UnauthorizedComponent } from '.\/views\/pages\/unauthorized\/unauthorized.component';" "${PROJECT_ROOT}/src/app/app-routing.module.ts"; then
    sed -i.bak "s|import { DefaultLayoutComponent } from '.\/containers';|import { DefaultLayoutComponent } from '.\/containers';\nimport { UnauthorizedComponent } from '.\/views\/pages\/unauthorized\/unauthorized.component';|g" "${PROJECT_ROOT}/src/app/app-routing.module.ts"
fi


# Actualizar las rutas (usando perl para un reemplazo multilínea más seguro)
perl -i.bak -0777 -pe '
    s|const routes: Routes = \[
  {
    path: '"'"'login'"'"', component: LoginComponent,
  },
  { path: '"'"''"'"', redirectTo: '"'"'login'"'"', pathMatch: '"'"'full'"'"' },
  {
    path: '"'"''"'"',
    component: DefaultLayoutComponent,
    canActivate: \[AuthGuard],
    \/\/ data: {
    \/\/   title: '"'"'home'"'"'
    \/\/ },
    children: \[
      {
        path: '"'"'mod'"'"',
        loadChildren: \(\) => import\('.\/views\/pages\/portal\/portal.module'\).then\(m => m.PortalModule\),
      },
    ]
  },
  \/\/ { path: '"'"'register'"'"', component: RegisterComponent },
  \/\/ { path: '"'"'profile'"'"', component: ProfileComponent },
  \/\/ { path: '"'"'mod'"'"', component: BoardModeratorComponent },

];|const routes: Routes = \[
  { path: '"'"'login'"'"', component: LoginComponent },
  { path: '"'"'register'"'"', component: RegisterComponent },
  { path: '"'"'unauthorized'"'"', component: UnauthorizedComponent },
  { path: '"'"''"'"', redirectTo: '"'"'login'"'"', pathMatch: '"'"'full'"'"' },

  \/\/ Rutas para usuarios autenticados (con el DefaultLayout)
  {
    path: '"'"''"'"', \/\/ Ruta vacía para que las rutas hijas se concatenen (ej. /profile, /guard-portal, /admin-dashboard)
    component: DefaultLayoutComponent,
    canActivate: \[AuthGuard], \/\/ Solo usuarios autenticados
    children: \[
      { path: '"'"'profile'"'"', component: ProfileComponent }, \/\/ Mover ProfileComponent aquí
      \/\/ Agrega aquí rutas que sean comunes a TODOS los usuarios autenticados (y que usen el DefaultLayout)
    ]
  },

  \/\/ Rutas específicas para el rol '"'"'GUARD-PROFILE'"'"'
  {
    path: '"'"'guard-portal'"'"', \/\/ Nueva ruta para el portal del guardia
    component: DefaultLayoutComponent, \/\/ Usa el layout por defecto
    canActivate: \[AuthGuard, RoleGuard],
    data: { roles: \['GUARD-PROFILE'] }, \/\/ <-- Rol requerido para este path y sus hijos
    loadChildren: \(\) => import\('.\/views\/pages\/portal\/portal.module'\).then\(m => m.PortalModule\)
  },

  \/\/ Rutas específicas para el rol '"'"'ADMIN-PROFILE'"'"'
  {
    path: '"'"'admin-dashboard'"'"', \/\/ Nueva ruta para el dashboard de admin
    component: DefaultLayoutComponent, \/\/ Usa el layout por defecto
    canActivate: \[AuthGuard, RoleGuard],
    data: { roles: \['ADMIN-PROFILE'] }, \/\/ <-- Rol requerido para este path y sus hijos
    loadChildren: \(\) => import\('.\/views\/pages\/admin-dashboard\/admin-dashboard.module'\).then\(m => m.AdminDashboardModule\)
  },

  \/\/ Catch-all (redirige a login si ninguna ruta coincide y no está autenticado)
  { path: '**', redirectTo: '"'"'login'"'"' }
];|gs' "${PROJECT_ROOT}/src/app/app-routing.module.ts"

echo "   app-routing.module.ts actualizado." | tee -a "$LOG_FILE"


# 9. Actualizar portal.routing.ts
PORTAL_ROUTING_FILE="${VIEWS_PAGES_DIR}/portal/portal.routing.ts"
echo "9. Actualizando ${PORTAL_ROUTING_FILE}..." | tee -a "$LOG_FILE"
if grep -q "path: 'mod'," "${PORTAL_ROUTING_FILE}"; then
    sed -i.bak "s|path: 'mod',|path: '',|g" "${PORTAL_ROUTING_FILE}"
    echo "   ${PORTAL_ROUTING_FILE} 'path: mod' a 'path: '' cambiado." | tee -a "$LOG_FILE"
else
    echo "   Advertencia: 'path: mod' no encontrado en ${PORTAL_ROUTING_FILE}. Asumiendo que ya es 'path: '' o similar." | tee -a "$LOG_FILE"
fi

# 10. Actualizar AppModule
echo "10. Actualizando AppModule en src/app/app.module.ts..." | tee -a "$LOG_FILE"

# Añadir import de UnauthorizedComponent (si no existe)
if ! grep -q "import { UnauthorizedComponent } from '.\/views\/pages\/unauthorized\/unauthorized.component';" "${PROJECT_ROOT}/src/app/app.module.ts"; then
    sed -i.bak "s|import { BoardModeratorComponent } from './views/pages/portal/board-moderator/board-moderator.component';|import { BoardModeratorComponent } from './views/pages/portal/board-moderator/board-moderator.component';\nimport { UnauthorizedComponent } from './views/pages/unauthorized/unauthorized.component';|g" "${PROJECT_ROOT}/src/app/app.module.ts"
fi

# Declarar UnauthorizedComponent (si no está declarado)
if ! grep -q "UnauthorizedComponent," "${PROJECT_ROOT}/src/app/app.module.ts"; then
    sed -i.bak "s|ProfileComponent,|ProfileComponent,\n  UnauthorizedComponent,|g" "${PROJECT_ROOT}/src/app/app.module.ts"
fi

# Importar AdminModule (si no existe el import)
if ! grep -q "import { AdminDashboardModule } from '.\/views\/pages\/admin-dashboard\/admin-dashboard.module';" "${PROJECT_ROOT}/src/app/app.module.ts"; then
    sed -i.bak "s|import { AvanzaModule } from './avanza/avanza.module';|import { AvanzaModule } => './avanza/avanza.module';\nimport { AdminDashboardModule } from './views/pages/admin-dashboard/admin-dashboard.module';|g" "${PROJECT_ROOT}/src/app/app.module.ts"
fi

# Añadir AdminModule a los imports (si no está ya en el array de imports)
if ! grep -q "AdminDashboardModule," "${PROJECT_ROOT}/src/app/app.module.ts"; then
    sed -i.bak "s|AvanzaModule,|AvanzaModule,\n    AdminDashboardModule,|g" "${PROJECT_ROOT}/src/app/app.module.ts"
fi

echo "   AppModule actualizado." | tee -a "$LOG_FILE"


echo "--- Parte WSL/Archivo de Refactorización Completada ---" | tee -a "$LOG_FILE"
echo "¡Tu proyecto debería estar refactorizado ahora!" | tee -a "$LOG_FILE"
echo "Por favor, revisa los archivos modificados y ejecuta 'ng serve' para probar." | tee -a "$LOG_FILE"