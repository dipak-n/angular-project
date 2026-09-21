import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AsyncSubject, BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';

import { Employee } from './employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/employees';

  public employeesSubject = new BehaviorSubject<Employee[]>([]);
  employees$ = this.employeesSubject.asObservable();
  replaySubject = new ReplaySubject<Employee>(1);

  // GET employees with search + sorting + pagination
  getEmployees( page: number, pageSize: number, search: string, sortColumn: string, sortDirection: 'asc' | 'desc' ): Observable<EmployeeApiResponse> {
    let params = new HttpParams().set('_page', page).set('_per_page', pageSize);
    if (search.trim()) {
      params = params.set('name:contains',search.trim());
    }
    if (sortColumn) {
      const sortValue = sortDirection === 'desc' ? `-${sortColumn}` : sortColumn;
      params = params.set( '_sort', sortValue );
    }
    return this.http.get<EmployeeApiResponse>(this.apiUrl,{ params });
  }


  // Add
  addEmployee(employee: Omit<Employee, 'id'>): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl,employee);
  }


  // Update
  updateEmployee(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${employee.id}`,employee);
  }


  // Delete
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getDepartments(): Observable<[]> {
    return this.http.get<[]>('http://localhost:3000/departments');
  }


  // 1. Subject
  private refreshSubject = new Subject<void>();
  refresh$ = this.refreshSubject.asObservable();


  // 2. BehaviorSubject
  private selectedEmployeeSubject = new BehaviorSubject<Employee | null>(null);
  selectedEmployee$ = this.selectedEmployeeSubject.asObservable();


  // 3. ReplaySubject
  private activitySubject = new ReplaySubject<string>(3);
  activity$ = this.activitySubject.asObservable();


  // 4. AsyncSubject
  private operationSubject = new AsyncSubject<string>();
  operation$ = this.operationSubject.asObservable();

  refreshEmployees(): void {
    console.log('Refresh event sent');
    this.refreshSubject.next();
  }

  selectEmployee(employee: Employee): void {
    this.selectedEmployeeSubject.next(employee);
  }

  addActivity(message: string): void {
    this.activitySubject.next(message);
  }

  completeOperation(message: string): void {
    this.operationSubject.next(message);
    this.operationSubject.complete();
  }
}


export interface EmployeeApiResponse {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: Employee[];
}