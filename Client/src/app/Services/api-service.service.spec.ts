import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getExpenses(): Observable<any> {
    return this.http.get(`${this.apiUrl}/expenses`);
  }

  addExpense(expense: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/expenses`, expense);
  }
}
