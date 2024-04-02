import { Component } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { EventResizeStartArg } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { NewService } from '../new.service';
// import { Dropdown, DropdownItem } from 'primeng/dropdown';
// import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-availability-schedule',
  templateUrl: './availability-schedule.component.html',
  styleUrls: ['./availability-schedule.component.scss'],
})
export class AvailabilityScheduleComponent {
  myDate: any;
  timeSpan: any;
  workHours: any;
  objectsArray: { start: number[]; end: number[]; day: number }[] = [];
  newObj:any;
  days:any;  
  startHours:any;
  endHours:any;
  mish:any;
constructor(public newServise:NewService){}

  calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin],
    headerToolbar: {
      left: '',
      center: '',
      right: '',
    },
    initialView: 'timeGridWeek',
    selectOverlap: false,
    editable: true,
    selectable: true,
    droppable:true,
    selectMirror: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),

  };

  //קביעת אירוע
  handleDateSelect(selectInfo: DateSelectArg) {
    const calendarApi = selectInfo.view.calendar;
    
    calendarApi.unselect(); // clear date selection
    // calendarApi.getEvents().forEach(event => {
    //   event.remove();
    // });
    calendarApi.addEvent({
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
    });
    this.mish=JSON.stringify(calendarApi.getEvents())
    console.log("calendar:"+this.mish)
    this.newObj = {
      start: [selectInfo.start.getHours(), selectInfo.start.getMinutes()],
      end: [selectInfo.end.getHours(), selectInfo.end.getMinutes()],
      day: selectInfo.start.getDay(),
    };
    
    this.objectsArray.push(this.newObj);//הכנסה למערך
    
    this.days=JSON.stringify(this.newObj.day+1);
    if (this.newObj.day==0)
      this.days='ימי ראשון'
      if (this.newObj.day==1)
      this.days='ימי שני'
      if (this.newObj.day==2)
      this.days='ימי שלישי'
      if (this.newObj.day==3)
      this.days='ימי רביעי'
      if (this.newObj.day==4)
      this.days='ימי חמישי'
    this.startHours=JSON.stringify(this.newObj.start);
    this.endHours=JSON.stringify(this.newObj.end);
    // this.aaa=JSON.stringify(this.newObj)//המרת המשתנה למחרוזת
    console.log('new obj' + JSON.stringify(this.objectsArray));
    this.myDate = selectInfo.start; // שמירת התאריך שנבחר למשתנה
  }
  //מחיקת אירוע
  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete`)) {
      clickInfo.event.remove();
    }
  }
  onSave(){
    this.newServise
  }
  
 
}
