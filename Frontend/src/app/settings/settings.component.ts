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
  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  hideCurrent = true;
  hideNew = true;

  constructor(
    private fb: FormBuilder,
    private newService: NewService,
    private messageService: MessageService
  ) {}

  onChangePassword() {
    // if (this.passwordForm.invalid) return;
    // const body = this.passwordForm.value;
    // this.newService.changePassword(body).subscribe(
    //   () => {
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Password Changed',
    //       detail: 'Your password has been updated.'
    //     });
    //     this.passwordForm.reset();
    //   },
    //   (err) => {
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: err.error.message || 'Failed to change password.'
    //     });
    //   }
    // );
  }

  onDeleteAccount() {
    // if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    // this.newService.deleteAccount().subscribe(
    //   () => {
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Account Deleted',
    //       detail: 'Your account has been removed.'
    //     });
    //     // TODO: ניתוב החוצה, ניתוק מהמערכת וכו'
    //   },
    //   (err) => {
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: err.error.message || 'Failed to delete account.'
    //     });
    //   }
    // );
  }
}
