import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

import { AuthService } from '../auth.service';

@Directive({
  selector: '[appIfRole]',
  standalone: true
})
export class AppIfRoleDirective {

  private hasView = false;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainerRef: ViewContainerRef,
    private authService: AuthService
  ) {}

  @Input()
  set appIfRole(requiredRole: string) {
    const currentRole = this.authService.getRole();

    if (currentRole === requiredRole && !this.hasView) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (currentRole !== requiredRole && this.hasView) {
      this.viewContainerRef.clear();
      this.hasView = false;
    }
  }
}

// *appIfRole="'ADMIN'"
//         ↓
// @Input() appIfRole
//         ↓
// Get current role from AuthService
//         ↓
// Compare roles
//         ↓
// Role matches?
//    ↓          ↓
//  YES          NO
//    ↓          ↓
// create       clear
// view         view

// A custom structural directive changes the DOM structure by conditionally creating or removing a template. 
// We use TemplateRef to access the template and ViewContainerRef to create or remove its view. 
// The * syntax is Angular's shorthand for using the directive with an underlying ng-template.