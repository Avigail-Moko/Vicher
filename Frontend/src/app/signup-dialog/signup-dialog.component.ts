import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NewService } from '../new.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-signup-dialog',
  templateUrl: './signup-dialog.component.html',
  styleUrls: ['./signup-dialog.component.scss'],
})
export class SignupDialogComponent {
  //  @ViewChild("DialogComponent")
  mySingupForm: FormGroup;
  errorMessage = '';
  loading: boolean = false;

  //take care of the user details:
  constructor(
    private http: HttpClient,
    private newService: NewService,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.mySingupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSignup() {
    if (this.mySingupForm.invalid) {
      return;
    }
    this.loading = true;

    const formValues = this.mySingupForm.value;
    const loginValues = {
      email: formValues.email,
      password: formValues.password,
    };
    this.newService.Signup(formValues).subscribe(
      (response) => {
        console.log('Response:', response);
        console.log(formValues, loginValues);

        this.newService.Login(loginValues).subscribe(
          (data) => {
            this.loading = false;
            console.log('Response:', data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            //המרה למחרוזת ושמירת פרטי המשתמש למשתנה לוקלי
            localStorage.setItem('userProfile', JSON.stringify(data.user));
            window.dispatchEvent(new Event('userProfileUpdated'));
            // this.newService.isAuthenticatedSubject.next(false);
            this.dialog.closeAll();
            // if (response.success) {
            // התחברות מוצלחת, סמן שהמשתמש התחבר
            // this.loggedIn.next(true);
          },
          (error) => {
            this.loading = false;
            console.error('Error:', error.error.message);
            this.errorMessage = error.error.message;
          }
        );
      },
      (error) => {
        this.loading = false;
        console.error('Error:', error.error.message);
        this.errorMessage = error.error.message;
      }
    );
  }

  //form values validation part:
  validationMessages = {
    name: [
      { type: 'required', message: 'Name is required' },
      { type: 'minlength', message: 'Name must be at least 2 characters long' },
    ],
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Invalid email address' },
    ],
    password: [
      { type: 'required', message: 'Password is required' },
      {
        type: 'minlength',
        message: 'Password must be at least 6 characters long',
      },
    ],
  };

  hide = true;
}
