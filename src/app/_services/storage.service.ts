import { Injectable } from '@angular/core';
import { Buffer } from 'buffer';

const USER_KEY = 'Token';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() { }

  clean(): void {
    localStorage.clear();
  }

  public getUser(): any {
    if (!this.isLoggedIn()) {
      return null;
    }
    
    const token = this.getToken();
    const payload = token.split('.')[1];
    const values = window.atob(payload)
    const valuesJson = JSON.parse(values);
    const username = valuesJson.username;
    return username;
  }

  public getRoles(): any {
    if (!this.isLoggedIn()) {
      return null;
    }
    
    const token = this.getToken();
    const payload = token.split('.')[1];
    const values = window.atob(payload)
    const valuesJson = JSON.parse(values);
    const roles = valuesJson.profiles;
    
    return roles;
  }
  public getEmail(): any {
    if (!this.isLoggedIn()) {
      return null;
    }
    
    const token = this.getToken();
    const payload = token.split('.')[1];
    //const values = Buffer.from(payload, 'base64').toString('ascii');  
    const values = window.atob(payload)
    const valuesJson = JSON.parse(values);
    const username = valuesJson.email;
    return username;
  }

  public isLoggedIn(): boolean {
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }

  setToken(token: string): void {
    localStorage.setItem(USER_KEY, token);
  }

  getToken(): string {

    let _tok = localStorage.getItem(USER_KEY);
    if (_tok)
      return _tok
    return ""
  }


}

// export class session {

//   token = ""
//   profiles = []
//   permissions = []
//   username = ""
//   email = ""
// }
