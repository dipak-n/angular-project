import { Component, inject, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  Subject,
  combineLatest,
  forkJoin,
  withLatestFrom
} from 'rxjs';

import { EmployeeService } from '../employee.service';
import { Department, Employee } from '../employee.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rxjs-combination',
  templateUrl: './rxjs-combination.html',
  standalone: true,
  imports: [CommonModule]
})
export class RxjsCombinationComponent implements OnInit {

  private employeeService = inject(EmployeeService);

  employees: Employee[] = [];
  departments: Department[] = [];
  message = '';

 // COMBINELATEST
  private searchSubject = new BehaviorSubject<string>('');
  private departmentSubject = new BehaviorSubject<string>('All');

 // WITHLATESTFROM
  private searchButtonSubject = new Subject<void>();
  private sortSubject = new BehaviorSubject<string>('name');

  ngOnInit(): void {
    this.setupCombineLatest();
    this.setupWithLatestFrom();

  }

 // 1. COMBINELATEST
  setupCombineLatest(): void {
    combineLatest([
      this.searchSubject,
      this.departmentSubject
    ]).subscribe({
      next: ([search, department]) => {
        console.log('----- combineLatest -----');
        console.log( 'Search:', search );
        console.log('Department:',department);
        this.message = `Search: ${search || 'All'}, ` + `Department: ${department}`;
      }
    });
  }


  onSearch(search: string): void {
    this.searchSubject.next(search);
  }

  onDepartmentChange(department: string): void {
    this.departmentSubject.next(department);
  }

 // 2. WITHLATESTFROM
  setupWithLatestFrom(): void {
    this.searchButtonSubject.pipe(withLatestFrom(this.sortSubject)).subscribe({ next: ([_, sort]) => {
        console.log('----- withLatestFrom -----');
        console.log('Search button clicked' );
        console.log( 'Latest sort:', sort);
        this.message = `Search clicked with sort: ${sort}`;
      }
    });
  }

  onSortChange(sort: string): void {
    this.sortSubject.next(sort);
    console.log( 'Sort changed:', sort );

  }

  onSearchButtonClick(): void {
    this.searchButtonSubject.next();
  }

 // 3. FORKJOIN
  loadInitialData(): void {
    forkJoin({
      employees: this.employeeService.getEmployees( 1, 100, '', '', 'asc' ),
      departments: this.employeeService.getDepartments()
    })
    .subscribe({next: (response) => {
        console.log('----- forkJoin -----');
        console.log( 'Employees:', response.employees.data );
        console.log( 'Departments:', response.departments );
        this.employees = response.employees.data;
        this.departments = response.departments;
        this.message = 'Employees and departments loaded.';
      },
      error: (error) => {
        console.error( 'Failed to load data:', error );
        this.message = 'Failed to load data.';
      }
    });
  }
}

// | Operator           | Think                                                 |
// | ------------------ | ----------------------------------------------------- |
// | `combineLatest()`  | **Anyone changes → give me everything latest**        |
// | `withLatestFrom()` | **Main source triggers → give me latest from others** |
// | `forkJoin()`       | **Wait for everyone to finish → give final results**  |
