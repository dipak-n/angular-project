import { Component, OnInit, inject } from '@angular/core';
import { Employee } from '../employee.model';
import { CommonModule } from '@angular/common';
import { SubjectDemoService } from '../subject-demo.service';

@Component({
  selector: 'app-subject-demo',
  standalone: true,
  templateUrl: './subject-demo.html',
  styleUrl: './subject-demo.scss',
  imports: [CommonModule]
})
export class SubjectDemo implements OnInit {

  private subjecteService = inject(SubjectDemoService);
  selectedEmployee: Employee | null = null;
  activities: string[] = [];
  operationResult = '';
  refreshMessage = '';


  ngOnInit(): void {

    // Subject
    this.subjecteService.refresh$.subscribe(() => {
      this.refreshMessage = 'Refresh event received!';
    });


    // BehaviorSubject
    this.subjecteService.selectedEmployee$.subscribe(employee => {
      this.selectedEmployee = employee;
    });

    // ReplaySubject
    this.subjecteService.activity$.subscribe(activity => {
      this.activities.push(activity);
    });

    // AsyncSubject
    this.subjecteService.operation$.subscribe(result => {
      this.operationResult = result;
    });
  }


  testSubject(): void {
    this.subjecteService.refreshEmployees();
  }


  testBehaviorSubject(): void {
    const employee: Employee = {
      id: 1,
      name: 'Dipak',
      email: 'dipak@gmail.com',
      department: 'IT'
    };
    this.subjecteService.selectEmployee(employee);
  }


  testReplaySubject(): void {
    this.subjecteService.addActivity( 'Employee added' );
    this.subjecteService.addActivity('Employee updated');
    this.subjecteService.addActivity( 'Employee deleted' );
    this.subjecteService.addActivity('Employee added again' );
  }


  testAsyncSubject(): void {
    this.subjecteService.completeOperation( 'Step 1 completed' );
    this.subjecteService.completeOperation( 'Step 2 completed' );
    this.subjecteService.completeOperation( 'Final employee report generated' );
  }
}

// Subject
//    ↓
// EVENT
// "Refresh happened"


// BehaviorSubject
//    ↓
// CURRENT STATE
// "Selected employee is Dipak"


// ReplaySubject
//    ↓
// HISTORY
// "Here are the last 3 activities"


// AsyncSubject
//    ↓
// FINAL RESULT
// "Operation finished with this result"


// Type	Remembers?	New subscriber gets	Common use
// Subject	Nothing	Nothing old	Events/actions
// BehaviorSubject	Latest 1	Latest value immediately	Current state
// ReplaySubject(n)	Last N	Last N values	History/replay
// AsyncSubject	Final 1	Final value after complete()	Final result

// "shareReplay() is an RxJS operator used to share an existing Observable and replay previously emitted values, commonly used with HTTP requests. 
// ReplaySubject is a Subject that stores a specified number of previous emissions and replays them to new subscribers. 
// With ReplaySubject, we manually control emissions using next()."


// Why do we use asObservable() with a Subject or BehaviorSubject, and why shouldn't we expose the Subject directly?
// ==> "asObservable() is used to expose a Subject or BehaviorSubject as a read-only Observable. 
// It prevents components or other consumers from directly calling next() and modifying the Subject. 
// The service keeps control of updating the data, while components can only subscribe to the Observable. 
// This provides better encapsulation and maintainability."

// Subject → service can next()
// asObservable() → components can only subscribe()
// Subject = Read + Write (next)
// Observable = Read only (subscribe)

// Q: Observable vs Subject?
// "An Observable is consumed by subscribers, while a Subject is both an Observable and an Observer, so it can also emit values using next()."

// Q: Why BehaviorSubject for shared state?
// "Because it stores the latest value and immediately provides that value to new subscribers."

// Q: Can Observable call next()?
// "No. next() is available on Subjects or Observers, not a normal Observable."

// Q: asObservable() vs asSubject()?
// "asObservable() exposes a Subject as an Observable. asSubject() is not a standard RxJS method."