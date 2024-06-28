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
    console.log('connect socket')
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
    console.log('disconnect socket')

  }

  private handleNotification(notification: any): void {
    let alerts = this.alertsSubject.getValue();
    switch (notification.type) {
      case 'new':
        alerts.unshift(notification.note);
        break;
      case 'update':
        const updatedAlert = alerts.find(alert => alert._id === notification._id);
        if (updatedAlert) {
          updatedAlert.read = notification.read;
        }
        break;
      case 'delete':
        alerts = alerts.filter(alert => alert._id !== notification._id);
        break;
    }
    this.alertsSubject.next(alerts);
  }
}
