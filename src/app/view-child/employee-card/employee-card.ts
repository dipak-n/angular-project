import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-employee-card',
  standalone: true,
  templateUrl: './employee-card.html',
  styleUrl: './employee-card.scss'
})
export class EmployeeCardComponent {
  [x: string]: any;

  @Input() employee!: any;

  highlight(): void {
    console.log(`Employee highlighted: ${this.employee.name}`);
  }

}