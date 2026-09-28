import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private role = 'ADMIN';

  getRole(): string {
    return this.role;
  }
}