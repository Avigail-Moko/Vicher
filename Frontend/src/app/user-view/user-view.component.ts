import { Component } from '@angular/core';
import { NewService } from '../new.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { DailyPlannerComponent } from '../daily-planner/daily-planner.component';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent {
  rating!: number;
  lesson_title: string | undefined;
  category: string | undefined;
  description: string | undefined;
  price: string | undefined;
  productsArray: any[] = []; 

  message = '';
  responsiveOptions: any[] | undefined;
  userProfile:any
  userId = localStorage.getItem('userId');
  raterCounter:any;


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

    // this.rating = Math.round(this.userProfile.totalRating/this.userProfile.raterCounter);
    this.newService.getRating(this.userId).subscribe((data) => {
      this.rating=data.avgRating
      this.raterCounter=data.raterCounter
      console.log('Response:', this.rating);
    });

    this.responsiveOptions = [
      {
          breakpoint: '1430px',
          numVisible: 2,
          numScroll: 1
      },
      {
          breakpoint: '1170px',
          numVisible: 1,
          numScroll: 1
      }
  ];

   
      this.newService.getProduct(this.userProfile._id).subscribe(
        (data) => {
          console.log('Response:', data);
  
          this.productsArray=data.product
        },
        (error) => {
          console.error('Error:', error.error.message);
        });
  }

  openDailyPlanner(product: any) {
    if (this.userId && this.userId != product.userId) {
      const dialogRef = this.dialog.open(DailyPlannerComponent, {

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
