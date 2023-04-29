import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { StorageService } from './_services/storage.service';
import { AuthService } from './_services/auth.service';
import { EventBusService } from './_shared/event-bus.service';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;

  eventBusSub?: Subscription;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private eventBusService: EventBusService,
    private iconSetService: IconSetService,
    private router: Router
  ) {
    iconSetService.icons = { ...iconSubset };
  }

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      //debugger
      
      this.roles = this.storageService.getRoles();
      this.showAdminBoard = this.roles.includes('ADMIN-PROFILE');
      this.showModeratorBoard = this.roles.includes('GUARD-PROFILE');

      this.username = this.storageService.getUser();
      
    }

    this.eventBusSub = this.eventBusService.on('logout', () => {
      //debugger
      this.logout();
    });
  }

  logout(): void { 
    this.authService.logout().subscribe({
      next: res => {
        console.log(res);
        this.storageService.clean();

        this.router.navigate(['login']);
        //window.location.reload();
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
