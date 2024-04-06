import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  tap,
  throwError,
} from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Form, NgForm } from '@angular/forms';
import { INewUser } from './models/new.interface';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class NewService {
  private currentUser: any;

  private divsSource = new BehaviorSubject<any[]>([]);

  divs$ = this.divsSource.asObservable();

  private previousAuthenticationState: boolean = true; // המשתנה הזה ישמור את המצב הקודם של ההתחברות

  public isAuthenticatedSubject = new Subject<boolean>();

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {}

  addDiv(div: any) {
    const currentDivs = this.divsSource.getValue();
    const newDivs = [...currentDivs, div];
    this.divsSource.next(newDivs);
  }

  Signup(values: any): Observable<any> {
    const url = 'http://localhost:3000/users/signup';
    return this.http.post(url, values);
  }
  Login(values: any): Observable<any> {
    const url = 'http://localhost:3000/users/login';
    return this.http.post(url, values);
  }

  getUserProfile(): Observable<any> {
    const url = 'http://localhost:3000/users/profile';
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', 'Bearer ' + token);
    }
    return this.http.get(url, { headers });
  }
  createProduct(values: any): Observable<any> {
    console.log(values);
    const url = 'http://localhost:3000/products/createProduct';

    return this.http.post(url, values);
  }

  getProduct(userId: any): Observable<any> {
    const url = `http://localhost:3000/products/getProduct?userId=${userId}`; //בגרשיים אחודות ולא רגילות, אפשר לשלב משתנים ישירות בתוך המחרוזת
    return this.http.get(url);
  }

  getAllProduct(): Observable<any> {
    const url = 'http://localhost:3000/products/getAllproduct';
    return this.http.get(url);
  }

  getAllUsers() {
    const url = 'http://localhost:3000/users/getAllUsers';
    return this.http.get(url);
  }

  deleteProduct(_id: any): Observable<any> {
    const url = `http://localhost:3000/products/deleteProduct?_id=${_id}`;
    return this.http.delete(url);
  }
  updateProduct(_id: any, values: any): Observable<any> {
    const url = `http://localhost:3000/products/updateProduct?_id=${_id}`;
    console.log(values, 'this is the service');
    return this.http.patch(url, values);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const isTokenExpired = this.jwtHelper.isTokenExpired(token || '');

    if (isTokenExpired !== this.previousAuthenticationState) {
      this.previousAuthenticationState = isTokenExpired;

      if (isTokenExpired) {
        window.dispatchEvent(new Event('userTokenExpired'));
        localStorage.removeItem('userProfile');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('localArray');
        location.reload();
        // alert('Good bye');
      } else {
        // alert('Wellcome ');
      }
    }

    return !isTokenExpired;
  }

  createLesson(values: any) {
    const url = 'http://localhost:3000/lessons/createLesson';
    return this.http.post(url, values);
  }
  getLesson(teacherId: any): Observable<any> {
    const url = `http://localhost:3000/lessons/getLesson?teacher_id=${teacherId}`; //בגרשיים אחודות ולא רגילות, אפשר לשלב משתנים ישירות בתוך המחרוזת
    return this.http.get(url);
  }
  createSchedule(objectsArray: any,teacher_id:any) {
    const url = `http://localhost:3000/schedule/createSchedule?teacher_id=${teacher_id}`;
    return this.http.post(url, {objectsArray});
  }
  getSchedule(teacher_id:any): Observable<any>{
    const url = `http://localhost:3000/schedule/getSchedule?teacher_id=${teacher_id}`;
    return this.http.get(url);
  }
  // updateSchedule(teacher_id:any,objectsArray: any){
  //   const url = `http://localhost:3000/schedule/updateSchedule?teacher_id=${teacher_id}`;
  //   return this.http.patch(url, {objectsArray});
  // }
}
