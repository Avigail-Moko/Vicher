// import { GoogleAuthService } from './google-signin.service';
// import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// @Component({
//   selector: 'app-google',
//   templateUrl: './google-signin.component.html',
//   styleUrls: ['./google-signin.component.css'],
//   providers: [GoogleAuthService]
// })

// export class GoogleSigninComponent implements OnInit{

//   public get auth(): GoogleAuthService {
//     return this._auth;
//   }
//   public set auth(value: GoogleAuthService) {
//     this._auth = value;
//   }

//   imageURL  : string;
//   email : string;
//   name  : string; 
//   token  : string;
//   @Output() onSigninSuccess = new EventEmitter();
//   @Input() clientId: string;

//   constructor(private _auth: GoogleAuthService){}

//   /**
//    * Ininitalizing Google Authentication API and getting data from localstorage if logged in
//    */
//   ngOnInit(){
//      setTimeout(()=>{this.googleAuthenticate()},50);
//   }

//   /**
//    * Calling Google Authentication service
//    */
//   googleAuthenticate(){
//     this.auth.authenticateUser(this.clientId, this.onSigninSuccess);
//   }
// }
