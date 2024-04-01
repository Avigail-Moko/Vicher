import { Component, OnInit } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { NewService } from "../new.service";



@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.scss']
})
export class NewClientComponent implements OnInit {
  newUser:any;
  errorMessage: any;
 
  constructor (private newService:NewService) {}
  
  ngOnInit() {
    this.newService.getUserProfile().subscribe(
      (data: any) => {
        this.newUser = data; 
        console.log(this.newUser)
      },
      (error) => {
        console.error('Error:', error);
        this.errorMessage = error.error.message;
      }
    );
  }
}
