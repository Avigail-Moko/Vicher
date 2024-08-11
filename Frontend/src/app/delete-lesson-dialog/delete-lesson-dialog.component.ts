import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-lesson-dialog',
  templateUrl: './delete-lesson-dialog.component.html',
  styleUrls: ['./delete-lesson-dialog.component.scss']
})
export class DeleteLessonDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteLessonDialogComponent>){}
  closeDialog(result: boolean): void {
    this.dialogRef.close(result);
  }
}
