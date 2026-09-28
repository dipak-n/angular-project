import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { EmployeeComponent } from './employee/employee.component';
// import { UserListComponent } from './user-component/user-component';
// import { SubjectDemo } from './subject-demo/subject-demo';
// import { ShareDemoComponent } from './share-demo/share-demo';
import { RxjsMapDemoComponent } from './rxjs-map-demo/rxjs-map-demo';
import { RxjsCombinationComponent } from './rxjs-combination/rxjs-combination';
import { AutoSaveFormComponent } from './auto-save-form/auto-save-form';
import { EmployeeListComponent } from './view-child/employee-list/employee-list';
import { ViewContainerEmployee } from './Dynamic-Component-Creation/view-container-employee/view-container-employee';
import { AppIfRoleDirective } from './directives/app-if-role.directive';
import { HighlightDirective } from './directives/highlight.directive';
import { EmployeeFormatPipe } from './pipes/employee-format.pipe';
import { EmployeeComponent } from './employee/employee.component';

@Component({
  imports: [
    RouterOutlet,
    // AppIfRoleDirective,
    // HighlightDirective,
    // EmployeeFormatPipe
    

    
    // UserListComponent, 
    EmployeeComponent, 
    // SubjectDemo, 
    // ShareDemoComponent, 
    // RxjsMapDemoComponent,
    // RxjsCombinationComponent,
    // AutoSaveFormComponent,
    // EmployeeListComponent,
    // ViewContainerEmployee
  ],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('angular-project');
  employeeName = 'rAHUL';
}

// | Technique              | Main purpose                        |
// | ---------------------- | ----------------------------------- |
// | `OnPush`               | Reduce unnecessary change detection |
// | `track`                | Efficient list rendering            |
// | Lazy loading           | Reduce initial bundle               |
// | `debounceTime`         | Reduce search API calls             |
// | `switchMap`            | Cancel obsolete requests            |
// | `async` pipe           | Manage observable subscriptions     |
// | Signals                | Efficient reactive local state      |
// | Pagination             | Avoid loading huge datasets         |
// | Image optimization     | Reduce asset size                   |
// | Avoid template methods | Avoid repeated calculations         |
