import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren
} from '@angular/core';

import { NgTemplateOutlet } from '@angular/common';

import { EmployeeCardComponent } from '../employee-card/employee-card';
import { EmployeeService } from '../../employee.service';
import { Employee } from '../../employee.model';
import { ContentChildEmployeePanel } from '../content-child-employee-panel/content-child-employee-panel';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    EmployeeCardComponent,
    ContentChildEmployeePanel,
    NgTemplateOutlet
  ],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss'
})
export class EmployeeListComponent implements AfterViewInit {

  employees: Employee[] = [];

  // ViewChild - HTML element
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  // ViewChild - child component
  @ViewChild(EmployeeCardComponent) firstEmployeeCard!: EmployeeCardComponent;

  // ViewChildren - multiple child components
  @ViewChildren(EmployeeCardComponent) employeeCards!: QueryList<EmployeeCardComponent>;

  // ViewChild - template
  @ViewChild('employeeTemplate') employeeTemplate!: TemplateRef<unknown>;

  constructor(
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.employeeService.getEmployees(0, 5, '', '', 'asc').subscribe(response => {
      this.employees = response.data;
    });
  }

  ngAfterViewInit(): void {
    console.log('First employee:', this.firstEmployeeCard.employee );
    console.log( 'Number of employee cards:', this.employeeCards.length );
  }

  focusSearch(): void {
    this.searchInput.nativeElement.focus();
  }

  highlightFirstEmployee(): void {
    this.firstEmployeeCard.highlight();
  }

  highlightAllEmployees(): void {
    this.employeeCards.forEach(card => {
      card.highlight();
    });
  }

}

// ViewChild allows us to access a single element, component, directive, or template from the component's view.
// ViewChildren allows us to access multiple matching elements or components and returns them as a QueryList.
// ng-template defines a template that isn't rendered immediately. It can be rendered dynamically using mechanisms such as ngTemplateOutlet.
// "When can you access ViewChild?" Normally after the view has been initialized, such as in ngAfterViewInit().

// static: false → available after view initialization
// static: true → available earlier, but only appropriate when the element is present during creation

// <div class="container">

//   <h2>Employee Management</h2>

//   <!-- ViewChild -->
//   <div class="search-section">

//     <input
//       #searchInput
//       type="text"
//       placeholder="Search employee..."
//     >

//     <button (click)="focusSearch()">
//       Focus Search
//     </button>

//   </div>


//   <!-- ViewChild + ViewChildren -->

//   <h3>Employees</h3>

//   @for (employee of employees; track employee.id) {

//     <app-employee-card
//       [employee]="employee">
//     </app-employee-card>

//   }


//   <div class="actions">

//     <button (click)="highlightFirstEmployee()">
//       Highlight First Employee
//     </button>

//     <button (click)="highlightAllEmployees()">
//       Highlight All Employees
//     </button>

//   </div>


//   <!-- ng-template -->

//   <h3>Employee Template</h3>

//   <ng-template #employeeTemplate let-name="name" let-role="role" let-department="department">

//     <div class="template-card">

//       <h4>{{ name }}</h4>

//       <p>{{ role }}</p>

//       <p>{{ department }}</p>

//     </div>

//   </ng-template>


//   <!-- Render ng-template -->
//   <ng-container *ngTemplateOutlet="employeeTemplate; context: {
//       name: 'Rahul',
//       role: 'Angular Developer',
//       department: 'IT'
//     }">
//   </ng-container>

// </div>