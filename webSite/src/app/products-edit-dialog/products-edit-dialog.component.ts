import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewService } from '../new.service';

@Component({
  selector: 'app-products-edit-dialog',
  templateUrl: './products-edit-dialog.component.html',
  styleUrls: ['./products-edit-dialog.component.scss'],
  
})
export class ProductsEditDialogComponent {
  // @Input() product: any; // Input property to receive product data
  // @Input() userProfile: any; // Input property to receive product data
  
  product: any;
  userProfile: any;
  isClickedOutside: any;
  displayPart: any;
  length :number;
  productsForm:FormGroup;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private newService:NewService,private pf:FormBuilder) {

    this.displayPart = data.displayPart; // השמה של ערך המשתנה שהועבר דרך ה-DATA
    this.product = data.product; // Assign received data to product property
    this.userProfile = data.userProfile;

    this.productsForm=this.pf.group({
      lesson_title:[''],
      category:[' '],
      price:[' '],
      length:[null],
      description:[' ']
    })
  }
  onRadioChange(value:number){
    this.productsForm.controls['length'].setValue(value);
        console.log(this.productsForm);
  }

  saveChanges(_id:any){
    const productsForm = this.productsForm.value;   

    this.newService.updateProduct(_id,productsForm).subscribe((data)=>{
      console.log('Response:', data);
      console.log(productsForm);
      window.location.reload(); // רענון העמוד
    },
    (error) => {
      console.error('Error:', error.error.message);
    })
  }
  // updateProduct(_id:any){
  //   const productsForm = this.productsForm.value; 
  //   this.newService.updateProduct(_id,productsForm).subscribe((data)=>{
  //     console.log('Response:', data);
  //     console.log(productsForm);
  //     window.location.reload(); // רענון העמוד
  //   },
  //   (error) => {
  //     console.error('Error:', error.error.message);
  //   })
  //  }
}
