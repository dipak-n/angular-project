import {
  Component,
  inject
} from '@angular/core';

import { AsyncPipe } from '@angular/common';

import { ShareService } from '../share-demo.service';

@Component({
  selector: 'app-share-demo',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './share-demo.html'
})
export class ShareDemoComponent {

  private shareService = inject(ShareService);

  // SHARE
  employeesWithShare$ = this.shareService.employeesWithShare$;

  // SHARE REPLAY
  employeesWithReplay$ = this.shareService.employeesWithReplay$;

  // BEHAVIOR SUBJECT
  selectedEmployee$ = this.shareService.selectedEmployee$;
  employeesWithReplay2$ = this.shareService.employeesWithReplay$;

  selectEmployee(): void {
    const employee = {
      id: 1,
      name: 'Dipak',
      email: 'dipak@gmail.com',
      department: 'IT'
    };
    this.shareService .selectEmployee(employee);
  }

}