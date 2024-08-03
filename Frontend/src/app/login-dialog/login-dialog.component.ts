import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewService } from '../new.service';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
})
export class LoginDialogComponent {
  myLoginForm: FormGroup;
  errorMessage = '';
  loading: boolean = false;

  private usersSubject = new Subject<any[]>();
  users$ = this.usersSubject.asObservable();

  constructor(
    private newService: NewService,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.myLoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onLogin() {
    if (this.myLoginForm.invalid) {
      return;
    }
    this.loading = true;

    const body = this.myLoginForm.value;
    this.newService.Login(body).subscribe(
      (data) => {
        console.log('Response:', data);
        this.loading = false;
        this.dialog.closeAll();
        // this.router.navigate(['/user-profile']);
      },
      (error) => {
        console.error('Error:', error.error.message);
        this.errorMessage = error.error.message;
        this.loading = false;
      }
    );
  }

  validationMessages = {
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Invalid email address' },
    ],
    password: [{ type: 'required', message: 'Password is required' }],
  };

  hide = true;
}
