import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NewClientComponent } from './new-client/new-client.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AuthGuardService as AuthGuard } from './auth-guard.service';
import { WellcomeComponent } from './wellcome/wellcome.component';
import { AboutComponent } from './about/about.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AvailabilityScheduleComponent } from './availability-schedule/availability-schedule.component';
import { BecomingsellerComponent } from './becomingseller/becomingseller.component';
import { UserViewComponent } from './user-view/user-view.component';

const routes: Routes = [
  { path: '', redirectTo: 'wellcome', pathMatch: 'full' }, // נתיב ריק מוביל לדף הבית
  { path: 'wellcome', component: WellcomeComponent },
  { path: 'user-view', component: UserViewComponent },

  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },
  { path: 'about', component: AboutComponent },
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
  {
    path: 'availability-schedule',
    component: AvailabilityScheduleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'seller',
    component: BecomingsellerComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
