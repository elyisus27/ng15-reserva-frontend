// src/app/app-routing.module.ts

import { AccessDeniedComponent } from './views/pages/access-denied/access-denied.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';

import { DefaultLayoutComponent } from './containers'; // Ya está importado
import { AuthGuard } from './_guards/auth.guard'; // Ya está importado

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    // Esta será la ruta principal para todo tu dashboard
    path: 'dashboard', // <-- ¡CAMBIADO A 'dashboard'!
    component: DefaultLayoutComponent,
    canActivate: [AuthGuard],
    data: { roles: ['USER-PROFILE', 'GUARD-PROFILE', 'ADMIN-PROFILE'] }, // Protege el acceso base
    children: [
      {
        path: '', // <-- Deja este path vacío para que el PortalModule gestione el resto
        loadChildren: () => import('./views/pages/portal/portal.module').then(m => m.PortalModule),
      },
    ]
  },
  {
    path: 'access-denied', // Asegúrate de que esta ruta exista para las denegaciones de acceso
    component: AccessDeniedComponent
  },
  // { path: 'register', component: RegisterComponent },
  // { path: 'profile', component: ProfileComponent },
  // La ruta wildcard debe ser la ÚLTIMA en tu configuración de rutas principales
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }