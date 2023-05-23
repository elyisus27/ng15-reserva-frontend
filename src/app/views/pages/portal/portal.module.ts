import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardModeratorComponent } from './board-moderator/board-moderator.component'
//import { LumstonModule } from '../../../lumston/lumston.module';
import { AvanzaModule } from '../../../avanza/avanza.module';
import { RouterModule } from '@angular/router';
import {ROUTES} from './portal.routing'



@NgModule({
  declarations: [BoardModeratorComponent],
  imports: [
    RouterModule.forChild(ROUTES),
    AvanzaModule,
    CommonModule
  ]
})

export class PortalModule {
 
}
