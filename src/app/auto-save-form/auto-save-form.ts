import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, EMPTY } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError, takeUntil } from 'rxjs/operators';
import { EmployeeService, Employee } from '../auto-save-form.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-auto-save-form',
  templateUrl: './auto-save-form.html',
  styleUrls: ['./auto-save-form.scss'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class AutoSaveFormComponent
  implements OnInit, OnDestroy {

  employeeForm!: FormGroup;
  saveStatus = '';
  private destroy$ = new Subject<void>();


  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService) { }


  ngOnInit(): void {

    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(1000)]]
    });

    this.employeeForm.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged((previous, current) => JSON.stringify(previous) === JSON.stringify(current)),

      tap(() => {
        if (this.employeeForm.valid) {
          this.saveStatus = 'Saving...';
        }
      }),

      switchMap(formValue => {
        if (this.employeeForm.invalid) {
          return EMPTY;
        }

        const employee: Employee = formValue;

        return this.employeeService.saveEmployee(employee).pipe(
          tap(() => {
            this.saveStatus = 'Saved';
          }),
          catchError(error => {
            console.error('Auto-save error:', error);
            this.saveStatus = 'Error while saving';
            return EMPTY;

          })

        );

      }),
      takeUntil(this.destroy$)
    ).subscribe();

  }

  // RESET FORM
  resetForm(): void {
    this.employeeForm.reset({ name: '', email: '', department: '', salary: 0 });
    this.saveStatus = '';

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

// valueChanges
//      ↓
// "What did the user type?"
     
// debounceTime
//      ↓
// "Wait until they stop typing."

// distinctUntilChanged
//      ↓
// "Did the value actually change?"

// switchMap
//      ↓
// "Save the latest value."

// catchError
//      ↓
// "Something went wrong?"

// takeUntil
//      ↓
// "Component closed? Clean up!"

// In an auto-save form, I subscribe to the Reactive Form's valueChanges. 
// I use debounceTime() so the API isn't called for every keystroke, distinctUntilChanged() to avoid duplicate values,
// and switchMap() to save the latest form value through the API. 
// I handle errors with catchError() and clean up the subscription when the component is destroyed.