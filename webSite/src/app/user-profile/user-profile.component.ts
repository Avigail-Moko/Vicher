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
  value!: number;
  productsArray: any;
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
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1,
      },
    ];

    this.userProfile = JSON.parse(localStorage.getItem('userProfile'));
    this.inputValue = this.userProfile.description;


    const userId = localStorage.getItem('userId');
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

  toggleButtonsVisibility() {
    this.isButtonsVisible = !this.isButtonsVisible;
  }

  openProductsEditDialog(product: any, userProfile: any): void {
    const dialogRef = this.dialog.open(ProductsEditDialogComponent, {
      width: '300px',
      height: '640px',
      panelClass: 'custom-container', // הוספת קלאס לתיבת הדיאלוג
      data: {
        product: product,
        userProfile: userProfile,
        displayPart: 'part1',
      },
    });

    const dialogRef2 = this.dialog.open(ProductsEditDialogComponent, {
      autoFocus: false,
      hasBackdrop: false,
      // panelClass: 'custom-container', // הוספת קלאס לתיבת הדיאלוג
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
      console.log('The dialog was closed');
    });
  }
  // אישור מחיקה
  confirm(product: any) {
    this.dialog.open(DeleteItemComponent, {
      data: { product: product },
      panelClass: 'delete-item-dialog',
    });
  }
  save() {
    const data = { description: this.inputValue };
    const userId = localStorage.getItem('userId');
    this.newService.updateDescription(userId, data).subscribe(
      (response) => {

        this.userProfile.description = this.inputValue;
        localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
        
        this.editUserProfile=false
        console.log('Data updated', response);
      },
      (error) => {
        this.editUserProfile=false
        console.error('Error updating data', error);
      }
    );
  }
}
