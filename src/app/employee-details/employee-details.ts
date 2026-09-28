import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Employee } from '../employee.model';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  templateUrl: './employee-details.html'
})
export class EmployeeDetailsComponent {

  private route = inject(ActivatedRoute);
  employee = this.route.snapshot.data['employee'] as Employee;
}