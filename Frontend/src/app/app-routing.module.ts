import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthGuardService as AuthGuard } from './auth-guard.service';
import { WelcomeComponent } from './welcome/welcome.component';
import { AboutComponent } from './about/about.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AvailabilityScheduleComponent } from './availability-schedule/availability-schedule.component';
import { UserViewComponent } from './user-view/user-view.component';
import { VideoChatComponent } from './video-chat/video-chat.component';
import { RatingPageComponent } from './rating-page/rating-page.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { SupportComponent } from './support/support.component';
import { SettingsComponent } from './settings/settings.component';
import { DeletingAccountComponent } from './deleting-account/deleting-account.component';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' }, 
  { path: 'welcome', component: WelcomeComponent },
  { path: 'user-view', component: UserViewComponent },

  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },
  { path: 'about', component: AboutComponent },
  { path: 'support', component: SupportComponent },
  
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
  {
    path: 'availability-schedule',
    component: AvailabilityScheduleComponent,
    canActivate: [AuthGuard],
  },
    {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard],
  },
    {
    path: 'deleting-account',
    component: DeletingAccountComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'video-chat',
    component: VideoChatComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'end-and-rate',
    component: RatingPageComponent,
    canActivate: [AuthGuard],
  },
  { path: 'verify-email', component: VerifyEmailComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
