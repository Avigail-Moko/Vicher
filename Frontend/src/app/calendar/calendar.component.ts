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
  objectsArray: { start: any; end: any; title:any; id:any }[] = [];
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
    // select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    eventMouseEnter: this.handleEventMouseEnter.bind(this),
    eventMouseLeave: this.handleEventMouseLeave.bind(this),
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
  tooltipContent: string;
  // workDays: number[] = [];
  // workHours: string[] = [];
  constructor(private changeDetector: ChangeDetectorRef,private newService:NewService) {
  }

  ngOnInit(): void {
    const student_id=localStorage.getItem('userId');
    const teacher_id=localStorage.getItem('userId');
    this.newService.getLessonByTeacherAndStudentId(student_id,teacher_id).subscribe((data)=>{
      
        console.log('Response:', data);
        data.lessons.forEach((object) => {
          const start=object.myDate;
          const end=object.endDate;
          const title=object.lesson_title;
          const id=object._id;
          const newObj={start,end,title,id}
          this.objectsArray.push(newObj);
        });
        console.log('objects Array:',this.objectsArray)
        this.calendarOptions.events = this.objectsArray;
      },
      (error) => {
        console.error('Error:', error.error.message);
      }
    );
    
  }

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

  // //קביעת אירוע
  // handleDateSelect(selectInfo: DateSelectArg) {
  //   const title = prompt('Please enter a new title for your event');
  //   const calendarApi = selectInfo.view.calendar;

  //   calendarApi.unselect(); // clear date selection

  //   if (title) {
   
  //     calendarApi.addEvent({
  //       id: createEventId(),
  //       title,
  //       start: selectInfo.startStr,
  //       end: selectInfo.endStr,
  //       allDay: selectInfo.allDay
  //     });
      
  //      this.myDate = selectInfo.start; // שמירת התאריך שנבחר למשתנה 



  //   }
  // }
//מחיקת אירוע
  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      this.newService.deleteLesson(clickInfo.event.id).subscribe((data)=>{
        console.log('Response:', data);
        clickInfo.event.remove();
      },
      (error) => {
        console.error('Error:', error.error.message);
      }
    );

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

// tooltip:

handleEventMouseEnter(mouseEnterInfo: any) {
  // const event = mouseEnterInfo.event;
  // this.tooltipContent = `${event.title}\n${event.start.toISOString()} - ${event.end ? event.end.toISOString() : 'hhhhhhh'}`;
  // const tooltipElement = document.createElement('div');
  // tooltipElement.className = 'tooltip';
  // tooltipElement.textContent = this.tooltipContent;
  // document.body.appendChild(tooltipElement);

  // const mouseEnterEvent = mouseEnterInfo.jsEvent;
  // tooltipElement.style.position = 'absolute';
  // tooltipElement.style.left = `${mouseEnterEvent.pageX + 10}px`;
  // tooltipElement.style.top = `${mouseEnterEvent.pageY + 10}px`;
  // alert('is working')
}

handleEventMouseLeave() {
  // const tooltipElement = document.querySelector('.tooltip');
  // if (tooltipElement) {
  //   tooltipElement.remove();
  // }
}
}
