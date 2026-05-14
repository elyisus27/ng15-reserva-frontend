import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  CardModule,
  TabsModule,
  NavModule,
  BadgeModule,
  GridModule,
  WidgetModule,
} from '@coreui/angular';

import { CFE_ROUTES } from './cfe.routing';
import { CfeDashboardComponent } from './cfe-dashboard.component';



@NgModule({
  declarations: [
    CfeDashboardComponent,
    
   
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(CFE_ROUTES),
    CardModule,
    TabsModule,
    NavModule,
    BadgeModule,
    GridModule,
    WidgetModule
  ],
})
export class CfeModule {}
