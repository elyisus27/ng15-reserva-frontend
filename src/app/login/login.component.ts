import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  username="";
  visible=false;
  imgLogo: string = './assets/img/Caseta.png';

  constructor(private authService: AuthService, private storageService: StorageService,private router: Router) { }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      //this.isLoggedIn = true;
      //this.roles = this.storageService.getRoles()
      //this.username = this.storageService.getUser();

      this.router.navigate(['mod/home']);
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe({
      next: data => {
        
        
        this.storageService.setToken(data.data.token);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        debugger
         // --- Aquí puedes hacer el console.log para verificar ---
            const roles = this.storageService.getUserRoles();
            const user = this.storageService.getUser();
            const email = this.storageService.getEmail();
            console.log('Usuario logueado:', user);
            console.log('Roles del usuario:', roles);
            console.log('Email del usuario:', email);
       
        //this.roles = this.storageService.getUser().roles;
        this.username = this.storageService.getUser().roles;
    
        this.reloadPage();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
        this.onResetDismiss()
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
  onVisibleChange(eventValue: boolean) {
    this.visible = eventValue;
  }

  onResetDismiss() {
    this.visible = true;
  }
}
