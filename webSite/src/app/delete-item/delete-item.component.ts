import { Component, Inject } from '@angular/core';
import { NewService } from '../new.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-item',
  templateUrl: './delete-item.component.html',
  styleUrls: ['./delete-item.component.scss']
})
export class DeleteItemComponent {
product: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private newService: NewService,
  public confirmDialog: MatDialogRef<DeleteItemComponent>){
    this.product = data.product; // השמת הערך שנשלח בפרופרטי product
  }

  deleteProduct(_id:any):void{
    this.newService.deleteProduct(_id).subscribe((data)=>{
      console.log('_id',_id)
    console.log('Response:', data);
    window.location.reload(); // רענון העמוד
  },
  (error)=>{
    console.error('Error:',error.error.message);
  })
 }
 closeDialog():void{
  this.confirmDialog.close();
 }
}
