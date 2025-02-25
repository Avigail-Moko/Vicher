import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { NewService } from '../new.service';
import { ActivatedRoute } from '@angular/router';
import DailyIframe, { DailyCall, DailyEventObject } from '@daily-co/daily-js';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.scss']
})
export class VideoChatComponent {
  roomUrl: string; 
  dailyCall: DailyCall; 
  allowedUsers: any[] = [];
  _id: string;
  userId = localStorage.getItem('userId');
  userProfile = JSON.parse(localStorage.getItem('userProfile'));
  teacher_id: any;
  length:any;

  constructor(
    private router: Router,
    private newService: NewService,
    private route: ActivatedRoute,
  ) {}

  async createRoom() {
    const roomData = {
      roomName: this._id,
      length: this.length
    };
  
    try {
      const data: any = await firstValueFrom(this.newService.createDailyRoom(roomData));
      console.log('Response:', data);
      return data.roomUrl;
    } catch (error: any) {
      console.error('Error:', error.error?.message || error.message);
      return null;
    }
  }
  

  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this._id = params['_id'];
    });
  
    if (!this._id) {
      this.router.navigate(['/']);
      return;
    }
    if (!this.userProfile) {
      this.router.navigate(['/']);
      return;
    }
  
    this.newService.getLessonById(this._id).subscribe(async (data) => {
      if (!data.lessons[0]) {
        this.router.navigate(['/']);
        return;
      }
      const startDate = new Date(data.lessons[0].myDate);
      startDate.setMinutes(startDate.getMinutes() - 15);
      const today = new Date();
  
      this.allowedUsers.push(data.lessons[0].teacher_id);
      this.allowedUsers.push(data.lessons[0].student_id);
      this.teacher_id = data.lessons[0].teacher_id;
      this.length = data.lessons[0].length;

  
      if (this.allowedUsers.includes(this.userId) && today > startDate) {
        const roomUrl = await this.createRoom();
        if (!roomUrl) {
          alert('⚠️ Unable to create room, please try again.');
          return;
        }
  
        this.roomUrl = roomUrl;
        this.initializeDailyCall(); 
      } else if (!this.allowedUsers.includes(this.userId)) {
        this.router.navigate(['/']);
      } else if (this.allowedUsers.includes(this.userId) && today < startDate) {
        const formattedStartDate = startDate.toLocaleString('en-GB', {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
        alert('The class has not started yet. Try again after' + formattedStartDate);
        this.router.navigate(['/']);
      }
    },
    () => {
      this.router.navigate(['/']);
    });
  }

  initializeDailyCall(): void {
    const container = document.getElementById('daily-iframe-container');
    if (!container) {
      console.error('No element with the ID "daily-iframe-container" was found.');
      return;
    }
    
    this.dailyCall = DailyIframe.createFrame(container, {
      iframeStyle: {
        width: '100%', 
        height: '100%',
        border: '0',

      },
      showLeaveButton: true 
    });

    this.dailyCall.on('loaded', this.handleLoaded);
    this.dailyCall.on('joined-meeting', this.handleJoinedMeeting);
    this.dailyCall.on('left-meeting', this.handleLeftMeeting);
    this.dailyCall.on('participant-joined', this.handleParticipantJoined);
    this.dailyCall.on('participant-left', this.handleParticipantLeft);
    this.dailyCall.on('error', this.handleError);

    this.dailyCall.join({ url: this.roomUrl });
  }

  // אירוע - iframe נטען
  handleLoaded = (event: DailyEventObject) => {
    console.log('Daily iframe loaded', event);
  }

  // אירוע - הצטרפות לשיחה
  handleJoinedMeeting = (event: DailyEventObject) => {
    console.log('Joined meeting', event);
  }

  // אירוע - עזיבת השיחה (כמו handleClose / videoConferenceLeft)
  handleLeftMeeting = (event: DailyEventObject) => {
    console.log('Left meeting', event);
    if (this.userId !== this.teacher_id) {
      this.router.navigate(['/end-and-rate'], { state: { teacher_id: this.teacher_id } });
    } else {
      this.router.navigate(['/welcome']);
    }
  }

  // אירוע - משתתף הצטרף
  handleParticipantJoined = (event: DailyEventObject) => {
    console.log('Participant joined', event);
  }

  // אירוע - משתתף עזב
  handleParticipantLeft = (event: DailyEventObject) => {
    console.log('Participant left', event);
  }

  // טיפול בשגיאות
  handleError = (event: DailyEventObject) => {
    console.error('Daily call error', event);
  }
  
  ngOnDestroy(): void {
    if (this.dailyCall) {
      this.dailyCall.destroy();
    }
  }
  
}
