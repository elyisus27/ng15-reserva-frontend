import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardModeratorComponent } from './board-moderator/board-moderator.component'
import { AvanzaModule } from '../../../avanza/avanza.module';
import { RouterModule } from '@angular/router';
import {ROUTES} from './portal.routing'



@NgModule({
  declarations: [BoardModeratorComponent],
  imports: [
    CommonModule,
    AvanzaModule,
    RouterModule.forChild(ROUTES),
  ]
})

export class PortalModule {
 
}
