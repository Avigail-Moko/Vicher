import { Component } from '@angular/core';
import {
  CalendarOptions,
  DateSelectArg,
  DatesSetArg,
  EventClickArg,
  EventDropArg,
} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {
  EventResizeStartArg,
} from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { NewService } from '../new.service';
import { Message, MessageService } from 'primeng/api';

// import { Dropdown, DropdownItem } from 'primeng/dropdown';
// import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-availability-schedule',
  templateUrl: './availability-schedule.component.html',
  styleUrls: ['./availability-schedule.component.scss'],
})
export class AvailabilityScheduleComponent {
  objectsArray: { start: number[]; end: number[]; day: number }[] = [];
  newObj: any;
  // mish: [];
  indexOfEvent: number;
  teacher_id = localStorage.getItem('userId');
  messages: Message[] | undefined;

  constructor(
    public newServise: NewService,
    public messageService: MessageService
  ) {}
  calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin],
    headerToolbar: {
      left: '',
      center: '',
      right: '',
    },
    initialView: 'timeGridWeek',
    selectOverlap: false,
    // editable: true, //אחראי על הוזזת אירועים
    selectable: true,
    droppable: true,
    selectMirror: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    events: [
      // הוספת אירוע חוזר כל שבוע
      {
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // אירוע יתרחש בכל יום
        startTime: '09:00', // שעת התחלה
        endTime: '17:00', // שעת סיום
        // display: 'inverse-background', // תצוגה של הרקע האירוע
      },
    ],
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

    // console.log("calendar:"+this.mish)

    this.newObj = {
      start: [selectInfo.start.getHours(), selectInfo.start.getMinutes()],
      end: [selectInfo.end.getHours(), selectInfo.end.getMinutes()],
      day: selectInfo.start.getDay(),
    };

    this.objectsArray.push(this.newObj); //הכנסה למערך
  }
  //מחיקת אירוע
  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete`)) {
      //מציאת מיקום האירוע במערך האירועים שב objectsArray ומחיקתו
      for (let item = 0; item < this.objectsArray.length; item++) {
        if (
          this.objectsArray[item].start[0] ==
            clickInfo.event.start.getHours() &&
          this.objectsArray[item].start[1] ==
            clickInfo.event.start.getMinutes() &&
          this.objectsArray[item].end[0] == clickInfo.event.end.getHours() &&
          this.objectsArray[item].end[1] == clickInfo.event.end.getMinutes() &&
          this.objectsArray[item].day == clickInfo.event.start.getDay()
        ) {
          this.indexOfEvent = item;
        }
      }
      this.objectsArray.splice(this.indexOfEvent, 1);
      //מחיקת האירוע מהקלנדר
      clickInfo.event.remove();
    }
  }
  ngOnInit(scheduleInfo:DateSelectArg){
    this.newServise.getSchedule(this.teacher_id).subscribe((data)=>{
      console.log('Response:',data);
      const schedule=scheduleInfo.view.calendar;
      schedule.addEvent({
        start:data.start,
        end:data.end,
        day:data.day
      });
    },
    (error)=>{
      console.error('Error:', error.error.message);
    }
  )
  }
  onSave() {
    this.newServise
      .createSchedule(this.objectsArray, this.teacher_id)
      .subscribe(
        (data) => {
          console.log('Response:', data);
          this.messageService.add({
            severity: 'success',
            detail: 'Your Details Saved Successfully!',
          });
        },
        (error) => {
          console.error('Error:', error.error.message);
          this.messageService.add({
            severity: 'error',
            detail: 'error on saving data',
          });
        }
      );
  }
 
}
