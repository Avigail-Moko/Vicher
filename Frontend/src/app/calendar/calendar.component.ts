import { Component, signal, ChangeDetectorRef, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { NewService } from '../new.service';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FullCalendarComponent } from '@fullcalendar/angular';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  CalendarCounter: number = 0;
  nextButton: HTMLButtonElement;
  prevButton: HTMLButtonElement;
  objectsArray: {}[] = [];
  // myDate:any;

  constructor(private newService:NewService) {
  }

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
    customButtons: {
      prev: {
        text: 'prev',
        click: this.handlePrevClick.bind(this),
      },
      next: {
        text: 'next',
        click: this.handleNextClick.bind(this),
      },
      today: {
        text: 'today',
        click: this.handleTodayClick.bind(this),
      },
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: false,
    selectable: false,
    selectMirror: false,
    dayMaxEvents: true,
    // select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    validRange: {
      start: new Date().toISOString().split('T')[0]  // התאריך של היום
    },
    dayCellDidMount: function(info) {
      var today = new Date();
      var yesterday = new Date(today.setDate(today.getDate() - 1)).toISOString().split('T')[0];
      var cellDate = info.date.toISOString().split('T')[0];
      info.el.classList.toggle('outside-range', cellDate < yesterday);
    },
    // eventsSet: this.handleEvents.bind(this),
    // eventMouseEnter: this.handleEventMouseEnter.bind(this),
    // eventMouseLeave: this.handleEventMouseLeave.bind(this),
  views: {
    timeGrid: {
      eventLimit: 1 // adjust to 6 only for timeGridWeek/timeGridDay
    },
    dayGrid: {
      eventLimit: 1 // כאן אתה יכול לקבוע את המגבלה עבור תצוגת DayGrid בלבד
    }
  },
  eventTimeFormat: { // like '14:30:00'
    hour: '2-digit',
    minute: '2-digit',
    meridiem: false
  },
  displayEventEnd:true,



    eventDidMount(info: any) {
      const eventEl = info.el;
      const extendedProps= info.event.extendedProps
      console.log(extendedProps)
      const lesson_title= extendedProps.lesson_title
      const tooltipContent = `
      <strong>Lesson title:</strong> ${lesson_title}<br>
    `;
      
    
      // יצירת אלמנט tooltip
      const tooltipElement = document.createElement('div');
      tooltipElement.className = 'custom-tooltip';
      tooltipElement.innerHTML = tooltipContent;
    
      // הוספת הסגנונות ל-tooltip
      tooltipElement.style.position = 'absolute';
      tooltipElement.style.zIndex = '9999';
      tooltipElement.style.background = '#FFC107';
      tooltipElement.style.color = 'black';
      tooltipElement.style.width = '150px';
      tooltipElement.style.borderRadius = '3px';
      tooltipElement.style.boxShadow = '0 0 2px rgba(0,0,0,0.5)';
      tooltipElement.style.padding = '10px';
      tooltipElement.style.textAlign = 'center';
      tooltipElement.style.display= 'none';
    
      // הוספת ה-tooltip לגוף הדף
      document.body.appendChild(tooltipElement);
    
      // מיקום ה-tooltip על פי מיקום העכבר
      eventEl.addEventListener('mouseenter', (event: MouseEvent) => {
        tooltipElement.style.display = 'block';
        const rect = eventEl.getBoundingClientRect();
        const tooltipWidth = tooltipElement.offsetWidth;    
        tooltipElement.style.left = `${rect.left + window.scrollX + (rect.width / 2) - (tooltipWidth / 2)}px`;
        tooltipElement.style.top = `${rect.top + window.scrollY - tooltipElement.offsetHeight - 10}px`; // Update position to follow mouse if needed
      
      });
    
      // הסרת ה-tooltip כאשר העכבר עוזב את האיוונט
      eventEl.addEventListener('mouseleave', () => {
        tooltipElement.style.display= 'none';
      });
    }
    
    
    
    
  };

  // currentEvents: EventApi[] = [];
  // tooltipContent: string;
  // workDays: number[] = [];
  // workHours: string[] = [];
  
  ngAfterViewInit() {
    this.nextButton = document.querySelector(
      '.fc-next-button'
    ) as HTMLButtonElement;
    this.prevButton = document.querySelector(
      '.fc-prev-button'
    ) as HTMLButtonElement;
    this.prevButton.disabled = true;
  }
  handleTodayClick() {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.today();
    this.CalendarCounter = 0;
    this.prevButton.disabled = true;
    // this.nextButton.disabled = false;
  }
  handlePrevClick() {
    const calendarApi = this.calendarComponent.getApi();
    if (this.CalendarCounter > 0) {
      calendarApi.prev();
      this.CalendarCounter--;
      // this.nextButton.disabled = false;
      if (this.CalendarCounter === 0) {
        this.prevButton.disabled = true;
      }
    }
  }
  handleNextClick() {
    const calendarApi = this.calendarComponent.getApi();
    // if (this.CalendarCounter < 3) {
      calendarApi.next();
      this.CalendarCounter++;
      this.prevButton.disabled = false;
      // if (this.CalendarCounter === 3) {
      //   this.nextButton.disabled = true;
      // }
    // }
  }

  ngOnInit(): void {
    const student_id=localStorage.getItem('userId');
    const teacher_id=localStorage.getItem('userId');
    this.newService.getLessonByTeacherAndStudentId(student_id,teacher_id).subscribe((data)=>{
      
        console.log('Response:', data);
        data.lessons.forEach((object) => {
          const id=object._id;
          const start=object.myDate;
          const end=object.endDate;
          const backgroundColor=object.teacher_id===localStorage.getItem('userId')?'#D86018':'#3788d8';

          const newObj={
            id,
            start,
            end,
            backgroundColor,
            extendedProps: {
            lesson_title: object.lesson_title,
          }}
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

  // handleCalendarToggle() {
  //   this.calendarVisible = !this.calendarVisible;
  // }

  // handleWeekendsToggle() {
  //   const { calendarOptions } = this;
  //   calendarOptions.weekends = !calendarOptions.weekends;
  // }

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

  // handleEvents(events: EventApi[]) {
  //   this.currentEvents = events;
  //   this.changeDetector.detectChanges();
  // }


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

// handleEventMouseEnter(mouseEnterInfo: any) {
  
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
// }

// handleEventMouseLeave() {
  // const tooltipElement = document.querySelector('.tooltip');
  // if (tooltipElement) {
  //   tooltipElement.remove();
  // }
// }
}
