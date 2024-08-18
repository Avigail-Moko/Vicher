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
import { DeleteLessonDialogComponent } from '../delete-lesson-dialog/delete-lesson-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Renderer2 } from '@angular/core';


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

  constructor(private newService:NewService,public dialog: MatDialog,
    private router:Router,) {
  }

//   navigateToUserView(partner_id: any){
//   this.router.navigate(['/user-view'], { state: { partner_id: partner_id } });
// }
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

  eventDidMount: this.setupTooltip.bind(this)

  };

  setupTooltip(info: any) {
  
    const eventEl = info.el;
    const extendedProps= info.event.extendedProps
    console.log(extendedProps)
    const lesson_title= extendedProps.lesson_title
    const teacher_name= extendedProps.teacher_name
    const student_name= extendedProps.student_name
    const teacher_id=extendedProps.teacher_id;
    const student_id=extendedProps.student_id;
    const userProfile=JSON.parse(localStorage.getItem('userProfile'));
    const partner_id=userProfile._id===teacher_id?student_id:teacher_id;
    const partner=userProfile.name===teacher_name?student_name:teacher_name;

    const tooltipContainerElement = document.getElementById('tooltipContainer');
    if (!tooltipContainerElement) return;

    // Update tooltipContainer content
    const lessonTitleEl = tooltipContainerElement.querySelector('#lesson_title');
    const partnerEl = tooltipContainerElement.querySelector('#partner');



  
    // מיקום ה-tooltipContainer על פי מיקום העכבר
    eventEl.addEventListener('mouseenter', (event: MouseEvent) => {
      if (lessonTitleEl) lessonTitleEl.textContent = lesson_title;
      if (partnerEl) partnerEl.textContent = partner;
      tooltipContainerElement.style.display = 'block';
      const rect = eventEl.getBoundingClientRect();
      const tooltipContainerWidth = tooltipContainerElement.offsetWidth;    
      tooltipContainerElement.style.left = `${rect.left + window.scrollX + (rect.width / 2) - (tooltipContainerWidth / 2)}px`;
      tooltipContainerElement.style.top = `${rect.top + window.scrollY - tooltipContainerElement.offsetHeight }px`;
    
    });
  

    const handleMouseLeave = (event: MouseEvent) => {
      const relatedTarget = event.relatedTarget as HTMLElement;
      
        if (
          !tooltipContainerElement.contains(relatedTarget) &&
          relatedTarget !== eventEl
        ) {
          tooltipContainerElement.style.display = 'none';
        };
    };
    eventEl.addEventListener('mouseleave', handleMouseLeave);
    tooltipContainerElement.addEventListener('mouseleave', handleMouseLeave);

    tooltipContainerElement.querySelector('#partner')?.addEventListener('click', () => {
      this.router.navigate(['/user-view'], { state: { partner_id: partner_id } });
  });
 }

  // navigateToUserView(partner_id: any){
  //     this.router.navigate(['/user-view'], { state: { partner_id: partner_id } });
  //   }
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
            teacher_name:object.teacher_name,
            student_name:object.student_name,
            teacher_id:object.teacher_id,
            student_id:object.student_id,
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
 // קומפוננטה שפותחת את הדיאלוג
handleEventClick(clickInfo: EventClickArg) {
  const dialog = this.dialog.open(DeleteLessonDialogComponent, {
    // data: { email: clickInfo.event. }
  });

  dialog.afterClosed().subscribe((result) => {
    if (result === true) {
      this.newService.deleteLesson(clickInfo.event.id).subscribe(
        (data) => {
          console.log('Response:', data);
          clickInfo.event.remove();  // מסיר את האירוע מהיומן
        },
        (error) => {
          console.error('Error:', error.error.message);
        }
      );
    }
    console.log('The dialog was closed');
  });
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
  // const tooltipContainerElement = document.createElement('div');
  // tooltipContainerElement.className = 'tooltip';
  // tooltipContainerElement.textContent = this.tooltipContent;
  // document.body.appendChild(tooltipContainerElement);

  // const mouseEnterEvent = mouseEnterInfo.jsEvent;
  // tooltipContainerElement.style.position = 'absolute';
  // tooltipContainerElement.style.left = `${mouseEnterEvent.pageX + 10}px`;
  // tooltipContainerElement.style.top = `${mouseEnterEvent.pageY + 10}px`;
  // alert('is working')
// }

// handleEventMouseLeave() {
  // const tooltipElement = document.querySelector('.tooltip');
  // if (tooltipElement) {
  //   tooltipElement.remove();
  // }
// }

}

