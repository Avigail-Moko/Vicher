import {MatDrawer, MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
// import {MatButtonModule} from '@angular/material/button';
// import {NgIf} from '@angular/common';
import { Component, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignupDialogComponent } from '../signup-dialog/signup-dialog.component';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { Router } from '@angular/router';
import { NewService } from '../new.service';
// import { MatGridListModule } from '@angular/material/grid-list';
// import { json } from 'express';
// import { Observable } from 'rxjs';
import { MenuItem } from 'primeng/api';
import {OnInit} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {startWith, map, switchMap} from 'rxjs/operators';
import {NgFor, AsyncPipe, DatePipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';



@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  
})
export class HomePageComponent  {
  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;
//searching chart:
  control = new FormControl('');
  errorMessage='';
  users: string[] = [];
  filteredUsers: Observable<string[]>;
  // userId:any;
  showFiller = false;
  // user:String;
  // userProfileName=localStorage.getItem('userProfileName');
  userProfile: any; // המשתנה לשמירת פרטי המשתמש
  alerts: any[] = [];
  toppings = new FormControl('');

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  userId = localStorage.getItem('userId');

  constructor(public dialog:MatDialog,
    private router: Router,
    public newService: NewService){
    }

    ngOnInit() {

      this.userProfile = JSON.parse(localStorage.getItem('userProfile'));
      // האזנה לאירוע
      window.addEventListener('userProfileUpdated', () => {
      this.userProfile = JSON.parse(localStorage.getItem('userProfile'));
      });
      // this.newService.getAllUsers().subscribe((data)=>{
      //   this.streets=data
      // })

      //searching chart:
      this.filteredUsers = this.control.valueChanges.pipe(
        startWith(''),switchMap(value => this.newService.getAllUsers().pipe(
        map(users =>{
          console.log('Users from API:', users); // בדוק שהנתונים מגיעים
          return this._filter(users, value || '');
        })
      )),
    );
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
    if(this.newService.isAuthenticated()){
      this.userId=localStorage.getItem('userId')
      this.newService.getNote(this.userId).subscribe(
        (data)=>{
        // console.log('this first notification:',data.notification[0])
        for (let index = 0; index < data.notification.length; index++) {
          this.alerts[index]=data.notification[index]
          console.log(index,this.alerts[index])
        }
      },
      (error) => {
        console.error('Error:', error.error.message);
        this.errorMessage = error.error.message;
      })
    }
    
    }

 

    //searching chart:
    private _filter(users: any[], value: string): string[] {
      const filterValue = this._normalizeValue(value);
      console.log('filter Value:',filterValue)
      return users.filter(user => {
        const normalizedUser = this._normalizeValue(user.name);
        console.log('Normalized user:', normalizedUser); // בדוק את המשתמש המנורמל
        return normalizedUser.includes(filterValue);
      });
    }
  
    private _normalizeValue(value: any): string {
      if (typeof value !== 'string') {
        return '';
      }
      return value.toLowerCase().replace(/\s/g, '');
    }

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

    public logout():void{
      localStorage.removeItem('token');
      console.log('התנתקת בהצלחה');
      this.router.navigate(['']);
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
}
