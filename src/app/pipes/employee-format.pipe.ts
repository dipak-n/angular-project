import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'employeeFormat',
  standalone: true
})
export class EmployeeFormatPipe implements PipeTransform {

  transform(name: string): string {
    if (!name) {
      return '';
    }

    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
}


// A custom pipe is used to transform or format data directly in the Angular template. 
// We create it using @Pipe and implement PipeTransform, which requires the transform() method.