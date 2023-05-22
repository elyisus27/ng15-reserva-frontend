import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestComponent } from './test/test.component';
import { AvdatatableComponent } from './components/avdatatable/avdatatable.component';
import { IconModule, IconSetService } from '@coreui/icons-angular';

//import { MatButtonModule, MatTooltipModule, MatProgressSpinnerModule } from '@angular/material';
//import { ListPickerComponent } from './components/pickers/list-picker/list-picker.component';
//import { DatatableComponent } from './components/datatable/datatable.component';
// import { PaginationComponent } from '@coreui/angular';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule  } from '@angular/material/button';



@NgModule({
    imports: [
         CommonModule,
         FormsModule,
         IconModule,
        // TranslateModule,
        
          MatButtonModule,
        //   MatTooltipModule,
        //   MatProgressSpinnerModule,
        MatSlideToggleModule
    ],
    declarations: [
        //DatatableComponent,
        //PaginationComponent,

        // SelectFieldComponent,

        //ListPickerComponent,

        // CharactersFilterDirective,
        // PermissionDirective,
        // DisabledPermissionDirective,
        TestComponent,
        AvdatatableComponent,
        
    ],
    exports: [
        // DatatableComponent,

        // SelectFieldComponent,

        // PaginationComponent,
        
        
        // CharactersFilterDirective,
        // PermissionDirective,
        // DisabledPermissionDirective,
        TestComponent,
        AvdatatableComponent,
        IconModule,
        MatSlideToggleModule
    ],
})
export class LumstonModule { }
