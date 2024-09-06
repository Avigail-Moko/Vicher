import { Component } from '@angular/core';
import { NewService } from '../new.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rating-page',
  templateUrl: './rating-page.component.html',
  styleUrls: ['./rating-page.component.scss'],
})
export class RatingPageComponent {
  value!: number;
  teacher_id: any;
  constructor(
    private newService: NewService,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.teacher_id = navigation?.extras?.state?.['teacher_id'];
  }

  onRate(): void {
    const rating=this.value
    this.newService.rating(this.teacher_id, rating).subscribe(
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
