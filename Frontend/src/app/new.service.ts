import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SocketService } from './socket.service';
import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NewService {
  private authStatusListener = new Subject<boolean>();
  private previousAuthenticationState: boolean = true; // המשתנה הזה ישמור את המצב הקודם של ההתחברות
  private jsonUrl = 'assets/categories.JSON';
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private socketService: SocketService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const isTokenExpired = this.jwtHelper.isTokenExpired(token || '');

    if (isTokenExpired !== this.previousAuthenticationState) {
      this.previousAuthenticationState = isTokenExpired;

      if (isTokenExpired) {
        this.logout();
        this.socketService.disconnect();
        // alert('Good bye');
      } else {
        this.socketService.connect();
        // alert('Welcome ');
      }
    }
    return !isTokenExpired;
  }

  Login(values: any): Observable<any> {
    const url = `${this.apiUrl}/users/login`;
    return this.http.post(url, values).pipe(
      tap((data: any) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userProfile', JSON.stringify(data.user));

        this.authStatusListener.next(true); // עדכון על התחברות
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userProfile');
    this.dialog.closeAll();
    this.router.navigate(['']);
    // window.location.reload();

    this.authStatusListener.next(false); // עדכון על התנתקות
  }

  Signup(values: any): Observable<any> {
    const url = `${this.apiUrl}/users/signup`;
    return this.http.post(url, values);
  }

  verifyEmail(token: string) {
    const url = `${this.apiUrl}/email/verifyEmail?token=${token}`;
    return this.http.get(url);
  }
  verifyDeleteAccount(token: string) {
    const url = `${this.apiUrl}/email/verifyDeleteAccount?token=${token}`;
    return this.http.get(url);
  }
  contact(values: any) {
    const url = `${this.apiUrl}/email/contact`;
    return this.http.post(url, values);
  }
  changePassword(id: any, values: any): Observable<any> {
    const url = `${this.apiUrl}/users/changePassword?id=${id}`;
    return this.http.patch(url, values);
  }
  changeUsername(id: any, values: any): Observable<any> {
    const url = `${this.apiUrl}/users/changeUsername?id=${id}`;
    return this.http.patch(url, values);
  }
  updateDescription(id: any, values: any): Observable<any> {
    const url = `${this.apiUrl}/users/updateDescription?id=${id}`;
    return this.http.patch(url, values);
  }
  sendDeleteAccountLink(values: any) {
    const url = `${this.apiUrl}/email/sendDeleteAccountLink`;
    return this.http.post(url, values);
  }

  deleteAccount(userId: string, socketId: string) {
    const url = `${this.apiUrl}/users/deleteAccount?userId=${userId}&socketId=${socketId}`;
    return this.http.delete(url);
  }

  createProduct(values: any): Observable<any> {
    console.log(values);
    const url = `${this.apiUrl}/products/createProduct`;

    return this.http.post(url, values);
  }

  getProduct(userId: any): Observable<any> {
    const url = `${this.apiUrl}/products/getProduct?userId=${userId}`;
    return this.http.get(url);
  }

  getAllProduct(): Observable<any> {
    const url = `${this.apiUrl}/products/getAllproduct`;
    return this.http.get(url);
  }

  getAllUsers(): Observable<any> {
    const url = `${this.apiUrl}/users/getAllUsers`;
    return this.http.get(url);
  }
  getProfile(partner_id: any): Observable<any> {
    const url = `${this.apiUrl}/users/getProfile?_id=${partner_id}`;
    return this.http.get(url);
  }

  deleteProduct(_id: any): Observable<any> {
    const url = `${this.apiUrl}/products/deleteProduct?_id=${_id}`;
    return this.http.delete(url);
  }
  updateProduct(_id: any, values: any): Observable<any> {
    const url = `${this.apiUrl}/products/updateProduct?_id=${_id}`;
    return this.http.patch(url, values);
  }

  createLesson(values: any) {
    const url = `${this.apiUrl}/lessons/createLesson`;
    return this.http.post(url, values);
  }
  getLessonByTeacher(teacher_id: any): Observable<any> {
    const url = `${this.apiUrl}/lessons/getLesson?teacher_id=${teacher_id}`;
    return this.http.get(url);
  }

  getLessonById(_id: any): Observable<any> {
    const url = `${this.apiUrl}/lessons/getLesson?_id=${_id}`;
    return this.http.get(url);
  }
  getLessonByTeacherAndStudentId(
    teacher_id: any,
    student_id: any
  ): Observable<any> {
    const url = `${this.apiUrl}/lessons/getLesson?teacher_id=${teacher_id}&student_id=${student_id}`;
    return this.http.get(url);
  }

  createSchedule(objectsArray: any, teacher_id: any) {
    const url = `${this.apiUrl}/schedule/createSchedule?teacher_id=${teacher_id}`;
    return this.http.post(url, { objectsArray });
  }
  getSchedule(teacher_id: any): Observable<any> {
    const url = `${this.apiUrl}/schedule/getSchedule?teacher_id=${teacher_id}`;
    return this.http.get(url);
  }

  getNote(userId: any): Observable<any> {
    const url = `${this.apiUrl}/notification/getNote?userId=${userId}`;
    return this.http.get(url);
  }
  markNotificationsAsDelete(_id: any, userId: any): Observable<any> {
    const url = `${this.apiUrl}/notification/markNotificationsAsDelete?_id=${_id}`;
    return this.http.patch(url, { userId });
  }
  markNotificationsAsRead(_id: any, userId: any): Observable<any> {
    const url = `${this.apiUrl}/notification/markNotificationsAsRead?_id=${_id}`;
    return this.http.patch(url, { userId });
  }

  createBusyEvent(values: any) {
    const url = `${this.apiUrl}/busyEvents/createBusyEvent`;
    return this.http.post(url, values);
  }
  getAllTeacherBusyEvents(teacher_id: any): Observable<any> {
    const url = `${this.apiUrl}/busyEvents/getAllTeacherBusyEvents?teacher_id=${teacher_id}`;
    return this.http.get(url);
  }
  deleteBusyEvent(_id: any): Observable<any> {
    const url = `${this.apiUrl}/busyEvents/deleteBusyEvent?_id=${_id}`;
    return this.http.delete(url);
  }
  getRating(userId: any): Observable<any> {
    const url = `${this.apiUrl}/users/getRating?userId=${userId}`;
    return this.http.get(url);
  }
  rating(teacher_id: any, rating: any, lessonId: any): Observable<any> {
    const url = `${this.apiUrl}/users/rating?teacher_id=${teacher_id}`;
    console.log(teacher_id, rating, lessonId);
    return this.http.post(url, { rating, lessonId }, { withCredentials: true });
  }
  deleteLesson(_id: any): Observable<any> {
    const url = `${this.apiUrl}/lessons/deleteLesson?_id=${_id}`;
    return this.http.delete(url);
  }

  getCategory(): Observable<any> {
    return this.http.get<any>(this.jsonUrl);
  }

  createDailyRoom(values: any) {
    const url = `${this.apiUrl}/daily/createRoom`;
    return this.http.post(url, values);
  }
}
