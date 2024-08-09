import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private alertsSubject = new BehaviorSubject<any[]>([]);
  alerts$ = this.alertsSubject.asObservable();

  constructor() {}

  connect(): void {
    this.socket = io('http://localhost:3000');
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
        if (notification.note.student_id === userId || notification.note.teacher_id === userId){
        alerts.unshift(notification.note);}
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
        if (notification.studentId === userId){
        alerts = alerts.filter(alert => alert._id !== notification._id);
      }
        break;
      case 'teacherDeleteStatus':
        if (notification.teacherId === userId){
          alerts = alerts.filter(alert => alert._id !== notification._id);
        }
        break;
      case 'startLesson':
        const startLessonAlert = alerts.find(
          (alert) => alert._id === notification._id
        );
        if (startLessonAlert) {
          startLessonAlert.startLesson = notification.startLesson;
        }else if (notification.note.student_id === userId || notification.note.teacher_id === userId) {
          alerts.unshift(notification.note);
        }
        break;
        case 'deleteLesson':
          const deleteLessonAlert = alerts.find(
            (alert) => alert._id === notification._id
          );
          if (deleteLessonAlert) {
            deleteLessonAlert.deleteLesson = notification.deleteLesson;
          }else if (notification.note.student_id === userId || notification.note.teacher_id === userId) {
            alerts.unshift(notification.note);
          }
          break;
      
    }
    this.alertsSubject.next(alerts);
  }

}