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
  partner_id:any;
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
    this.userProfile = navigation?.extras.state?.['userProfile'];
    this.partner_id = navigation?.extras.state?.['partner_id'];}
  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Message Content',
    });
  }

 
  ngOnInit() {

    const profilePromise = new Promise<void>((resolve, reject) => {
      if (!this.userProfile && this.partner_id) {
        this.newService.getProfile(this.partner_id).subscribe(
          (data) => {
            this.userProfile = data.user;
            this.rating = this.userProfile.avgRating;
            resolve();
          },
          (error) => {
            console.error('Error:', error.error.message);
            reject(error);
          }
        );
      } else {
        resolve(); 
      }
    });
  
    profilePromise.then(() => {
      if (this.userProfile) {
        this.rating = this.userProfile.avgRating;
        this.newService.getProduct(this.userProfile._id).subscribe(
          (data) => {
            this.productsArray = data.product;
          },
          (error) => {
            console.error('Error:', error.error.message);
          }
        );
      } else {
        console.error('UserProfile is not available');
      }
    }).catch((error) => {
      console.error('Profile fetch failed:', error);
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
          detail: `Your Lesson's details have saved successfully! You can view all the details in your calendar. Please pay attention to the notification box.`,
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
