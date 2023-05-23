import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { environment } from '../../environments/environment'
const API_URL = `${environment.API_URL}/auth/`;
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private storage: StorageService) { }
  private baseURL = 'https://jsonplaceholder.typicode.com/photos';

  getPublicContent(): Observable<any> {
    return this.http.get(`${API_URL} + all`, { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_URL + 'usr', { responseType: 'text' });
  }

  getModeratorBoard(): Observable<any> {
    return this.http.get(API_URL + 'mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(API_URL + 'adm', { responseType: 'text' });
  }

  getData() {
    return this.http.get(this.baseURL);
  }
}
