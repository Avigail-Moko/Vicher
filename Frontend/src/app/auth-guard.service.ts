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
      this.router.navigate(['']); 
      return false;
    }
    return true;
  }  
}
