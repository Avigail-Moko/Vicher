import {MatDrawer} from '@angular/material/sidenav';
import { Component, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignupDialogComponent } from '../signup-dialog/signup-dialog.component';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { Router } from '@angular/router';
import { NewService } from '../new.service';
import { MenuItem } from 'primeng/api';
// import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
// import {startWith, map, switchMap} from 'rxjs/operators';
import { SocketService } from '../socket.service';



@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  
})
export class HomePageComponent  {
  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;
//searching chart:
  // control = new FormControl('');
  errorMessage='';
  users: string[] = [];
  filteredUsers: Observable<string[]>;
  showFiller = false;

  alerts: any[] = [];
  // toppings = new FormControl('');

  // toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  userProfile=JSON.parse(localStorage.getItem('userProfile')); 
  userId = localStorage.getItem('userId');


  constructor(public dialog:MatDialog,
    private router: Router,
    public newService: NewService,
     private socketService: SocketService){
      this.socketService.alerts$.subscribe(alerts => {
        this.alerts = alerts;
      });
    }

    ngOnInit() {
this.getNotifications()
      this.newService.getAuthStatusListener().subscribe(isAuthenticated => {
        if (isAuthenticated) {
          this.userProfile = JSON.parse(localStorage.getItem('userProfile'));
          this.userId = localStorage.getItem('userId');
          this.getNotifications();
        }
        else{
          this.userProfile = '';
          this.userId = '';
          this.alerts = [];
        }
      });


    //   //searching chart:
    //   this.filteredUsers = this.control.valueChanges.pipe(
    //     startWith(''),switchMap(value => this.newService.getAllUsers().pipe(
    //     map(users =>{
    //       console.log('Users from API:', users); // בדוק שהנתונים מגיעים
    //       return this._filter(users, value || '');
    //     })
    //   )),
    // );

     // tab menu
     this.items = [
      { label: 'Home', icon: 'pi pi-fw pi-home',routerLink:'/wellcome'},
      // { label: 'Calendar', icon: 'pi pi-fw pi-calendar',routerLink:'/calendar' },
      // { label: 'Edit Profile', icon: 'pi pi-fw pi-pencil',routerLink:'/user-profile' },
      { label: 'About Us', icon: 'pi pi-fw pi-id-card',routerLink:'/about'},
      {label: 'look for more users',icon:'pi pi-search'}//אני רוצה ב HOVER שתתגלה כאן התיבת חיפוש של כל המשתמשים
      // { label: 'Availability', icon: 'pi pi-fw pi-clock',routerLink:'/availability-schedule'},
      // { label: 'Become a Seller', icon: 'pi pi-fw pi-dollar',routerLink:'/seller'},
      ];
    this.activeItem = this.items[0];
    }
 
    // //searching chart:
    // private _filter(users: any[], value: string): string[] {
    //   const filterValue = this._normalizeValue(value);
    //   console.log('filter Value:',filterValue)
    //   return users.filter(user => {
    //     const normalizedUser = this._normalizeValue(user.name);
    //     console.log('Normalized user:', normalizedUser); // בדוק את המשתמש המנורמל
    //     return normalizedUser.includes(filterValue);
    //   });
    // }
  
    // private _normalizeValue(value: any): string {
    //   if (typeof value !== 'string') {
    //     return '';
    //   }
    //   return value.toLowerCase().replace(/\s/g, '');
    // }

  onActiveItemChange(event: MenuItem) {
   this.activeItem = event;
  }
    
    public openSignupDialog(): void {
      const dialogRef = this.dialog.open(SignupDialogComponent, {
        width: '250px',
      }); 
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }

    public openLoginDialog():void{
      const dialogRef = this.dialog.open(LoginDialogComponent, {
        width: '250px',
      }); 
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed'); 
      });
    }


    @ViewChild('drawer') drawer: MatDrawer;
    
    navigateToUserProfile() {
      this.router.navigate(['/user-profile']); // הנתיב שבו נמצאת קומפוננטת "user profile"
    }  
    navigateToWellcomePage(){
      this.router.navigate(['/wellcome'])
    }
    navToCalendar(){
      this.router.navigate(['/calendar'])

    }
    navToAvailabilitySchedule(){
      this.router.navigate(['/availability-schedule'])

    }
    getNotifications() {
      this.newService.getNote(this.userId).subscribe(
        (data)=>{
        for (let index = 0; index < data.notification.length; index++) {
          this.alerts.unshift(data.notification[index]); // הוספת התראה חדשה בראש המערך
        }
      },
      (error) => {
        console.error('Error:', error.error.message);
        this.errorMessage = error.error.message;
      })
    }
    deleteNote(_id:any){
      this.newService.markNotificationsAsDelete(_id,this.userId).subscribe((data)=>{
        console.log('Response:', data);
       }, (error) => {
        console.error('Error:', error.error.message);
        this.errorMessage = error.error.message;
      })

    }
    readNote(_id:any){
      this.newService.markNotificationsAsRead(_id,this.userId).subscribe((data)=>{
        console.log('Response:', data);
       }, (error) => {
        console.error('Error:', error.error.message);
        this.errorMessage = error.error.message;
      })

    }
}
