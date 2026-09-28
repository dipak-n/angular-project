import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  QueryList
} from '@angular/core';

import { EmployeeCardComponent } from '../employee-card/employee-card';

@Component({
  selector: 'app-employee-panel',
  standalone: true,
  templateUrl: './content-child-employee-panel.html'
})
export class ContentChildEmployeePanel implements AfterContentInit {

  // Access one projected element
  @ContentChild('panelTitle')
  panelTitle!: HTMLElement;

  // Access multiple projected components
  @ContentChildren(EmployeeCardComponent)
  employeeCards!: QueryList<EmployeeCardComponent>;

  ngAfterContentInit(): void {

    console.log(
      'Projected title:',
      this.panelTitle
    );

    console.log(
      'Projected employee cards:',
      this.employeeCards.length
    );

  }

  highlightAll(): void {

    this.employeeCards.forEach(card => {
      card.highlight();
    });

  }

}

// |              | `@ViewChild`         | `@ContentChild`         |
// | ------------ | -------------------- | ----------------------- |
// | Looks where? | Component's own view | Projected content       |
// | Uses         | Component's template | Parent-provided content |
// | Lifecycle    | `ngAfterViewInit()`  | `ngAfterContentInit()`  |
// | Example      | `<input #search>`    | `<ng-content>` content  |

// <ng-content></ng-content> ==> does not create the content. "Render the content that the parent placed inside this component."

// @ViewChild       → ONE → own view
// @ViewChildren    → MANY → own view

// @ContentChild    → ONE → projected content
// @ContentChildren → MANY → projected content

// <ng-content>     → content projection