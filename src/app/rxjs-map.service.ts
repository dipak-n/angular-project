import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Employee } from './employee.model';

@Injectable({
  providedIn: 'root'
})
export class RxjsMapService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/employees';

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  searchEmployees(search: string): Observable<Employee[]> {
    return this.http.get<Employee[]>(
      `${this.apiUrl}?name:contains=${search}`
    );
  }

  addEmployee(
    employee: Omit<Employee, 'id'>
  ): Observable<Employee> {

    return this.http.post<Employee>(
      this.apiUrl,
      employee
    );
  }
}