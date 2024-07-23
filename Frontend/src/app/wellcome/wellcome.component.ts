import { Component } from '@angular/core';
import { NewService } from '../new.service';
import { HttpClient } from '@angular/common/http';
import { DailyPlannerComponent } from '../daily-planner/daily-planner.component';
import { MatDialog } from '@angular/material/dialog';
import { Message, MessageService } from 'primeng/api';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-wellcome',
  templateUrl: './wellcome.component.html',
  styleUrls: ['./wellcome.component.scss'],
})
export class WellcomeComponent {
  AllproductsArray: any;
  AllusersArray: any;
  responsiveOptions: any[] | undefined;
  responsiveOptions2: any[] | undefined;
  messages: Message[] | undefined;
  userId = localStorage.getItem('userId');
  
  constructor(
    private newService: NewService,
    private http: HttpClient,
    public dialog: MatDialog,
    public messageService: MessageService,
    public router: Router
  ) {}



  ngOnInit() {
    this.newService.getAuthStatusListener().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.userId = localStorage.getItem('userId');
      }else{
        this.userId = null;
      }
    });

    this.newService.getAllProduct().subscribe(
      (data) => {
        console.log('Response:', data);
        this.AllproductsArray = data.product;
      },
      (error) => {
        console.error('Error:', error.error.message);
      }
    );

    this.newService.getAllUsers().subscribe(
      (data) => {
        console.log('Response:', data);
        this.AllusersArray = data.users;
      },
      (error) => {
        console.error('Error:', error.error.message);
      }
    );

    this.responsiveOptions = [
      {
          breakpoint: '1260px',
          numVisible: 3,
          numScroll: 2
      },
            {
          breakpoint: '1000px',
          numVisible: 2,
          numScroll: 1
      },
      {
          breakpoint: '750px',
          numVisible: 1,
          numScroll: 1
      }
  ];
  this.responsiveOptions2 = [
    {
        breakpoint: '750px',
        numVisible: 1,
        numScroll: 1
    }
];

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
  openUserView(userProfile: any[]) {
    const navigationExtras: NavigationExtras = {
      state: {
        exampleData: userProfile,
      },
    };
    this.router.navigate(['/user-view'], navigationExtras);
  }
}
