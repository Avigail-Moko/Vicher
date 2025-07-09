import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NewService } from '../new.service';
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
})
export class SupportComponent {
  captchaResolved = false;
  errorMessage = '';
  messages: Message[] | undefined;

  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', Validators.required],
  });

  constructor(
    public messageService: MessageService,
    private fb: FormBuilder,
    private http: HttpClient,
    private newService: NewService
  ) {}

  onCaptchaResolved(token: string) {
    this.captchaResolved = !!token;
  }

  onSubmit() {
    if (this.contactForm.invalid || !this.captchaResolved) {
      return;
    }
    const body = this.contactForm.value;
    this.newService.contact(body).subscribe(
      (data) => {
        console.log('Response:', data);
        this.contactForm.reset();
        this.captchaResolved = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Message sent successfully!`,
        });
      },
      (error) => {
        console.error('Error:', error.error.message);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
        this.errorMessage = error.error.message;
      }
    );
  }
}
