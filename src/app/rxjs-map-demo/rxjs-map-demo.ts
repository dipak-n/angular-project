import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, of, delay, switchMap, mergeMap, concatMap, exhaustMap } from 'rxjs';
import { RxjsMapService } from '../rxjs-map.service';
import { Employee } from '../employee.model';

@Component({
  selector: 'app-rxjs-map-demo',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './rxjs-map-demo.html'
})
export class RxjsMapDemoComponent implements OnInit {

  private rxjsMapService = inject(RxjsMapService);

  employees: Employee[] = [];
  message = '';
  searchText = '';

  // SWITCHMAP
  private searchSubject = new Subject<string>();

  // MERGEMAP
  private saveSubject = new Subject<Omit<Employee, 'id'>>();

  // EXHAUSTMAP
  private loginClickSubject = new Subject<void>();


  ngOnInit(): void {

    // SWITCHMAP
    this.searchSubject.pipe(switchMap(search => {
      console.log('Search API:', search);
      return this.rxjsMapService.searchEmployees(search);
    })
    ).subscribe({
      next: employees => {
        this.employees = employees;
      }, error: error => {
        console.error(error);
      }
    });


    // MERGEMAP
    this.saveSubject
      .pipe(mergeMap(employee => {
        console.log('Saving:', employee.name);
        return this.rxjsMapService.addEmployee(employee);
      })
      ).subscribe({
        next: employee => {
          console.log('Saved:', employee.name);
        }
      });


    // EXHAUSTMAP
    this.loginClickSubject.pipe(exhaustMap(() => {
      console.log('Login API started');
      return of('Login successful').pipe(delay(3000));
    })).subscribe({
      next: result => { this.message = result; console.log(result); }
    });
  }

  // SWITCHMAP
  search(): void {
    this.searchSubject.next(this.searchText);
  }


  // MERGEMAP
  saveEmployees(): void {

    this.saveSubject.next({
      name: 'Employee A',
      email: 'a@gmail.com',
      department: 'IT'
    });

    this.saveSubject.next({
      name: 'Employee B',
      email: 'b@gmail.com',
      department: 'HR'
    });

    this.saveSubject.next({
      name: 'Employee C',
      email: 'c@gmail.com',
      department: 'Finance'
    });
  }

  // CONCATMAP
  runSequential(): void {
    of(1, 2, 3).pipe(concatMap(number => {
      console.log('Starting:', number);
      return of(`Operation ${number} completed`).pipe(delay(1000));
    })).subscribe({
      next: result => {
        console.log(result);
      },complete: () => {
        console.log('All operations completed');
      }
    });
  }


  // EXHAUSTMAP
  login(): void {
    this.loginClickSubject.next();
  }
}

// pipe() → modifies/configures the Observable
// subscribe() → listens to the Observable and receives the result

// map()	                                         tap()
// Transforms data	                               Performs side effects
// Changes the emitted value	                     Keeps the emitted value unchanged
// Returns transformed value	                     Returns the original value
// Used for data processing	                       Used for logging, state updates, debugging
// Example: Employee → Employee Name	             Example: Log Employee

// map()	                                         filter()
// Transforms values	                             Selects/removes values
// Usually changes the value	                     Keeps the original value
// Every value produces an output	                 Only values satisfying condition produce output
// Used for data transformation	                   Used for conditional selection
// Example: ID → employee name	                   Example: only IT employees

// pipe()	                                         subscribe()
// Applies RxJS operators	                         Listens to Observable
// Used for transformation/processing	             Used to receive results
// Returns an Observable	                         Returns a Subscription
// Doesn't consume the final value itself	         Receives next, error, complete
// Can contain multiple operators	                 Defines callbacks
// Usually comes before subscribe()	               Usually comes after pipe()


// Operator	Where it is used	Example
// switchMap	==>                                  Search, autocomplete, filters	                             Employee search API
// mergeMap	==>                                    Multiple independent API calls that can run together	     Save multiple employees
// concatMap	==>                                  Operations that must run in order	                         Upload/process files sequentially
// exhaustMap	 ==>                                 Prevent duplicate actions while one request is running	   Login / Submit button

// New value arrives
//        │
//        ├── Want ONLY latest?       → switchMap
//        │
//        ├── Want ALL concurrently? → mergeMap
//        │
//        ├── Want ALL in order?      → concatMap
//        │
//        └── Already busy? Ignore it → exhaustMap

// catchError()	                                   finalize()
// Handles errors	                                 Performs cleanup
// Runs when an error occurs	                     Runs on complete, error, or unsubscribe
// Can provide fallback Observable	               Does not replace the Observable result
// Must return an Observable	                     Doesn't need to return the original data
// Example: show error/fallback data	             Example: stop spinner

// retry()	                                       catchError()
// Retries the failed                              Observable	Handles the error
// Automatically resubscribes	                     Can return a fallback Observable
// Useful for temporary failures	                 Useful for displaying/fallback handling
// Doesn't normally replace the error permanently	 Can prevent the error from reaching subscriber
// Example: retry network failure	                 Example: show "Unable to load"