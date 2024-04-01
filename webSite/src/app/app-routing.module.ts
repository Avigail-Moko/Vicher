import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NewClientComponent } from './new-client/new-client.component';
import { HomePageComponent } from './home-page/home-page.component';
import {AuthGuardService as AuthGuard } from './auth-guard.service';
import { WellcomeComponent } from './wellcome/wellcome.component';
import { AboutComponent } from './about/about.component';
import { CalendarComponent } from './calendar/calendar.component';
import { SupportComponent } from './support/support.component';
import { BecomingsellerComponent } from './becomingseller/becomingseller.component';

const routes: Routes = [
{ path: 'user-profile', component: UserProfileComponent,canActivate: [AuthGuard] },
{ path: 'wellcome', component: WellcomeComponent,canActivate: [AuthGuard] },
{ path: 'about', component: AboutComponent,canActivate: [AuthGuard] },
{ path: 'calendar', component: CalendarComponent,canActivate: [AuthGuard] },
{ path: 'support', component: SupportComponent,canActivate: [AuthGuard] },
{ path: 'seller', component: BecomingsellerComponent,canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
