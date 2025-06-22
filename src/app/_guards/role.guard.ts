import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../_services/storage.service'; // Importa StorageService

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private storageService: StorageService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const expectedRoles = route.data['roles'] as string[]; // Obtiene los roles esperados de la data de la ruta

    if (!expectedRoles || expectedRoles.length === 0) {
      // Si no se especifican roles en la ruta, permitir el acceso (o denegar según tu política por defecto)
      return true;
    }

    const userRoles = this.storageService.getRoles(); // Obtiene los roles del usuario logueado

    const hasRequiredRole = userRoles.some((role:any) =>
      expectedRoles.includes(role)
    );

    if (hasRequiredRole) {
      return true;
    } else {
      // Redirigir a una página de no autorizado o a la página principal
      this.router.navigate(['/unauthorized']); // Asegúrate de tener esta ruta configurada
      return false;
    }
  }
}