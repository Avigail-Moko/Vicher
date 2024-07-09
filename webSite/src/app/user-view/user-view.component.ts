import { Component } from '@angular/core';
import { NewService } from '../new.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductStepperComponent } from '../product-stepper/product-stepper.component';
import { ProductsEditDialogComponent } from '../products-edit-dialog/products-edit-dialog.component';
import { MessageService } from 'primeng/api';
import { DeleteItemComponent } from '../delete-item/delete-item.component';
import { Router } from '@angular/router';
import { DailyPlannerComponent } from '../daily-planner/daily-planner.component';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent {
 //האם ניתן למחוק משתנה זה?
  // date: Date | undefined;
  value!: number;
  lesson_title: string | undefined;
  category: string | undefined;
  description: string | undefined;
  price: string | undefined;
  productsArray: any;
  // inputValue: string = '';

  // isContentEditable = false;
  // errorMessage = '';
  message = '';
  responsiveOptions: any[] | undefined;
  userProfile:any
  userId = localStorage.getItem('userId');



  constructor(
    private newService: NewService,
    public dialog: MatDialog,
    private messageService: MessageService,
    public confirmDialog: MatDialog,
    public router:Router,
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.userProfile = navigation?.extras.state?.['exampleData'];}
  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Message Content',
    });
  }

 
  ngOnInit() {
    //responsive page
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

   
      this.newService.getProduct(this.userProfile._id).subscribe(
        (data) => {
          console.log('Response:', data);
  
          this.productsArray=data.product
          });
  }

  openDailyPlanner(product: any) {
    if (this.userId && this.userId != product.userId) {
      const dialogRef = this.dialog.open(DailyPlannerComponent, {
        // width: '95%',
        // height: '650px',
        data: {
          product: product
        },
      });

      dialogRef.componentInstance.dialogClosed.subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Your Lesson's details have saved successfully! An email will sent to you in a few minutes.`,
        });
      });
    } else if (!this.userId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention!',
        detail: `Before dating a lesson, you must first log in. Please log in to proceed with dating a lesson.`,
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Attention!',
        detail: `There is no option to date a lesson to your own products.`,
      });
    }
  }
  
  }
