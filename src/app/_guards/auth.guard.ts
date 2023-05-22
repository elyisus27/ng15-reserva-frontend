import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


//import { ToastService } from '@app/services/toast/toast.service';
//import { Logger } from '@app/core';
import { StorageService } from '../_services/storage.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  profile: any;
  constructor(private storageService: StorageService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    //debugger
    if (!this.storageService.isLoggedIn()) {
      this.router.navigate(['/'])
      return false;
    }
    return true;
  }
}

