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
        data: { roles: ['USER-PROFILE', 'GUARD-PROFILE', 'ADMIN-PROFILE'] } // Todos los autenticados
      },
      {
        path: 'moderator-board',
        component: BoardModeratorComponent,
        canActivate: [AuthGuard],
        data: { roles: ['GUARD-PROFILE', 'ADMIN-PROFILE'] }, // Moderadores y Administradores
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
        data: { roles: ['ADMIN-PROFILE'] }, // ¡Solo administradores!
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
        data: { roles: ['USER-PROFILE', 'GUARD-PROFILE', 'ADMIN-PROFILE'] } // Accesible por todos los autenticados
      },
    ]
  }
];
