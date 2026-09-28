import { Component, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ViewContainerEmployeeCard } from './view-container-employee-card/view-container-employee-card';
import { EmployeeService } from '../../employee.service';

@Component({
  selector: 'view-container-employee',
  standalone: true,
  templateUrl: './view-container-employee.html',
  styleUrl: './view-container-employee.scss',
})
export class ViewContainerEmployee {

  @ViewChild('container', { read: ViewContainerRef })container!: ViewContainerRef;
  componentRef!: ComponentRef<ViewContainerEmployeeCard>;

  constructor( private employeeService: EmployeeService ) { }

  createEmployeeCard(): void {

    this.container.clear();

    this.componentRef = this.container.createComponent(ViewContainerEmployeeCard);

    this.componentRef.setInput(
      'employee',
      this.employeeService.getEmployees(0, 5, '', '', 'asc').subscribe(response => {
        this.componentRef.instance.employee = response.data[0];
        this.componentRef.instance.markForCheck();
        setTimeout(() => {
          this.componentRef.instance['close'].subscribe(() => {
            this.removeEmployeeCard();
          }, 1000);
        }, 0);
      })
    );
  }

  // createEmployeeCard(): void {
  //   this.container.clear();
  //   this.componentRef = this.container.createComponent(ViewContainerEmployeeCard);
  //   this.employeeService.getEmployees(0, 5, '', '', 'asc').subscribe(response => {
  //     this.componentRef.instance.employee = response.data[0];
  //   })
  // }

  removeEmployeeCard(): void {
    this.container.clear();
    this.componentRef?.destroy();
  }

}