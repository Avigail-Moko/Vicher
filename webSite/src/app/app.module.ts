import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
// import { NavBarComponent } from './nav-bar/nav-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { SignupDialogComponent } from './signup-dialog/signup-dialog.component';
import { NewClientComponent } from './new-client/new-client.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  GoogleSigninButtonModule,
  SocialAuthServiceConfig,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';
// import { GoogleSigninComponent } from './google-signin/google-signin.component';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { HttpClientModule } from '@angular/common/http';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { DividerModule } from 'primeng/divider';
import { TabMenuModule } from 'primeng/tabmenu';
import { WellcomeComponent } from './wellcome/wellcome.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { LocalStorageService } from 'ngx-webstorage';
import { ProductStepperComponent } from './product-stepper/product-stepper.component';
import { KnobModule } from 'primeng/knob';
import { DataViewModule } from 'primeng/dataview';
import { FileUploadModule } from 'primeng/fileupload';
import { AboutComponent } from './about/about.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProductsEditDialogComponent } from './products-edit-dialog/products-edit-dialog.component';
import { ToastModule } from 'primeng/toast';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarComponent } from './calendar/calendar.component';
import { DailyPlannerComponent } from './daily-planner/daily-planner.component';
import { CarouselModule } from 'primeng/carousel';
import { FieldsetModule } from 'primeng/fieldset';
import { DeleteItemComponent } from './delete-item/delete-item.component';
import { AvailabilityScheduleComponent } from './availability-schedule/availability-schedule.component';
import { BecomingsellerComponent } from './becomingseller/becomingseller.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { UserViewComponent } from './user-view/user-view.component';  
import { BadgeModule } from 'primeng/badge';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    // NavBarComponent,
    SignupDialogComponent,
    LoginDialogComponent,
    NewClientComponent,
    UserProfileComponent,
    WellcomeComponent,
    ProductStepperComponent,
    AboutComponent,
    ProductsEditDialogComponent,
    CalendarComponent,
    DailyPlannerComponent,
    // GoogleSigninComponent,
    CalendarComponent,
    DeleteItemComponent,
    AvailabilityScheduleComponent,
    BecomingsellerComponent,
    UserViewComponent,
    
  ],
  providers: [
    MessageService,
    LocalStorageService,
    JwtHelperService,
    DatePipe,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '906186434728-g411kdddupn0spcvbscftskilvsl4uge.apps.googleusercontent.com'
            ), 
            
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
    {
      provide: JWT_OPTIONS,
      useValue: JWT_OPTIONS,
    },
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
    HttpClientModule,
    MatSidenavModule,
    MatListModule,
    ButtonModule,
    RatingModule,
    CardModule,
    ToolbarModule,
    DividerModule,
    TabMenuModule,
    MatAutocompleteModule,
    CalendarModule,
    KnobModule,
    DataViewModule,
    FileUploadModule,
    MatTooltipModule,
    InputTextModule,
    RadioButtonModule,
    InputTextareaModule,
    ToastModule,
    FullCalendarModule,
    CarouselModule,
    FieldsetModule,
    MessagesModule,
    BadgeModule
  ],
})
export class AppModule {}
