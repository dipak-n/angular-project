import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  name: string;
  email: string;
  department: string;
  salary: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'http://localhost:3000/employees';

  constructor(private http: HttpClient) {}

  saveEmployee(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(
      `${this.apiUrl}/1`,
      employee
    );
  }
}