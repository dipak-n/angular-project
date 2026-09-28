import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Employee } from '../employee.model';
import { EmployeeService } from '../employee.service';

export const employeeResolver: ResolveFn<Employee> = (route) => {

  const employeeService = inject(EmployeeService);
  const router = inject(Router);

  const id = Number(route.paramMap.get('id'));

  return employeeService.getEmployeeById(id).pipe(
    catchError(() => {
      router.navigate(['/home']);
      return throwError(() => new Error('Employee not found'));
    })
  );
};

// Resolver gets the required data before route activation. 
// If the data cannot be loaded, it can redirect the user to another route.

// Route → Resolver → API call → Data received → Component loads

// | Guard                                  | Resolver                               |
// | -------------------------------------- | -------------------------------------- |
// | Controls whether navigation is allowed | Loads data before navigation completes |
// | Answers **"Can I enter?"**             | Answers **"What data do I need?"**     |
// | Example: authentication                | Example: employee details              |
// | `CanActivate`                          | `Resolve`                              |
