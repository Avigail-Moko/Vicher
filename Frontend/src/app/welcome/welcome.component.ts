import { Component } from '@angular/core';
import { NewService } from '../new.service';
import { HttpClient } from '@angular/common/http';
import { DailyPlannerComponent } from '../daily-planner/daily-planner.component';
import { MatDialog } from '@angular/material/dialog';
import { Message, MessageService } from 'primeng/api';
import { NavigationExtras, Router } from '@angular/router';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent {
  AllproductsArray: any;
  AllusersArray: any;
  responsiveOptions: any[] | undefined;
  responsiveOptions2: any[] | undefined;
  messages: Message[] | undefined;
  userId = localStorage.getItem('userId');
  usersFlag: any;

  constructor(
    private newService: NewService,
    private http: HttpClient,
    public dialog: MatDialog,
    public messageService: MessageService,
    public router: Router
  ) {}

  objects: any[] | undefined;

  selectedObject: any | undefined;

  filteredObjects: any[] | undefined;

  filterObject(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < (this.objects as any[]).length; i++) {
      let Object = (this.objects as any[])[i];
      if (this.usersFlag) {
        if (Object.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(Object);
        }
      } else if (!this.usersFlag) {
        if (
          Object.lesson_title.toLowerCase().indexOf(query.toLowerCase()) == 0
        ) {
          filtered.push(Object);
        }
      }
    }
    this.filteredObjects = filtered;
  }

  onTextChange(query: string) {
    if (!query) {
      this.filteredObjects = this.objects;
    }
  }

  ngOnInit() {
    this.newService.getAuthStatusListener().subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.userId = localStorage.getItem('userId');
      } else {
        this.userId = null;
      }
    });

    this.responsiveOptions = [
      {
        breakpoint: '1260px',
        numVisible: 3,
        numScroll: 2,
      },
      {
        breakpoint: '1000px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '750px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
    this.responsiveOptions2 = [
      {
        breakpoint: '750px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  openDailyPlanner(product: any) {
    if (this.userId && this.userId != product.userId) {
      const dialogRef = this.dialog.open(DailyPlannerComponent, {
        width: '100vw',
        height: '95%',
        data: {
          product: product,
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
        userProfile: userProfile,
      },
    };
    this.router.navigate(['/user-view'], navigationExtras);
  }
  //sort
  // products = [
  //   { name: 'מוצר 1', price: 100, size: 'S', rating: 4 },
  //   { name: 'מוצר 2', price: 200, size: 'M', rating: 5 },
  //   // עוד מוצרים
  // ];

  // searchTerm: string = '';
  filterType: string = '';

  filterBy(type: string) {
    this.filterType = type;
  }

  // filteredProducts() {
  //   return this.products.filter(product => {
  //     return product.name.includes(this.searchTerm);
  //   }).sort((a, b) => {
  //     if (this.filterType === 'price') return a.price - b.price;
  //     if (this.filterType === 'size') return a.size.localeCompare(b.size);
  //     if (this.filterType === 'rating') return b.rating - a.rating;
  //     return 0;
  //   });
  // }
  getAllUsers() {
    this.newService.getAllUsers().subscribe(
      (data) => {
        this.AllusersArray = data.users;
        this.usersFlag = true;
        this.objects = data.users;
      },
      (error) => {
        console.error('Error:', error.error.message);
      }
    );
  }
  // productsFlag
  getAllProducts() {
    
    this.newService.getAllProduct().subscribe(
      (data) => {
        this.AllproductsArray = data.product;
        this.usersFlag = false;
        this.objects = data.product;
      },
      (error) => {
        console.error('Error:', error.error.message);
      }
    );
  }
}
