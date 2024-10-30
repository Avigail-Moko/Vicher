import { Component } from '@angular/core';
import { NewService } from '../new.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductStepperComponent } from '../product-stepper/product-stepper.component';
import { ProductsEditDialogComponent } from '../products-edit-dialog/products-edit-dialog.component';
import { MessageService } from 'primeng/api';
import { DeleteItemComponent } from '../delete-item/delete-item.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  providers: [MessageService],
})
export class UserProfileComponent {
  rating!: number;
  raterCounter:any;
  productsArray: any[] = [];
  userProfile: any;
  inputValue: string = '';
  message = '';
  isButtonsVisible: boolean = false;
  editUserProfile: boolean = false;
  responsiveOptions: any[] | undefined;
  
  constructor(
    private newService: NewService,
    public dialog: MatDialog,
    private messageService: MessageService,
    public confirmDialog: MatDialog
  ) {}
  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Message Content',
    });
  }

  openProductStepper() {
    const dialogRef = this.dialog.open(ProductStepperComponent, {
      data: {
        displayPart: 'part1',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {
    this.responsiveOptions = [
      {
          breakpoint: '1430px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '1170px',
          numVisible: 1,
          numScroll: 1
      }
  ];

    const userId = localStorage.getItem('userId');
    this.userProfile = JSON.parse(localStorage.getItem('userProfile'));
    this.inputValue = this.userProfile.description;

    this.newService.getRating(userId).subscribe((data) => {
      this.rating=data.avgRating
      this.raterCounter=data.raterCounter
      console.log('Response:', this.rating);
    });

    this.newService.getProduct(userId).subscribe(
      (data) => {
        console.log('Response:', data);
        this.productsArray = data.product;
      },
      (error) => {
        console.error('Error:', error.error.message);
      }
    );
  }

  validationMessages = {
    description: [
      { type: 'maxlength', message: 'שדה התיאור יכול להכיל עד 2 תווים' },
    ],
  };


  onDivMouseDown(event: MouseEvent): void {
    if (this.isButtonsVisible) {
      event.preventDefault();
    }
  }
  openProductsEditDialog(product: any, userProfile: any): void {
    const dialogRef = this.dialog.open(ProductsEditDialogComponent, {
      width: '300px',
      height: '640px',
      panelClass: 'custom-container', 
      data: {
        product: product,
        userProfile: userProfile,
        displayPart: 'part1',
      },
    });

    const dialogRef2 = this.dialog.open(ProductsEditDialogComponent, {
      autoFocus: false,
      hasBackdrop: false,
      position: {
        bottom: '25px',
        right: `calc(50% - 250px)`,
      },
      data: {
        product: product,
        userProfile: userProfile,
        displayPart: 'part2',
      },
    });

  

    dialogRef.afterClosed().subscribe((result) => {
      dialogRef2.close();
      this.isButtonsVisible=true
      console.log('The dialog was closed1');
      window.location.reload();   
    });
  }
  // אישור מחיקה
  confirm(product: any) {
    const dialog = this.dialog.open(DeleteItemComponent, {
      data: { product: product },
      panelClass: 'delete-item-dialog',

    });
    dialog.afterClosed().subscribe((result) => {
      dialog.close();
      this.isButtonsVisible=true
      console.log('The dialog was closed2');
    });
  }
  save() {
    const data = { description: this.inputValue };
    const userId = localStorage.getItem('userId');
    this.newService.updateDescription(userId, data).subscribe(
      (response) => {
        this.userProfile.description = this.inputValue;
        localStorage.setItem('userProfile', JSON.stringify(this.userProfile));

        this.editUserProfile = false;
        console.log('Data updated', response);
      },
      (error) => {
        this.editUserProfile = false;
        console.error('Error updating data', error);
      }
    );
  }
}
