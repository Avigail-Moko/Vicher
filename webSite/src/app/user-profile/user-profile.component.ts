import { Component,OnInit, ViewChild } from '@angular/core';
import { NewService } from '../new.service';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ProductStepperComponent } from '../product-stepper/product-stepper.component';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { ProductsEditDialogComponent } from '../products-edit-dialog/products-edit-dialog.component';
import { Message } from 'primeng/api';
import { MessageService } from 'primeng/api';
import {
  DayPilot,
  DayPilotCalendarComponent,
  DayPilotMonthComponent,
  DayPilotNavigatorComponent
} from "@daypilot/daypilot-lite-angular";
import { DataService } from '../data.service';
import { DeleteItemComponent } from '../delete-item/delete-item.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  providers: [MessageService]

 
})
export class UserProfileComponent  {
  //האם ניתן למחוק משתנה זה?
  // date: Date | undefined;
  value!: number;
  lesson_title: string | undefined;
  category: string | undefined;
  description: string | undefined;
  price: string | undefined;
  _id:any
  productsArray: any;
  userProfile = JSON.parse(localStorage.getItem('userProfile'));
  form:NgForm;
  
isContentEditable = false;
errorMessage='';
message='';
isButtonsVisible: boolean = false;
responsiveOptions: any[] | undefined;



// description: new FormControl('', Validators.maxLength(2)) 

  constructor (private newService:NewService,public dialog: MatDialog,private messageService: MessageService,
    public confirmDialog:MatDialog) {
  }
showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
}
 
openProductStepper() {
  const dialogRef = this.dialog.open(ProductStepperComponent,{
    
    data:{
      displayPart: 'part1' // כאן אתה יכול לקבוע איזה חלק מהקומפוננטה להציג
    }
    
  });
  

  // const dialogRef2 = this.dialog.open(ProductStepperComponent,{
  //   autoFocus: false,
  //     hasBackdrop: false,
  //     // panelClass: 'custom-container', // הוספת קלאס לתיבת הדיאלוג
  //     position: {
  //       bottom: '25px', 
  //       right:`calc(50% - 750px)`,
  //     },
  //     data:{
  //       displayPart: 'part2' // כאן אתה יכול לקבוע איזה חלק מהקומפוננטה להציג
  //     }
  // });

  dialogRef.afterClosed().subscribe(result => {
    // dialogRef2.close();
    console.log(`Dialog result: ${result}`);
  });
}

ngOnInit(){
  this.responsiveOptions = [
    {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1
    },
    {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
    }
];

  const userId=localStorage.getItem('userId');
  this.newService.getProduct(userId).subscribe((data)=>{
    console.log('Response:', data);

    //שמירה לתוך משתנה מערך לוקאלי
    localStorage.setItem('productsArray', JSON.stringify(data.product));
    // localStorage.setItem('product_image', JSON.stringify(data.product_image));
    // const product_image=localStorage.getItem('product_image');

    window.dispatchEvent(new Event('localArrayUpdated'));
    this.productsArray = JSON.parse(localStorage.getItem('productsArray') || '[]');
    // האזנה לאירוע
    window.addEventListener('productsArrayUpdated', () => {
    this.productsArray = JSON.parse(localStorage.getItem('productsArray') || '[]');
    });

    // this.messages = [{ severity: 'success', summary: 'Success', detail: 'Message Content' }];

  },
  (error)=>{
    console.error('Error:',error.error.message);
  })
}

// deleteProduct(_id:any):void{
//     this.newService.deleteProduct(_id).subscribe((data)=>{
//       console.log('_id',_id)
//     console.log('Response:', data);
//     window.location.reload(); // רענון העמוד
//   },
//   (error)=>{
//     console.error('Error:',error.error.message);
//   })
//  }

 
 validationMessages = {
  description: [
    { type: 'maxlength', message: 'שדה התיאור יכול להכיל עד 2 תווים' }
  ],}

  toggleButtonsVisibility() {
    this.isButtonsVisible = !this.isButtonsVisible;
  }

  openProductsEditDialog(product: any,userProfile:any): void {
    
    const dialogRef = this.dialog.open(ProductsEditDialogComponent, {
      width: '300px',
      height: '640px',
      panelClass: 'custom-container', // הוספת קלאס לתיבת הדיאלוג
      data: {
        product: product,
        userProfile: userProfile,
        displayPart: 'part1' 
      }
      
    }); 

    const dialogRef2 = this.dialog.open(ProductsEditDialogComponent, {
      autoFocus: false,
      hasBackdrop: false,
      // panelClass: 'custom-container', // הוספת קלאס לתיבת הדיאלוג
      position: {
        bottom: '25px', 
        right:`calc(50% - 250px)`,
      },
      data: {
        product: product,
        userProfile: userProfile,
        displayPart: 'part2' 
      }
    });

      dialogRef.afterClosed().subscribe(result => {
        dialogRef2.close();
      console.log('The dialog was closed');
    });

  }
// אישור מחיקה
  confirm(product: any){
  const confirmDialog= this.dialog.open(DeleteItemComponent,{
    
    data: { product: product },
    panelClass: 'delete-item-dialog'
  })
 }

}

