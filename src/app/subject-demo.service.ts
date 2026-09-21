import { Injectable, inject } from '@angular/core';
import { AsyncSubject, BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';

import { Employee } from './employee.model';

@Injectable({
  providedIn: 'root'
})
export class SubjectDemoService {

  // 1. Subject
  private refreshSubject = new Subject<void>();
  refresh$ = this.refreshSubject.asObservable();


  // 2. BehaviorSubject
  private selectedEmployeeSubject = new BehaviorSubject<Employee | null>(null);
  selectedEmployee$ = this.selectedEmployeeSubject.asObservable();


  // 3. ReplaySubject // ReplaySubject doesn't limit what current subscribers receive. It controls how many previous values are replayed to a new subscriber.
  private activitySubject = new ReplaySubject<string>(1);
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