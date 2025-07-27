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
  this.route.queryParams.subscribe((params) => {
    const token = params['token'];
    if (!token) {
      this.steps.push('❌ Missing token');
      setTimeout(() => this.router.navigate(['/']), 2500);
      return;
    }

    this.newService.verifyDeleteAccount(token).subscribe(
     async  (res: any) => {
        this.userId = res.userId;

        await this.socketService.waitForConnection();

        this.socketId = this.socketService.getSocketId();
        this.listenToSteps();
        this.startDeletion();
      },
      (err) => {
        this.steps.push('❌ Token invalid or expired');
        setTimeout(() => this.router.navigate(['/']), 2500);
      }
    );
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
