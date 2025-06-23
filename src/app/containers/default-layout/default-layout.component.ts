// src/app/containers/default-layout/default-layout.component.ts

import { Component, OnInit } from '@angular/core';
import { navItems } from './_nav';
import { StorageService } from '../../_services/storage.service'; // Ajusta la ruta si es necesario

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {

  public navItems = navItems;
  
   public perfectScrollbarConfig = {
    suppressScrollX: true,
  };
  public userRoles: string[] = [];

  constructor(private storageService: StorageService) { }

  ngOnInit(): void {
    this.userRoles = this.storageService.getUserRoles();
    // Puedes suscribirte a eventos de login/logout si el menú no se actualiza al instante
    // this.eventBusService.on('loginSuccess', () => this.userRoles = this.storageService.getUserRoles());
    // this.eventBusService.on('logout', () => this.userRoles = []);
  }

  // Método para verificar si el usuario tiene los roles necesarios para mostrar un ítem de menú
  hasRequiredRoles(item: any): boolean {
    // Si el ítem no tiene 'requiredRoles' o es un array vacío, es visible para todos autenticados.
    if (!item.requiredRoles || item.requiredRoles.length === 0) {
      return true;
    }
    // Comprueba si el usuario tiene AL MENOS UNO de los roles requeridos.
    return item.requiredRoles.some((role: string) => this.userRoles.includes(role));
  }
}
