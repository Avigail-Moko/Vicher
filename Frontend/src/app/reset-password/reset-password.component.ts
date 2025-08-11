import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewService } from '../new.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  token = '';
  loading = false;
  successMessage = '';
  errorMessage = '';
  hideNewPassword = true;
  hideConfirmPassword = true;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private newService: NewService,
    private router: Router
  ) {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      return;
    }

    const { newPassword, confirmPassword } = this.resetForm.value;
    if (newPassword !== confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.newService.resetPassword(this.token, { newPassword }).subscribe(
      () => {
        this.resetForm.disable();
        this.successMessage =
          'Password updated successfully! Redirecting to the main page...';
        setTimeout(() => this.router.navigate(['/']), 2000);
        this.loading = false;
      },
      (error) => {
        this.errorMessage = error.error.message || 'Failed to reset password';
        this.loading = false;
      }
    );
  }
}
