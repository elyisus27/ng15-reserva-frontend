import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CfeListComponent } from './components/cfe-list/cfe-list.component';
import { HousesListComponent } from './components/houses-list/houses-list.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

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
