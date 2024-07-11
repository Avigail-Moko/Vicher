import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NewService } from '../new.service';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {

myLoginForm:FormGroup;
errorMessage='';
loading: boolean = false;

private usersSubject = new Subject<any[]>();
  users$ = this.usersSubject.asObservable();
  
constructor(private http: HttpClient,
  private newService: NewService,
  public dialog: MatDialog,
  private fb: FormBuilder,
) { 
  this.myLoginForm = this.fb.group({
  email: [''],
  password: [''],
});}
 
  onLogin() {
    if (this.myLoginForm.invalid) {
      return;
    }
    this.loading = true;

    //במידה ומעוניינים לשלוף פריט אחד מתוך הטופס ניתן להשתמש ב .get 
  //   const email = this.myLoginForm.get('email').value;
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
