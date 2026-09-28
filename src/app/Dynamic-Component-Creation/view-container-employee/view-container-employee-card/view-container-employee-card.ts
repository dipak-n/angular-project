import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output
} from '@angular/core';

import { Employee } from '../../../employee.model';

@Component({
  selector: 'view-container-employee-card',
  standalone: true,
  templateUrl: './view-container-employee-card.html',
  styleUrl: './view-container-employee-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewContainerEmployeeCard {

  @Input() employee!: Employee;
  @Output() close = new EventEmitter<void>();
  private cdr = inject(ChangeDetectorRef);

  selectEmployee(): void {
    console.log('Selected employee:', this.employee.name);
  }

  closeCard(): void {
    this.close.emit();
  }

  markForCheck(): void {
    this.cdr.markForCheck();
  }

}

// Click Create
//      ↓
// ViewContainerRef
//      ↓
// createComponent()
//      ↓
// EmployeeCardComponent created
//      ↓
// Pass employee data
//      ↓
// User clicks Close
//      ↓
// @Output() close.emit()
//      ↓
// Parent receives event
//      ↓
// componentRef.destroy()

// Dynamic component creation means creating an Angular component 
// programmatically at runtime using ViewContainerRef.createComponent() instead of declaring it directly in the template.

// TemplateRef = what to show
// ViewContainerRef = where/how to show or remove it.