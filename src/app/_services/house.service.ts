import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const API_URL = `${environment.API_URL}/house/`;
@Injectable({
  providedIn: 'root'
})
export class HouseService {
  private testURL = 'https://jsonplaceholder.typicode.com/photos';

  constructor(private http: HttpClient) { }

  getData() {
    return this.http.get(API_URL);
    // return this.http.get(this.baseURL);
  }

  getTestData() {
    return this.http.get(this.testURL);
  }
}
