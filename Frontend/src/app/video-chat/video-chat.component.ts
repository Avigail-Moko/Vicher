import {  Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewService } from '../new.service';
declare var JitsiMeetExternalAPI: any;
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.scss']
})
export class VideoChatComponent implements OnInit {

  domain: string = "meet.jit.si"; // For self hosted use your domain
  room: any;
  options: any;
  api: any;
  user: any;
  allowedUsers:any[]=[];
  _id: string;
  userId = localStorage.getItem('userId');
  userProfile=JSON.parse(localStorage.getItem('userProfile')); 

  // For Custom Controls
  isAudioMuted = false;
  isVideoMuted = false;

  constructor(
      private router: Router,
      private newService:NewService,
      private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this._id = params['_id'];
    });
  
    this.newService.getLessonById(this._id).subscribe((data) => {

      const startDate= new Date(data.lesson[0].myDate);
      startDate.setMinutes(startDate.getMinutes() - 15);
      const today=new Date();

      this.allowedUsers.push(data.lesson[0].teacher_id);
      this.allowedUsers.push(data.lesson[0].student_id);
      
      if (this.allowedUsers.includes(this.userId)&&today>startDate) {
        

        this.room = this._id;
        this.user = {
          // id: this.userId,
          name: this.userProfile.name
        };
        this.initializeJitsiMeet();
      } else if(!this.allowedUsers.includes(this.userId)) {
        // alert('you are not allowed to enter this room');
        this.router.navigate(['/']);
        
      }else if(this.allowedUsers.includes(this.userId)&&today<startDate) {
        const formattedStartDate = startDate.toLocaleString('en-GB', {
          year: 'numeric',
          month: 'long', 
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
        alert('lesson has not started yet. try again after '+formattedStartDate);
        this.router.navigate(['/']);
        
      }
    },
    () => {
      this.router.navigate(['/']);
    });
  }
  
  initializeJitsiMeet(): void {
    this.options = {
      roomName: this.room,
      width: 900,
      height: 500,
      configOverwrite: { 
        prejoinPageEnabled: true,
        // disableInviteFunctions: true // Disable invite functions
    },
      interfaceConfigOverwrite: {
          // overwrite interface properties
      },
      parentNode: document.querySelector('#jitsi-iframe'),
      userInfo: {
          displayName: this.userProfile.name
      }
  }

  this.api = new JitsiMeetExternalAPI(this.domain, this.options);
  

   // Event handlers
  this.api.addEventListeners({
      readyToClose: this.handleClose,
      participantLeft: this.handleParticipantLeft,
      participantJoined: this.handleParticipantJoined,
      videoConferenceJoined: this.handleVideoConferenceJoined,
      videoConferenceLeft: this.handleVideoConferenceLeft,
      audioMuteStatusChanged: this.handleMuteStatus,
      videoMuteStatusChanged: this.handleVideoStatus
  });
 };

handleClose = () => {
  console.log("handleClose");
}

handleParticipantLeft = async (participant) => {
  console.log("handleParticipantLeft", participant); // { id: "2baa184e" }
  const data = await this.getParticipants();
}

handleParticipantJoined = async (participant) => {
  console.log("handleParticipantJoined", participant); // { id: "2baa184e", displayName: "Shanu Verma", formattedDisplayName: "Shanu Verma" }
  const data = await this.getParticipants();
}

handleVideoConferenceJoined = async (participant) => {
  console.log("handleVideoConferenceJoined", participant); // { roomName: "bwb-bfqi-vmh", id: "8c35a951", displayName: "Akash Verma", formattedDisplayName: "Akash Verma (me)"}
  const data = await this.getParticipants();
}

// handleVideoConferenceLeft = () => {
//   console.log("handleVideoConferenceLeft");
//   this.router.navigate(['/thank-you']);
// }
handleVideoConferenceLeft = () => {
  console.log("handle Video ConferenceLeft is working");
  this.router.navigate(['/end-and-rate']);
}

handleMuteStatus = (audio) => {
  console.log("handleMuteStatus", audio); // { muted: true }
}

handleVideoStatus = (video) => {
  console.log("handleVideoStatus", video); // { muted: true }
}

getParticipants() {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          resolve(this.api.getParticipantsInfo()); // get all participants
      }, 500)
  });
}
executeCommand(command: string) {
  this.api.executeCommand(command);;
  if(command == 'hangup') {
      this.router.navigate(['/thank-you']);
      return;
  }

  if(command == 'toggleAudio') {
      this.isAudioMuted = !this.isAudioMuted;
  }

  if(command == 'toggleVideo') {
      this.isVideoMuted = !this.isVideoMuted;
  }
}
}
