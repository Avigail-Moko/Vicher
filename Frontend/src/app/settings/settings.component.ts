import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NewService } from '../new.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  userProfile = JSON.parse(localStorage.getItem('userProfile'));

  userName = this.userProfile.name; // או תביא מהשרת אם צריך
  hideCurrent = true;
  hideNew = true;
  loading: boolean = false;

  usernameForm = this.fb.group({
    username: [this.userName, Validators.required],
  });
  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private newService: NewService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('nameChanged') === 'true') {
      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Name Changed',
          detail: 'Your name has been updated.',
        });
        localStorage.removeItem('nameChanged');
      }, 0);
    }
  }

  onUsernameBlur() {
    const current = this.usernameForm.get('username')?.value;

    if (current === '') {
      this.usernameForm.get('username')?.setValue(this.userProfile.name);
    }
  }

  onChangeUsername() {
    if (this.usernameForm.invalid) return;
    this.loading=true
    const username = this.usernameForm.get('username')?.value;
    const userId = localStorage.getItem('userId');
    console.log(username, userId);
    this.newService.changeUsername(userId, { name: username }).subscribe(
      (response) => {
        this.userProfile.name = response.name;
        this.userProfile.profileImage = response.profileImage;
        localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
        localStorage.setItem('nameChanged', 'true');
        this.loading=false
        window.location.reload(); 
      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message || 'Failed to change name.',
        });
      }
    );
  }
  onChangePassword() {
    if (this.passwordForm.invalid) return;
    const body = this.passwordForm.value;
    const userId = localStorage.getItem('userId');
    this.newService.changePassword(userId, body).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Password Changed',
          detail: 'Your password has been updated.',
        });
        this.passwordForm.reset();
        Object.keys(this.passwordForm.controls).forEach((key) => {
          const control = this.passwordForm.get(key);
          control?.setErrors(null);
          control?.markAsPristine();
          control?.markAsUntouched();
        });
      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message || 'Failed to change password.',
        });
      }
    );
  }

  onDeleteAccount() {
    if (
      !confirm(
        'Are you sure you want to delete your account? This cannot be undone.'
      )
    )
      return;
    const userId = localStorage.getItem('userId');
    this.newService.deleteUser(userId).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Account Deleted',
          detail: 'Your account has been removed.',
        });
        // TODO: ניתוב החוצה, ניתוק מהמערכת וכו'
      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message || 'Failed to delete account.',
        });
      }
    );
  }
}
