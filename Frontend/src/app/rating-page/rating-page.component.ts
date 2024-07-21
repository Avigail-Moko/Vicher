import { Component } from '@angular/core';
import { NewService } from '../new.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-rating-page',
  templateUrl: './rating-page.component.html',
  styleUrls: ['./rating-page.component.scss'],
})
export class RatingPageComponent {
  value!: number;
  isReadonly: boolean = false;
  teacher_id: any;
  myVariable: string;
  constructor(
    private newService: NewService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.teacher_id = navigation?.extras?.state?.['teacher_id'];
  }

  onRate(event: any): void {
    this.isReadonly = true;
    const rating=event.value
    this.newService.rating(this.teacher_id, rating).subscribe(
      (data) => {
        console.log('Response:', data);
      },
      (error) => {
        console.error('Error:', error.error.message);
      }
    );
  }
}
