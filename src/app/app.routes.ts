import { Routes } from '@angular/router';
import { employeeResolver } from './resolver/employee.resolver';
import { unsavedChangesGuard } from '../guards/unsaved-changes.guard';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () =>
            import('../app/Dynamic-Component-Creation/view-container-employee/view-container-employee').then(m => m.ViewContainerEmployee)
    },
    {
        path: 'employees/:id',
        loadComponent: () => import('../app/employee-details/employee-details').then(m => m.EmployeeDetailsComponent),
        resolve: {
            employee: employeeResolver
        }
    },
    {
        path: 'employees',
        loadComponent: () => import('../app/employee/employee.component').then(m => m.EmployeeComponent),
        canDeactivate: [unsavedChangesGuard]
    },
    {
        path: 'file-upload',
        loadComponent: () => import('../app/file-upload/file-upload').then(m => m.FileUploadComponent),
    },

];

// | `loadComponent`                     | `loadChildren`               |
// | ----------------------------------- | ---------------------------- |
// | Lazy-loads one standalone component | Lazy-loads a group of routes |
// | Good for individual pages           | Good for feature areas       |
// | Simple                              | Better for larger features   |

// Lazy loading in Angular means loading a component or feature only when the user navigates to it instead of loading everything during application startup. 
// In modern standalone Angular applications, we commonly use loadComponent for individual components and loadChildren for lazy-loaded route configurations.

// loadComponent → one component
// loadChildren → feature/routes