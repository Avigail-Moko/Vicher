import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-lesson-dialog',
  templateUrl: './delete-lesson-dialog.component.html',
  styleUrls: ['./delete-lesson-dialog.component.scss']
})
export class DeleteLessonDialogComponent {
  lesson:any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<DeleteLessonDialogComponent>,){
    this.lesson=data.lesson
  }
  closeDialog(result: boolean): void {
    this.dialogRef.close(result);
  }
 
}
