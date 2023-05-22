import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardModeratorComponent } from './board-moderator/board-moderator.component'
import { LumstonModule } from '../../../lumston/lumston.module';



@NgModule({
  declarations: [BoardModeratorComponent],
  imports: [
    LumstonModule,
    CommonModule
  ]
})
export class PortalModule {
 
}
