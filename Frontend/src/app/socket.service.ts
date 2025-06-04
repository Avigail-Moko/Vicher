import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private alertsSubject = new BehaviorSubject<any[]>([]);
  alerts$ = this.alertsSubject.asObservable();

  constructor(private http: HttpClient) {}

  connect(): void {
    const isDev = !environment.production;
    const socketUrl = isDev ? 'http://localhost:3000' : window.location.origin;

this.socket = io(socketUrl, {
  path: '/socket.io',
  transports: [ 'polling' ,'websocket']
});

this.socket.on('connect', () => {
  console.log('Connected via transport:', this.socket.io.engine.transport.name);
});

    this.socket.on('notification', (notification: any) => {
      this.handleNotification(notification);
    });
    console.log('connect socket');
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
    console.log('disconnect socket');
  }

  private handleNotification(notification: any): void {
    let alerts = this.alertsSubject.getValue();
    const userId = localStorage.getItem('userId');

    switch (notification.type) {
      case 'new':
        if (
          notification.note.student_id === userId ||
          notification.note.teacher_id === userId
        ) {
          alerts.unshift(notification.note);
        }
        break;
      case 'studentReadStatus':
        const studentReadStatusAlert = alerts.find(
          (alert) => alert._id === notification._id
        );
        if (studentReadStatusAlert) {
          studentReadStatusAlert.studentStatus = notification.studentStatus;
        }
        break;
      case 'teacherReadStatus':
        const teacherReadStatusAlert = alerts.find(
          (alert) => alert._id === notification._id
        );
        if (teacherReadStatusAlert) {
          teacherReadStatusAlert.teacherStatus = notification.teacherStatus;
        }
        break;
      case 'studentDeleteStatus':
        if (notification.studentId === userId) {
          alerts = alerts.filter((alert) => alert._id !== notification._id);
        }
        break;
      case 'teacherDeleteStatus':
        if (notification.teacherId === userId) {
          alerts = alerts.filter((alert) => alert._id !== notification._id);
        }
        break;
      case 'startLesson':
        const startLessonAlert = alerts.find(
          (alert) => alert._id === notification._id
        );
        if (startLessonAlert) {
          startLessonAlert.startLesson = notification.startLesson;
        } else if (
          notification.note.student_id === userId ||
          notification.note.teacher_id === userId
        ) {
          alerts.unshift(notification.note);
        }
        break;
      case 'deleteLesson':
        const deleteLessonAlert = alerts.find(
          (alert) => alert._id === notification.note._id
        );
        if (deleteLessonAlert) {
          deleteLessonAlert.deleteLesson = notification.deleteLesson;
          deleteLessonAlert.teacherStatus = notification.note.teacherStatus;
          deleteLessonAlert.studentStatus = notification.note.studentStatus;
        } else if (
          notification.note.student_id === userId ||
          notification.note.teacher_id === userId
        ) {
          alerts.unshift(notification.note);
        }
        break;
      case 'deleteNotification':
        const index = alerts.findIndex(
          (alert) => alert._id === notification._id
        );
        if (index !== -1) {
          alerts.splice(index, 1);
        }
        // this.http.post('http://localhost:3000/users/endRating', {
        //   userId: notification.userId,
        //   lessonId: notification.lessonId,
        // }, { withCredentials: true }).subscribe(
        //   (response: any) => {
        //     console.log(response.message);
        //   },
        //   (error) => {
        //     console.error('Error clearing session:', error);
        //   }
        // );
        break;
    }
    this.alertsSubject.next(alerts);
  }
}

