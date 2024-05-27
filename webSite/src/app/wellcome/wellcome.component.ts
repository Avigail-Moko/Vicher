import { Component } from '@angular/core';
import { NewService } from '../new.service';
import { DataViewModule } from 'primeng/dataview';
import { HttpClient } from '@angular/common/http';
import { CalendarComponent } from '../calendar/calendar.component';
import { DailyPlannerComponent } from '../daily-planner/daily-planner.component';
import { MatDialog } from '@angular/material/dialog';
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-wellcome',
  templateUrl: './wellcome.component.html',
  styleUrls: ['./wellcome.component.scss'],
})
export class WellcomeComponent {
  AllproductsArray: any;
  responsiveOptions: any[] | undefined;
  messages: Message[] | undefined;
  userId = localStorage.getItem('userId');

  constructor(
    private newService: NewService,
    private http: HttpClient,
    public dialog: MatDialog,
    public messageService: MessageService
  ) {}

  // product: any[] = [];
  // productsArray: any;

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

    // this.newService.getAllProduct().subscribe(
    //   (data) => {
    //     this.product = data['product']; // אני מניח פה שהמידע מתקבל בתוך אובייקט והמערך נמצא ב- data.users
    //     console.log('product:', data); // לשים לב - כאן אני מדפיס את הנתונים שחזרו מהשרת לקונסולה

    //     window.dispatchEvent(new Event('localArrayUpdated'));
    //     this.productsArray = JSON.parse(localStorage.getItem('productsArray') || '[]');
    //     // האזנה לאירוע
    //     window.addEventListener('productsArrayUpdated', () => {
    //     this.productsArray = JSON.parse(localStorage.getItem('productsArray') || '[]');
    //     });
    //   },
    //   (error) => {
    //     console.error('Error:', error);
    //   }
    // );
    this.newService.getAllProduct().subscribe(
      (data) => {
        console.log('Response:', data);

        //שמירה לתוך משתנה מערך לוקאלי
        localStorage.setItem('AllproductsArray', JSON.stringify(data.product));
        // localStorage.setItem('product_image', JSON.stringify(data.product_image));
        // const product_image=localStorage.getItem('product_image');

        window.dispatchEvent(new Event('localArrayUpdated'));
        this.AllproductsArray = JSON.parse(
          localStorage.getItem('AllproductsArray') || '[]'
        );
        // האזנה לאירוע
        window.addEventListener('AllproductsArrayUpdated', () => {
          this.AllproductsArray = JSON.parse(
            localStorage.getItem('AllproductsArray') || '[]'
          );
        });

        // this.messages = [{ severity: 'success', summary: 'Success', detail: 'Message Content' }];
      },
      (error) => {
        console.error('Error:', error.error.message);
      }
    );
  }

  dailyPlanner(product: any) {
    if (this.userId != product.userId) {
      const dialogRef = this.dialog.open(DailyPlannerComponent, {
        width: '650px',
        height: '650px',
        data: {
          product: product,
          padding: '3px',
        },
        panelClass: 'daily-planner', // הוספת קלאס לסגנון נוסף
      });

      dialogRef.componentInstance.dialogClosed.subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Your Lesson's details have saved successfully! An email will sent to you in a few minutes.`,
        });
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
