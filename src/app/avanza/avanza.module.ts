import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule, IconSetService } from '@coreui/icons-angular';

import { TestComponent } from './components/test/test.component';
import { AvdatatableComponent } from './components/avdatatable/avdatatable.component';

import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HousesListComponent } from './components/houses-list/houses-list.component';

@NgModule({
    imports: [
        CommonModule,
        IconModule,

        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        HttpClientModule,

    ],
    declarations: [

        TestComponent,
        AvdatatableComponent,
        HousesListComponent,

    ],
    exports: [

        TestComponent,
        AvdatatableComponent,
        HousesListComponent,
        IconModule,
      
    ],
})
export class AvanzaModule { }
