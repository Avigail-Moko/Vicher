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
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';



@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  
})
export class HomePageComponent  {
  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;

  showFiller = false;
  // user:String;
  // userProfileName=localStorage.getItem('userProfileName');
  userProfile: any; // המשתנה לשמירת פרטי המשתמש

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

     // tab menu
     this.items = [
      { label: 'Home', icon: 'pi pi-fw pi-home',routerLink:'/wellcome'},
      { label: 'Calendar', icon: 'pi pi-fw pi-calendar',routerLink:'/calendar' },
      { label: 'Edit Profile', icon: 'pi pi-fw pi-pencil',routerLink:'/user-profile' },
      { label: 'About Us', icon: 'pi pi-fw pi-id-card',routerLink:'/about'},
      { label: 'Availability', icon: 'pi pi-fw pi-clock',routerLink:'/availability-schedule'},
      { label: 'Become a Seller', icon: 'pi pi-fw pi-dollar',routerLink:'/seller'},
      ];
    this.activeItem = this.items[0];
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
