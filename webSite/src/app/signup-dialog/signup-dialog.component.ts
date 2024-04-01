import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators,FormBuilder, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NewService } from '../new.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-signup-dialog',
  templateUrl: './signup-dialog.component.html',
  styleUrls: ['./signup-dialog.component.scss'],
})
export class SignupDialogComponent {
form: NgForm;
//  @ViewChild("DialogComponent")
myForm: FormGroup;
errorMessage='';
apiService: any;
message='';

//take care of the user details:
constructor(private http: HttpClient,
  private newService: NewService,
  public dialog: MatDialog,
  private fb: FormBuilder,
  private router: Router) { 

    
  this.myForm = this.fb.group({
  name: [''],
  subject:[''],
  seniority:[''],
  email: [''],
  password: [''],
});}

onSignup() {
  const formValues = this.myForm.value; 
  const loginValues={
    email: formValues.email,
    password: formValues.password
  }
  this.newService.Signup(formValues).subscribe(
    (response) => {
      console.log('Response:', response);
      console.log(formValues,loginValues);

      this.newService.Login(loginValues).subscribe(
        (data) => {
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
          console.error('Error:', error.error.message);
          this.errorMessage = error.error.message;
        }
      );

    },
    (error) => {
      console.error('Error:', error.error.message);
      this.errorMessage = error.error.message;
    }
  );
}


//form values validation part:
validationMessages = {
  name: [
    { type: 'required', message: 'שם הוא שדה חובה' },
    { type: 'minlength', message: 'שם צריך להכיל לפחות 2 תווים' }
  ],
  email: [
    { type: 'required', message: 'דוא"ל הוא שדה חובה' },
    { type: 'email', message: 'כתובת דואר אלקטרוני אינה תקינה' },
  ],
  subject:[
    { type: 'required', message: 'תחום לימוד הוא שדה חובה' }
  ],
  seniority:[
    { type: 'required', message: 'שנות נסיון הוא שדה חובה' }
  ],
  password:[
    { type: 'required', message: 'סיסמא הוא שדה חובה' },
    { type: 'minlength', message: 'סיסמא צריכה להכיל לפחות 6 תווים' },
  ]
};

hide = true;
}
