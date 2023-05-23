import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardModeratorComponent } from './board-moderator/board-moderator.component'
//import { LumstonModule } from '../../../lumston/lumston.module';
import { AvanzaModule } from 'src/app/avanza/avanza.module';



@NgModule({
  declarations: [BoardModeratorComponent],
  imports: [
    //LumstonModule,
    AvanzaModule,
    CommonModule
  ]
})

export class PortalModule {
 
}
