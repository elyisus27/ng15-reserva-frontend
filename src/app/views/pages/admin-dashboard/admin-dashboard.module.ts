import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';

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
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AvanzaModule } from '../../../avanza/avanza.module';


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
    AvanzaModule
  ]
})
export class AdminDashboardModule { }
