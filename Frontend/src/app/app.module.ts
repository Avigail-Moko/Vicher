import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { SignupDialogComponent } from './signup-dialog/signup-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
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
import { WelcomeComponent } from './welcome/welcome.component';
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
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { UserViewComponent } from './user-view/user-view.component';
import { BadgeModule } from 'primeng/badge';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TagModule } from 'primeng/tag';
import { VideoChatComponent } from './video-chat/video-chat.component';
import { RatingPageComponent } from './rating-page/rating-page.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DeleteLessonDialogComponent } from './delete-lesson-dialog/delete-lesson-dialog.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatExpansionModule } from '@angular/material/expansion';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MatMenuModule } from '@angular/material/menu';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { SupportComponent } from './support/support.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { SettingsComponent } from './settings/settings.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DeletingAccountComponent } from './deleting-account/deleting-account.component';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    SignupDialogComponent,
    LoginDialogComponent,
    UserProfileComponent,
    WelcomeComponent,
    ProductStepperComponent,
    AboutComponent,
    ProductsEditDialogComponent,
    CalendarComponent,
    DailyPlannerComponent,
    CalendarComponent,
    DeleteItemComponent,
    AvailabilityScheduleComponent,
    UserViewComponent,
    VideoChatComponent,
    RatingPageComponent,
    DeleteLessonDialogComponent,
    VerifyEmailComponent,
    SupportComponent,
    SettingsComponent,
    DeletingAccountComponent,
  ],
  providers: [
    MessageService,
    LocalStorageService,
    JwtHelperService,
    DatePipe,
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
    BadgeModule,
    OverlayPanelModule,
    TagModule,
    InputNumberModule,
    ToggleButtonModule,
    AutoCompleteModule,
    NgxPaginationModule,
    MatExpansionModule,
    ScrollingModule,
    SelectButtonModule,
    MatMenuModule,
    RecaptchaModule,
   MatProgressSpinnerModule
  ],
})
export class AppModule {}
