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
  partner_id: any


  constructor(private newService:NewService,public dialog: MatDialog,
    private router:Router,) {
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

  // views: {
  //   timeGrid: {
  //     eventLimit: 1 
  //   },
  //   dayGrid: {
  //     eventLimit: 1
  //   }
  // },
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
    const userProfile=JSON.parse(localStorage.getItem('userProfile'));
    const tooltipContainerElement = document.getElementById('tooltipContainer');
    if (!tooltipContainerElement) return;
    const lessonTitleEl = tooltipContainerElement.querySelector('#lesson_title');
    const partnerEl = tooltipContainerElement.querySelector('#partner');



  
    eventEl.addEventListener('mouseenter', (event: MouseEvent) => {
      const lesson_title= extendedProps.lesson_title
      const teacher_name= extendedProps.teacher_name
      const student_name= extendedProps.student_name
      const teacher_id=extendedProps.teacher_id;
      const student_id=extendedProps.student_id;
      this.partner_id=userProfile._id===teacher_id?student_id:teacher_id;
      const partner=userProfile.name===teacher_name?student_name:teacher_name;
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
      this.router.navigate(['/user-view'], { state: { partner_id: this.partner_id } });
  });
 }

  
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
            myDate:object.myDate
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

handleEventClick(clickInfo: EventClickArg) {
  const extendedProps= clickInfo.event.extendedProps

  const dialog = this.dialog.open(DeleteLessonDialogComponent, {
    data:{
      lesson:extendedProps
    }
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


}

