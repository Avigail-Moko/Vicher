import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewService } from '../new.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  message = 'Performing email verification...';

  constructor(
    private route: ActivatedRoute,
    private newService: NewService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.newService.verifyEmail(token).subscribe(
        () => {
          this.message = 'Your email has been successfully verified. You may now proceed to log in.';
          setTimeout(() => this.router.navigate(['/']), 5000);
        },
        (error) => {
          this.message = `Email verification failed: ${error.error?.message || 'An unexpected error occurred.'}`;
          setTimeout(() => this.router.navigate(['/']), 5000);
        }
      );
    } else {
      this.message = 'Verification token is missing from the URL.';
    }
  }
}
