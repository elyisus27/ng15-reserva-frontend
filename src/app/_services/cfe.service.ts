import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { environment } from '../../environments/environment'
const API_URL = `${environment.API_URL}`;
@Injectable({
  providedIn: 'root',
})
export class CfeService {
  constructor(private http: HttpClient, private storage: StorageService) { }

  getPublicContent(): Observable<any> {
    return this.http.get(`${API_URL}/cfe-contract/update-balance `, { responseType: 'text' });
  }

  registerContracts(): Observable<any> {
    return this.http.get(`${API_URL}/cfe-contract/register-contracts`, { responseType: 'text' });
  }

  initTelegram(): Observable<any> {
    return this.http.get(`${API_URL}/cfe-contract/init-telegram`, { responseType: 'text' });
  }

  listContracts(limit = 50, page = 1, showInactives = false): Observable<any> {
    return this.http.get(`${API_URL}/cfe-contract/listPaginated`, {
      params: {
        limit,
        page,
        showInactives
      }
    });
  }

  getChartHistory(contractIds: number[], start: string, end: string): Observable<any> {
  const ids = contractIds.join(',');   // "1,2,3,..."
  return this.http.get(`${API_URL}/hist-cfe-contract-receipt/chartHistory`, {
    params: { contractIds: ids, start, end }
  });
}

}
