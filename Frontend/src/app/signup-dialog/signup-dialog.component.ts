import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NewService } from '../new.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-signup-dialog',
  templateUrl: './signup-dialog.component.html',
  styleUrls: ['./signup-dialog.component.scss'],
})
export class SignupDialogComponent {
  mySingupForm: FormGroup;
  errorMessage = '';
  loading: boolean = false;

  constructor(
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
    // const loginValues = {
    //   email: formValues.email,
    //   password: formValues.password,
    // };
    this.newService.Signup(formValues).subscribe(
      (response) => {
        console.log('Response:', response);
        // console.log(formValues, loginValues);
      this.loading = false;
      this.dialog.closeAll();
      alert('Registration successful. Please check your email to verify your account.');
      },
      (error) => {
        this.loading = false;
        console.error('Error:', error.error.message);
        this.errorMessage = error.error.message;
      }
    );
  }

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
