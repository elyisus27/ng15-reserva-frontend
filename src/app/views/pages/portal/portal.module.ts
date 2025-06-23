import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Asegúrate de que las importaciones de tus componentes sean correctas (rutas ajustadas)
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { HousesListComponent } from './houses-list/houses-list.component';
import { CfeListComponent } from './cfe-list/cfe-list.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardUserComponent } from './board-user/board-user.component';

// Importa AvanzaModule porque contiene SmartDatatableComponent
import { AvanzaModule } from '../../../avanza/avanza.module'; // <--- ¡IMPORTANTE!

// Importa los módulos de Angular Material que tus componentes necesitan
// Basado en tus errores, necesitas al menos estos:
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// Asegúrate de importar cualquier otro módulo de Material que uses (ej. MatButtonModule, MatIconModule etc.)
// Revisa tus archivos HTML de HousesListComponent y CfeListComponent para ver cuáles más podrías necesitar.

import { ROUTES } from './portal.routing'; // Tus rutas de portal

@NgModule({
  declarations: [
    BoardAdminComponent,
    BoardModeratorComponent,
    BoardUserComponent,

    HousesListComponent,
    CfeListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),

    // --- Módulos que tus componentes movidos necesitan ---
    AvanzaModule, // Provee SmartDatatableComponent (asumiendo que está exportado de AvanzaModule)

    // Módulos de Angular Material
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    // Añade aquí cualquier otro módulo de Material necesario
  ],
  // No necesitas exportar estos componentes si solo se usan dentro del PortalModule,
  // pero si algún otro módulo fuera de PortalModule los necesitara, se exportarían aquí.
  exports: [
    // Generalmente no se exportan si son vistas de un módulo
  ]
})
export class PortalModule { }