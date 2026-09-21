import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { EmployeeComponent } from './employee/employee.component';
// import { UserListComponent } from './user-component/user-component';
// import { SubjectDemo } from './subject-demo/subject-demo';
// import { ShareDemoComponent } from './share-demo/share-demo';
import { RxjsMapDemoComponent } from './rxjs-map-demo/rxjs-map-demo';
import { RxjsCombinationComponent } from './rxjs-combination/rxjs-combination';

@Component({
  imports: [RouterOutlet, 
    // UserListComponent, 
    // EmployeeComponent, 
    // SubjectDemo, 
    // ShareDemoComponent, 
    // RxjsMapDemoComponent,
    RxjsCombinationComponent
  ],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('angular-project');
}
