import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewService } from '../new.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';

@Component({
  selector: 'app-forgot-password-dialog',
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.scss'],
})
export class ForgotPasswordDialogComponent {
  forgotPasswordForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private newService: NewService,
    private messageService: MessageService,
    public dialog: MatDialog
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    this.loading = true;
    this.errorMessage = '';

    this.newService
      .sendResetPasswordLink(this.forgotPasswordForm.value)
      .subscribe(
        () => {
          this.forgotPasswordForm.disable();
          this.messageService.add({
            severity: 'info',
            summary: 'Check your email',
            detail: 'We sent you a link to reset your password.',
          });
          this.loading = false;
        },
        (error) => {
          console.error('Error response:', error);
          this.forgotPasswordForm.disable();
          this.errorMessage = error.error.message || error.error || 'Failed to send reset link.';
          this.loading = false;
        }
      );
  }

  closeDialog() {
    this.dialog.closeAll();
    this.dialog.open(LoginDialogComponent, {
      width: '280px',
    });
  }
}
