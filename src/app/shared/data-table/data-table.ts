import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, EventEmitter, inject, Inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../employee.service';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Employee } from '../../employee.model';

export interface TableColumn<T> { key: keyof Employee; header: string; }
export interface SortEvent {
  column: string;
  direction: 'asc' | 'desc';

}


@Component({

  selector: 'app-data-table',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class DataTableComponent<T> {

  constructor(public cdr: ChangeDetectorRef, public employeeService: EmployeeService) {

    this.employees$ = this.employeeService.employees$; // async pipe subscribes automatically, receives emitted values, updates the template, 
    // So you don't manually manage the subscription, unsubscribes automatically when the component is destroyed.
  }

  private subscription!: Subscription;
  private destroy$ = new Subject<void>();
  private destroyRef = inject(DestroyRef);

  employees$: Observable<Employee[]>;
  @Input() columns: TableColumn<T>[] = [];
  @Input() data: T[] = [];
  @Input() pageSize = 5;
  @Input() currentPage = 1;
  @Input() totalPages = 0;
  @Input() totalRecords = 0;
  @Input() loading = false;

  @Output() search = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<SortEvent>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() edit = new EventEmitter<Employee>();
  @Output() deleteEmit = new EventEmitter<any>();
  @Output() openAddModal = new EventEmitter<any>();

  searchTerm = '';

  ngOnInit(): void {

    // Get the date by using the BehaviorSubject by using as asObservable() when any change for the value it will be subscribed and we will get the data
    this.subscription = this.employeeService.employees$
    .pipe(
      takeUntil(this.destroy$), //takeUntil() allows us to automatically stop a subscription when another Observable emits.
      takeUntilDestroyed(this.destroyRef) // It automatically handles cleanup when the Angular component/directive/service is destroyed.
    )
    
    .subscribe((employees: any) => { //when a component is destroyed, we often need to clean up subscriptions.
      this.data = employees;
    });
  }

  onSearch(): void {
    this.search.emit(
      this.searchTerm.trim()
    );
  }

  
  // SORT
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    }

    else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortChange.emit({
      column: this.sortColumn,
      direction: this.sortDirection
    });

  }


  // PAGINATION
  previousPage(): void {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }

  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }

  get pages(): number[] {
    return Array.from({length: this.totalPages}, (_, index) =>  index + 1);
  }

  getValue(row: Employee,key: keyof Employee): unknown {
    return row[key];
  }

  changeDetection() {
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();  //If employees$ continues emitting after the component is destroyed, the subscription can remain active.
    this.destroy$.next();
    this.destroy$.complete();
  }
}