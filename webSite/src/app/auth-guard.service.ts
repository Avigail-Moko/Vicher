import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NewService } from './new.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(public auth: NewService, public router: Router) { }
  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['']); // אם המשתמש לא מחובר, הפנה אותו לדף ההתחברות
      return false;
    }
    return true;
  }  
}
