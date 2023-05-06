import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { AuthService } from '../../../../app/_services/auth.service';
import { StorageService } from '../../../../app/_services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private classToggler: ClassToggleService,
    private router: Router) {
    super();
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
