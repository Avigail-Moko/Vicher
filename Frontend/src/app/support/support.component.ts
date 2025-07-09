import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NewService } from '../new.service';


@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent {
 captchaResolved = false;
  errorMessage = '';

  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', Validators.required],
  });

  constructor(private fb: FormBuilder, private http: HttpClient,private newService: NewService,) {}

  onCaptchaResolved(token: string) {
    this.captchaResolved = !!token;
  }

  onSubmit() {
        if (this.contactForm.invalid|| !this.captchaResolved) {
      return;
    }
      const body = this.contactForm.value;
      this.newService.contact(body).subscribe(
        (data) => {
          console.log('Response:', data);
          this.contactForm.reset();
        },
        (error) => {
          console.error('Error:', error.error.message);
          this.errorMessage = error.error.message;
        }
      );
    }

}