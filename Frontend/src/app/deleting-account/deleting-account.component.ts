import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from '../socket.service';
import { NewService } from '../new.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-deleting-account',
  templateUrl: './deleting-account.component.html',
  styleUrls: ['./deleting-account.component.scss'],
})
export class DeletingAccountComponent {
  socketId: string;
  userId: string;
  steps: string[] = [];
  private socketSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private socketService: SocketService,
    private newService: NewService
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId')!;
    this.route.queryParams.subscribe((params) => {
      this.socketId = params['socketId'];
      if (!this.socketId || !this.userId) {
        this.steps.push('Missing user or socket ID');
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2500);
        return;
      }

      this.listenToSteps();
      this.startDeletion();
    });
  }

  listenToSteps() {
    this.socketSub = this.socketService.onDeleteStepDone().subscribe((step) => {
      const descriptions: { [key: string]: string } = {
        account: '✔️ Account deleted',
        lessons: '✔️ Lessons deleted & notifications sent',
        products: '✔️ Products and images deleted',
        calendar: '✔️ Calendar cleared',
        done: '✅ Deletion complete',
      };
      this.steps.push(descriptions[step] || `Unknown step: ${step}`);

      if (step === 'done') {
        setTimeout(() => {
          localStorage.clear();
          this.router.navigate(['/']);
        }, 2500);
      }
    });
  }

  startDeletion() {
    this.newService.deleteAccount(this.userId, this.socketId).subscribe(
      () => {
        this.steps.push('Started account deletion...');
      },
      (err) => {
        console.error(err);
        this.steps.push(
          '❌ Failed to start deletion: ' +
            (err.error?.message || err.statusText)
        );
      }
    );
  }
  ngOnDestroy() {
    this.socketSub?.unsubscribe();
  }
}
