import { ChangeDetectorRef, Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee.model';
import { DataTableComponent, TableColumn, SortEvent } from '../shared/data-table/data-table';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError, finalize } from 'rxjs/operators';
import { forkJoin, combineLatest, BehaviorSubject, Subject, Subscription, of, from, retry } from 'rxjs';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [ReactiveFormsModule, DataTableComponent],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
})
export class EmployeeComponent implements OnInit {

  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  // private dataTable = inject(DataTableComponent);
  // public cdr = Inject(ChangeDetectorRef);
  constructor(public cdr: ChangeDetectorRef) {

  }

  employees: Employee[] = [];
  departments: string[] = [];
  isLoading = false;
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  totalRecords = 0;
  searchValue = '';
  sortColumn = '';

  sortDirection: 'asc' | 'desc' = 'asc';
  isEditMode = false;
  isModalOpen = false;
  selectedEmployeeId: number | null = null;


  employeeForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    department: ['', Validators.required]
  });

  employeeColumns: TableColumn<Employee>[] = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'department', header: 'Department' }
  ];

  private searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;

  ngOnInit(): void {
    this.loadEmployees();
    this.searchEmployee();
  }

  // loadEmployees API 
  loadEmployees(): void {
    this.isLoading = true;
    this.employeeService.getEmployees(this.currentPage, this.pageSize, this.searchValue, this.sortColumn, this.sortDirection)
    .pipe(retry(2), finalize(() => {this.isLoading = false;}))
    .subscribe({
      next: (response) => {
        // console.log('Before:', this.employees);
        this.employees = [...response.data];
        // console.log('After:', this.employees);
        this.totalPages = response.pages;
        this.totalRecords = response.items;
        this.isLoading = false;
        this.employeeService.employeesSubject.next(response.data);
        // this.employeeService.replaySubject.next(response.data);
        // this.dataTable.changeDetection();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Failed to load employees', error);
        this.isLoading = false;
      }

    });

  }

  searchEmployee(): void {
    this.searchSubscription = this.searchSubject.pipe(debounceTime(300), distinctUntilChanged(),
      tap((search: any) => {
        this.searchValue = search;
        this.currentPage = 1;
        this.isLoading = true;
      }),
      // 3. switchMap automatically cancels previous pending HTTP requests if a new one comes in
      switchMap((search: any) => this.employeeService.getEmployees(this.currentPage, this.pageSize, this.searchValue, this.sortColumn, this.sortDirection))).subscribe({
      next: (response: any) => {
        // console.log('Before:', this.employees);
        this.employees = [...response.data];
        // console.log('After:', this.employees);
        this.totalPages = response.pages;
        this.totalRecords = response.items;
        this.employeeService.employeesSubject.next(response.data);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      
      error: (err: any) => {
        console.error('Search failed', err);
        this.isLoading = false;
        return of({ data: [], pages: 0, items: 0, first: 1, prev: null, next: null, last: 1 });
      },
    });
  }

  // 4. Triggered from your search input event
  onSearch(search: string): void {
    this.searchSubject.next(search); // Push value into the stream
  }

  ngOnDestroy() {
    // Clean up subscription to prevent memory leaks
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  // SORT
  onSort(event: SortEvent): void {
    this.sortColumn = event.column;
    this.sortDirection = event.direction;
    this.currentPage = 1;
    this.loadEmployees();

  }


  // PAGE CHANGE
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadEmployees();

  }


  // ADD / UPDATE
  saveEmployee(): void {

    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;

    }

    const formValue = this.employeeForm.getRawValue();

    // UPDATE
    if (this.isEditMode && this.selectedEmployeeId !== null) {

      const employee: Employee = {
        id: this.selectedEmployeeId,
        name: formValue.name!,
        email: formValue.email!,
        department: formValue.department!
      };


      this.employeeService.updateEmployee(employee).subscribe({
        next: () => {
          this.resetForm();
          this.loadEmployees();
        }, error: (error) => {
          console.error('Update failed', error);
        }

      });
    }

    // ADD

    else {
      const employee = {
        name: formValue.name!,
        email: formValue.email!,
        department: formValue.department!
      };

      this.employeeService.addEmployee(employee).subscribe({
        next: () => {
          this.resetForm();
          this.loadEmployees();
        }, error: (error) => {
          console.error('Add failed', error);
        }
      });
    }

  }


  // EDIT

  editEmployee(employee: Employee): void {
    this.isEditMode = true;
    this.selectedEmployeeId = employee.id;
    this.isModalOpen = true;
    this.employeeForm.patchValue({
      name: employee.name,
      email: employee.email,
      department: employee.department
    });

  }

  // DELETE
  deleteEmployee(employee: Employee): void {
    let id = employee.id;
    if (!confirm('Are you sure you want to delete this employee?')) {
      return;
    }
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.loadEmployees();
      }, error: (error) => {
        console.error('Delete failed', error);
      }
    });

  }

  // RESET
  resetForm(): void {
    this.employeeForm.reset();
    this.isEditMode = false;
    this.selectedEmployeeId = null;
    this.isModalOpen = false;

  }


  // Initialize Reactive Form with Validators
  initForm() {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required]
    });
  }

  // Open modal for Creating a new employee
  openAddModal() {
    this.isEditMode = false;
    this.selectedEmployeeId = null;
    this.employeeForm.reset();
    this.isModalOpen = true;
  }


  // Fork join example calling to apis at same time to get the details
  loadInitialData(): void {
    forkJoin({
      employees: this.employeeService.getEmployees(1, 100, '', '', 'asc'),
      departments: this.employeeService.getDepartments()
    }).subscribe({
      next: (response) => {
        this.employees = response.employees.data;
        this.departments = response.departments;
        console.log('Employees:', this.employees);
        console.log('Departments:', this.departments);
      },
      error: (error) => {
        console.error('Failed to load data:', error);
      }
    });
  }

  //combine latest service is used for to get data for all the subject and use when they are called use existing data 
  setupFiltering(): void {
    combineLatest([
      this.employeeService.getEmployees( 1, 100, '', '', 'asc' ),
      this.searchSubject]).subscribe({
      next: ([response, search]) => {
        const employees = response.data;
        this.employees = employees.filter(employee => employee.name.toLowerCase().includes(search.toLowerCase()));
      },
      error: (error) => {
        console.error(error);
      }

    });
  }

  // switchMap → Cancel old, keep latest
  // mergeMap → Merge all, keep all
  // concatMap → Queue and execute one-by-one
  // exhaustMap → Ignore new until current finishes


}