import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-lesson-dialog',
  templateUrl: './delete-lesson-dialog.component.html',
  styleUrls: ['./delete-lesson-dialog.component.scss']
})
export class DeleteLessonDialogComponent {
  userProfile = JSON.parse(localStorage.getItem('userProfile'));
  lesson:any;
  partner: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<DeleteLessonDialogComponent>,){
    this.lesson=data.lesson
  }
  closeDialog(result: boolean): void {
    this.dialogRef.close(result);
  }
  ngOnInit() {
    const teacher_name= this.lesson.teacher_name
    const student_name= this.lesson.student_name
    this.partner=this.userProfile.name===teacher_name?student_name:teacher_name;
  }
}
