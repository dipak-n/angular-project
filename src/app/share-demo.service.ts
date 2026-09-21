import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { share, shareReplay, tap } from 'rxjs/operators';
import { Employee } from './employee.model';

@Injectable({
    providedIn: 'root'
})
export class ShareService {

    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/employees';

    // 1. SHARE
    employeesWithShare$ = this.http.get<Employee[]>(this.apiUrl).pipe(
        tap(() => {
            console.log('SHARE: API called');
        }),
        share()
    );

    // 2. SHARE REPLAY
    employeesWithReplay$ = this.http.get<Employee[]>(this.apiUrl).pipe(
        tap(() => {
            console.log('SHAREREPLAY: API called');
        }), shareReplay(1)
    );

    // 3. BEHAVIOR SUBJECT
    private selectedEmployeeSubject = new BehaviorSubject<Employee | null>(null);
    selectedEmployee$ = this.selectedEmployeeSubject.asObservable();

    selectEmployee(employee: Employee): void {
        this.selectedEmployeeSubject.next(employee);
    }

}


// Cold vs Hot — Interview Comparison

// Easy example to remember 🧠

// Think of Netflix vs live cricket:
// Cold Observable = Netflix movie
// Each person starts their own movie:
// Person A → starts movie
// Person B → starts separate movie

// Hot Observable = Live cricket match
// The match is already happening:
//           LIVE MATCH
//          /    |    \
//         A     B     C
// Everyone watches the same ongoing event.

// Cold = subscription starts/controls the execution.
// Hot = execution exists independently of each subscriber.

// Feature	                  Cold Observable	                Hot Observable
// Execution	              Per subscriber	                Shared/independent
// New subscriber             Starts its own execution	        Joins existing source
// HTTP get()	              ✅ Cold	                       — 
// Subject	—	                                                ✅ Hot
// Multiple subscribers       Can cause multiple API calls	    Can share same values

// Example	                  http.get()                        Subject, shared streams
//                            employees$ = this.http            employees$ = this.http.get<Employee[]>(
//                            .get<Employee[]>(this.apiUrl)     'http://localhost:3000/employees'
//                            .pipe(shareReplay(1));             );



