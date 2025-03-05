import { Component } from '@angular/core';
import { NewService } from '../new.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-rating-page',
  templateUrl: './rating-page.component.html',
  styleUrls: ['./rating-page.component.scss'],
})
export class RatingPageComponent {
  value!: number;
  teacher_id: any;
  lessonId:any;
  constructor(
    private newService: NewService,
    private router: Router,
    private location: Location
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.teacher_id = navigation?.extras?.state?.['teacher_id'];
    this.lessonId = navigation?.extras?.state?.['lessonId'];
    // this.location.replaceState('/rating');
  }
  ngOnInit(){
    if(!this.teacher_id){
      this.router.navigate(['/welcome']);
    }
  }
  onRate(): void {
    const rating=this.value
    this.newService.rating(this.teacher_id, rating, this.lessonId).subscribe(
      (data) => {
        console.log('Response:', data);
        this.router.navigate(['/welcome'])
      },
      (error) => {
        console.error('Error:', error.error.message);
      }
    );
  }
}
