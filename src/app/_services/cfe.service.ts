import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { environment } from '../../environments/environment'
const API_URL = `${environment.API_URL}/cfe-contract`;
@Injectable({
  providedIn: 'root',
})
export class CfeService {
  constructor(private http: HttpClient, private storage: StorageService) { }

  getPublicContent(): Observable<any> {
    return this.http.get(`${API_URL}/update-balance `, { responseType: 'text' });
  }

  registerContracts(): Observable<any> {
    return this.http.get(`${API_URL}/register-contracts`, { responseType: 'text' });
  }

  initTelegram(): Observable<any> {
    return this.http.get(`${API_URL}/init-telegram`, { responseType: 'text' });
  }


}
