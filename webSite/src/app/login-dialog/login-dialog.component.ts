import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NewService } from '../new.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {

myLoginForm:FormGroup;
errorMessage='';

constructor(private http: HttpClient,
  private newService: NewService,
  public dialog: MatDialog,
  private fb: FormBuilder,
  private router: Router) { 
  this.myLoginForm = this.fb.group({
  email: [''],
  password: [''],
});}
 
  onLogin() {
    //במידה ומעוניינים לשלוף פריט אחד מתוך הטופס ניתן להשתמש ב .get 
  //   const email = this.myLoginForm.get('email').value;
    const body = this.myLoginForm.value;
    this.newService.Login(body).subscribe(
      (data) => {
        console.log('Response:', data);

        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userProfile', JSON.stringify(data.user));
        window.dispatchEvent(new Event('userProfileUpdated')); //פותח אירוע כדי שיהיה אפשרות להאזנה במקום אחר 

        this.dialog.closeAll();
        this.router.navigate(['/user-profile']);
      },
      (error) => {
        console.error('Error:', error.error.message);
        this.errorMessage = error.error.message;
      }
    );
  }

email = new FormControl('',[Validators.required]);
password = new FormControl('',[Validators.required]);
apiService: any;

getErrorMessage() {
  if ((this.email.hasError('required')) || (this.password.hasError('required'))) {
    return 'You must enter a value';
  }
return this.email.hasError('email') ? 'Not a valid email' : '';
}
hide = true;
}
