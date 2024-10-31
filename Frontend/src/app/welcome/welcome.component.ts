import { Component } from '@angular/core';
import { NewService } from '../new.service';
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

  messages: Message[] | undefined;
  userId = localStorage.getItem('userId');
  usersFlag: boolean=true;
  searchLabel:any;
  // isLoading: boolean = false;  // Declare the isLoading property
  p: number = 1;
  // panelOpenState = false;
  // category_name:any;
  // categories:any[]=[];
  // products: any[] = [];
  filteredCategories: any[] = [];
  // filteredProducts: any[] = [];
  objects: any[] | undefined;
  selectedObject: any | undefined;
  filteredObjects: any[] | undefined;
  selectedCategories: string[] = [];



  constructor(
    private newService: NewService,
    public dialog: MatDialog,
    public messageService: MessageService,
    public router: Router
  ) {}


  filterObject(event: AutoCompleteCompleteEvent) {
    const query = event.query;
  
    this.filteredObjects = (this.objects as any[]).filter(obj => {
      const matchesCategory = this.selectedCategories.length === 0 || this.selectedCategories.includes(obj.category);
      const matchesQuery = this.usersFlag
        ? obj.name.toLowerCase().startsWith(query.toLowerCase())
        : obj.lesson_title.toLowerCase().startsWith(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }
  

  onTextChange(query: string) {
    if (!query) {
      if (this.selectedCategories.length) {
        this.filteredObjects = this.objects?.filter(obj =>
          this.selectedCategories.includes(obj.category)
        ) || [];
      } else {
        this.filteredObjects = this.objects;
      }
    }
  }
  onObjectSelect(selectedObject: any) {
    this.filteredObjects = [selectedObject];
  }

  ngOnInit() {
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

  getAllUsers() {
    this.newService.getAllUsers().subscribe(
      (data) => {
        this.usersFlag = true;
        this.objects = data.users;
        this.filteredObjects = data.users;
        this.searchLabel='search users by name';
      },
      (error) => {
        console.error('Error:', error.error.message);
      }
    );
  }

  getAllProducts() {
    
    this.newService.getAllProduct().subscribe(
      (data) => {
        this.usersFlag = false;
        this.objects = data.product;
        this.filteredObjects = data.product;
        this.selectedCategories = [];
        this.searchLabel='Search products by lesson title';
        this.loadCategories()
      },
      (error) => {
        console.error('Error:', error.error.message);
      }
    );
  }

  loadCategories(){
  this.newService.getCategory().subscribe((data)=>{
    const categories = data;
    const products = this.objects 
    this.filteredCategories = categories.filter((category: any) =>
      products.some((product: any) => product.category === category.name)
    );
    console.log('Filtered categories:', this.filteredCategories);
       
  },
  (error) => {
        console.error('Error:', error.error.message);
      }) 
}

toggleCategorySelection(category: string) {
  const index = this.selectedCategories.indexOf(category);
  if (index === -1) {
    this.selectedCategories.push(category);
  } else {
    this.selectedCategories.splice(index, 1);
  }
  
  // סינון לפי הקטגוריות הנבחרות
  if (this.selectedCategories.length) {
    this.filteredObjects = this.objects?.filter(obj =>
      this.selectedCategories.includes(obj.category)
    ) || [];
  } else {
    // אם אין קטגוריות נבחרות, הצג את כל האובייקטים
    this.filteredObjects = this.objects;
  }
}


}
