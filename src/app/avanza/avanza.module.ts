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


//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';




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
        //BrowserAnimationsModule,


    ],
    declarations: [

        TestComponent,
        AvdatatableComponent,

    ],
    exports: [

        TestComponent,
        AvdatatableComponent,
        IconModule,
      
    ],
})
export class AvanzaModule { }
