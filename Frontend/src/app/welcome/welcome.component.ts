import { Component } from '@angular/core';
import { NewService } from '../new.service';
import { DailyPlannerComponent } from '../daily-planner/daily-planner.component';
import { MatDialog } from '@angular/material/dialog';
import { Message, MessageService } from 'primeng/api';
import { NavigationExtras, Router } from '@angular/router';
import {NgxPaginationModule} from 'ngx-pagination';
import { combineLatest, map } from 'rxjs';


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

  messages: Message[] | undefined;
  userId = localStorage.getItem('userId');
  usersFlag: boolean=true;
  searchLabel:any;
  isLoading: boolean = false;  // Declare the isLoading property
  p: number = 1;
  panelOpenState = false;
  category_name:any;
  categories:any[]=[];
  products: any[] = [];
  filteredCategories: any[] = [];
  filteredProducts: any[] = [];
  objects: any[] | undefined;
  selectedObject: any | undefined;
  filteredObjects: any[] | undefined;


  constructor(
    private newService: NewService,
    public dialog: MatDialog,
    public messageService: MessageService,
    public router: Router
  ) {}


  filterObject(event: AutoCompleteCompleteEvent) {
    const query = event.query;

    this.filteredObjects = (this.objects as any[]).filter(obj => 
      this.usersFlag
        ? obj.name.toLowerCase().indexOf(query.toLowerCase()) === 0
        : obj.category.toLowerCase().indexOf(query.toLowerCase()) === 0
    );
  }

  onTextChange(query: string) {
    if (!query) {
      this.filteredObjects = this.objects;
    }
  }
  onObjectSelect(selectedObject: any) {
    this.filteredObjects = [selectedObject];
  }

  ngOnInit() {
    this.loadCategoriesAndProducts();
    this.getAllUsers();
    this.newService.getAuthStatusListener().subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.userId = localStorage.getItem('userId');
      } else {
        this.userId = null;
      }
    });

   
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
        this.usersFlag = true;
        this.objects = data.users;
        this.searchLabel='search for users by name';
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
        this.usersFlag = false;
        this.objects = data.product;
        this.searchLabel='Search for products by category';
      },
      (error) => {
        console.error('Error:', error.error.message);
      }
    );
  }

getCategory(){
  this.newService.getCategory().subscribe((data)=>{
    this.categories = data.Categories;
       
  },
  (error) => {
        console.error('Error:', error.error.message);
      }) 
}


loadCategoriesAndProducts() {
  combineLatest([this.newService.getCategory(), this.newService.getAllProduct()])
    .pipe(
      map(([categoryResponse, productResponse]) => {
        const categories = categoryResponse.Categories;
        const products = productResponse.product 

        console.log('Raw categories data:', categories); // בדוק את הנתונים שמתקבלים
        if (!Array.isArray(categories)) {
          console.error('Categories is not an array:', categories);
          return;
        }

        if (!Array.isArray(products)) {
          console.error('Products is not an array:', products);
          return;
        }

        this.products = products;
        console.log('Loaded products:', products);  // בדיקה אם המוצרים נטענים
        
        // סינון הקטגוריות בהתבסס על המוצרים הזמינים
        this.filteredCategories = categories.filter((category: any) =>
          products.some((product: any) => product.category === category.name)
        );
        console.log('Filtered categories:', this.filteredCategories);  // בדיקה אם הקטגוריות סוננו

      })
    )
    .subscribe(     () => {
      console.log('Data loading complete');
    },
    (error) => {
      console.error('Error loading data:', error);  // בדיקת שגיאות בטעינת הנתונים
    });
}
getColumnClass(): string {
  if (this.filteredCategories.length % 2 === 0) {
    return 'col-4 m-1'; 
  } else {
    return 'col-3 m-1'; 
  }
}


// onScroll() {
//   this.loadMoreProducts();
// }



}
