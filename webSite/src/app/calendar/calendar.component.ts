import { Component, signal, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import { INITIAL_EVENTS,createEventId  } from './event-utils';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { NewService } from '../new.service';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  myDate:any;
  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
  views: {
    timeGrid: {
      eventLimit: 1 // adjust to 6 only for timeGridWeek/timeGridDay
    },
    dayGrid: {
      eventLimit: 1 // כאן אתה יכול לקבוע את המגבלה עבור תצוגת DayGrid בלבד
    }
  }
  
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };
  currentEvents: EventApi[] = [];
  // workDays: number[] = [];
  // workHours: string[] = [];
  constructor(private changeDetector: ChangeDetectorRef,private newService:NewService) {
  }

  // ngOnInit(): void {
    
  // }

  // getLessonsForUser(userId: string) {
  //   this.newService.createLessons(userId).subscribe(lessons => {
  //     // עשה משהו עם השיעורים שהתקבלו
  //     console.log(lessons);
  //   });
  // }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  //קביעת אירוע
  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      // calendarApi.getEvents().forEach(event => {
      //   event.remove();
      // });
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
      
       this.myDate = selectInfo.start; // שמירת התאריך שנבחר למשתנה 


      //  this.selectedDateEmitter.emit(selectInfo.start); // שליחת התאריך שנבחר לקומפוננטה האב

      // localStorage.setItem('myDate', JSON.stringify(myDate));

    }
  }
//מחיקת אירוע
  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }


// toggleWorkDay(event: any, day: string) {
//   if (event.checked) {
//     this.workDays.push(new Date().getDay());
//   } else {
//     const index = this.workDays.indexOf(new Date().getDay());
//     if (index > -1) {
//       this.workDays.splice(index, 1);
//     }
//   }
// }

// selectWorkHours(event: MatSelectChange) {
//   this.workHours = event.value;
// }

// saveAvailability() {
//   console.log('Work Days:', this.workDays);
//   console.log('Work Hours:', this.workHours);
//   // אתה יכול לעדכן את האפשרויות של הלוח כאן על פי הערכים שנבחרו
// }
// updateCalendarAvailability() {
//   const { calendarOptions, workDays, workHours } = this;
  
//   calendarOptions.eventConstraint = {
//     daysOfWeek: workDays, // ימי העבודה שנבחרו
//     startTime: workHours[0], // השעה הראשונה בטווח השעות הנבחר
//     endTime: workHours[workHours.length - 1] // השעה האחרונה בטווח השעות הנבחר
//   };
// }
}
