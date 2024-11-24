import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, ObservableInput } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ConfigService{
    handleError: (err: any, caught: Observable<Object>) => ObservableInput<any>;
    constructor(private http: HttpClient){}

    save(){
        this.http.post('http://localhost:3000/',this.http,{
            headers: new HttpHeaders ({
                'Content-Type':'application/json'
            })
        })
        .pipe(catchError(this.handleError))
    }
} 