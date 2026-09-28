import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { EmployeeService, EmployeeApiResponse } from './employee.service';
import { Employee } from './employee.model';

describe('EmployeeService', () => {

  let service: EmployeeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EmployeeService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should get employees', () => {

    const mockResponse: EmployeeApiResponse = {
      first: 1,
      prev: null,
      next: 2,
      last: 5,
      pages: 5,
      items: 25,
      data: [
        {
          id: 1,
          name: 'Rahul',
          email: 'rahul@gmail.com',
          department: 'IT'
        }
      ]
    };

    service.getEmployees(0, 5, '', '', 'asc')
      .subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

    const request = httpMock.expectOne(
      req => req.url === 'http://localhost:3000/employees'
    );

    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('_page')).toBe('0');
    expect(request.request.params.get('_per_page')).toBe('5');

    request.flush(mockResponse);
  });

  it('should send search parameter', () => {

    service.getEmployees(0, 5, 'Rahul', '', 'asc')
      .subscribe();

    const request = httpMock.expectOne(
      req => req.url === 'http://localhost:3000/employees'
    );

    expect(request.request.params.get('name:contains'))
      .toBe('Rahul');

    request.flush({
      first: 1,
      prev: null,
      next: null,
      last: 1,
      pages: 1,
      items: 0,
      data: []
    });
  });

  it('should send descending sort parameter', () => {

    service.getEmployees(0, 5, '', 'name', 'desc')
      .subscribe();

    const request = httpMock.expectOne(
      req => req.url === 'http://localhost:3000/employees'
    );

    expect(request.request.params.get('_sort'))
      .toBe('-name');

    request.flush({
      first: 1,
      prev: null,
      next: null,
      last: 1,
      pages: 1,
      items: 0,
      data: []
    });
  });

  it('should add an employee', () => {

    const newEmployee: Omit<Employee, 'id'> = {
      name: 'John',
      email: 'john@gmail.com',
      department: 'HR',
    };

    const createdEmployee: Employee = {
      id: 10,
      name: 'John',
      email: 'john@gmail.com',
      department: 'HR'
    };

    service.addEmployee(newEmployee)
      .subscribe(response => {
        expect(response).toEqual(createdEmployee);
      });

    const request = httpMock.expectOne(
      'http://localhost:3000/employees'
    );

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(newEmployee);

    request.flush(createdEmployee);
  });

  it('should update an employee', () => {

    const employee: Employee = {
      id: 1,
      name: 'Rahul Updated',
      email: 'rahul@gmail.com',
      department: 'IT'
    };

    service.updateEmployee(employee)
      .subscribe(response => {
        expect(response).toEqual(employee);
      });

    const request = httpMock.expectOne(
      'http://localhost:3000/employees/1'
    );

    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(employee);

    request.flush(employee);
  });

  it('should delete an employee', () => {

    service.deleteEmployee(5)
      .subscribe(response => {
        expect(response).toBeNull();
      });

    const request = httpMock.expectOne(
      'http://localhost:3000/employees/5'
    );

    expect(request.request.method).toBe('DELETE');

    request.flush(null);
  });

  it('should get departments', () => {

    const departments = [
      { id: 1, name: 'IT' },
      { id: 2, name: 'HR' }
    ];

    service.getDepartments()
      .subscribe(response => {
        expect(response).toEqual(departments);
      });

    const request = httpMock.expectOne(
      'http://localhost:3000/departments'
    );

    expect(request.request.method).toBe('GET');

    request.flush(departments);
  });

  it('should get employee by id', () => {

    const employee: Employee = {
      id: 3,
      name: 'Amit',
      email: 'amit@gmail.com',
      department: 'Finance'
    };

    service.getEmployeeById(3)
      .subscribe(response => {
        expect(response).toEqual(employee);
      });

    const request = httpMock.expectOne(
      'http://localhost:3000/employees/3'
    );

    expect(request.request.method).toBe('GET');

    request.flush(employee);
  });

  it('should emit refresh event', () => {

    let refreshCalled = false;

    service.refresh$.subscribe(() => {
      refreshCalled = true;
    });

    service.refreshEmployees();

    expect(refreshCalled).toBe(true);
  });

  it('should select an employee', () => {

    const employee: Employee = {
      id: 1,
      name: 'Rahul',
      email: 'rahul@gmail.com',
      department: 'IT'
    };

    let selectedEmployee: Employee | null = null;

    service.selectedEmployee$.subscribe(employee => {
      selectedEmployee = employee;
    });

    service.selectEmployee(employee);

    expect(selectedEmployee).toEqual(employee);
  });

  it('should replay the last 3 activities', () => {

    const activities: string[] = [];

    service.addActivity('Login');
    service.addActivity('Employee Added');
    service.addActivity('Employee Updated');
    service.addActivity('Employee Deleted');

    service.activity$.subscribe(activity => {
      activities.push(activity);
    });

    expect(activities).toEqual([
      'Employee Added',
      'Employee Updated',
      'Employee Deleted'
    ]);
  });

  it('should emit the last operation when completed', () => {

    let result = '';

    service.operation$.subscribe(value => {
      result = value;
    });

    service.completeOperation('Operation Completed');

    expect(result).toBe('Operation Completed');
  });

  it('should handle HTTP error', () => {

    let errorReceived = false;

    service.getEmployeeById(1).subscribe({
      next: () => {
        errorReceived = false;
      },
      error: error => {
        errorReceived = true;
        expect(error.status).toBe(500);
      }
    });

    const request = httpMock.expectOne(
      'http://localhost:3000/employees/1'
    );

    expect(request.request.method).toBe('GET');

    request.flush('Server Error', {
      status: 500,
      statusText: 'Internal Server Error'
    });

    expect(errorReceived).toBe(true);
  });
});
