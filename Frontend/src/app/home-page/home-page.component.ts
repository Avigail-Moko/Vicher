import {MatDrawer} from '@angular/material/sidenav';
import { Component, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SignupDialogComponent } from '../signup-dialog/signup-dialog.component';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { Router } from '@angular/router';
import { NewService } from '../new.service';
import { MenuItem } from 'primeng/api';
import {Observable} from 'rxjs';
import { SocketService } from '../socket.service';



@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  
})
export class HomePageComponent  {
  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;

  errorMessage='';
  users: string[] = [];
  filteredUsers: Observable<string[]>;
  showFiller = false;

  alerts: any[] = [];

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



     // tab menu
     this.items = [
      { label: 'Home', icon: 'pi pi-fw pi-home',routerLink:'/welcome'},
      { label: 'About Us', icon: 'pi pi-fw pi-id-card',routerLink:'/about'},
     
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


    @ViewChild('drawer') drawer: MatDrawer;
    
    navigateToUserProfile() {
      this.router.navigate(['/user-profile']); 
    }  
    navigateToWelcomePage(){
      this.router.navigate(['/welcome'])
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
          this.alerts.unshift(data.notification[index]);
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
