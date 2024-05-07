import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NewService } from '../new.service';
import { Calendar, CalendarOptions, DateSelectArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { format, differenceInSeconds } from 'date-fns';

@Component({
  selector: 'app-daily-planner',
  templateUrl: './daily-planner.component.html',
  styleUrls: ['./daily-planner.component.scss'],
})
export class DailyPlannerComponent {
  myDate: any;
  product: any;
  userId = localStorage.getItem('userId');
  errorMessage: any;
  availableStartHours: any;
  possibleLessonsPerDay: any;
  availableEndHours:any;
  lessonsArray: any[];
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private newService: NewService
  ) {
    this.product = data.product;
    this.lessonsArray = [];
  }

  calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek',
    },
    initialView: 'dayGridMonth',
    editable: true,
    selectable: true,
    selectMirror: true,
    select: this.handleDateSelect.bind(this),
  };
  formatTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const formattedTime = format(date, 'HH:mm');
    return formattedTime;
  }

  calculatePossibleLessons(end, start, length) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const lessonLength = length;
    const startTimeInMinutes =
      (startDate.getHours() * 60) + startDate.getMinutes();
    const endTimeInMinutes = (endDate.getHours() * 60) + endDate.getMinutes();

    const amountOfLessons = Math.floor(
      (endTimeInMinutes - startTimeInMinutes + 15) / (lessonLength + 15)
    );
    // this.lessonsArray = [];
    // for (let i = 0; i < amountOfLessons; i++) {
    //   this.lessonsArray.push(i);
    // }
        return amountOfLessons;
  }

  ngOnInit() {
    this.newService.getSchedule(this.product.userId).subscribe((data) => {
      // this.possibleLessonsPerDay
      console.log('possible lessons', this.possibleLessonsPerDay);

      for (
        let index = 0;
        index < data.schedule[0].objectsArray.length;
        index++
      ) {
        this.availableStartHours = data.schedule[0].objectsArray[index].start;
        this.availableEndHours = data.schedule[0].objectsArray[index].end;
        // const formattedStartHours = this.formatTime(this.availableStartHours);
        // const formattedEndHours = this.formatTime(this.availableEndHours);
        // console.log('start time:', formattedStartHours);
        // console.log('end time:', formattedEndHours);
        console.log(
          'calc:',
          this.calculatePossibleLessons(
            data.schedule[0].objectsArray[index].end,
            data.schedule[0].objectsArray[index].start,
            60
            //כרגע שולחת 60 במקום אורך השיעור האמיתי כי השליפה שלו לא נכונה כאן:
            // this.product.length
          )
        );
      }
      // const availableHours=data.schedule[0].objectsArray[0].start
      console.log('Response schedule:', data);
      // data.schedule[0].objectsArray.forEach((object) => {
      this.calendarOptions.events = data.schedule[0].objectsArray;
      // });
    });
  }

  //קביעת אירוע
  handleDateSelect(selectInfo: DateSelectArg) {
    const title = 'my lesson';
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    calendarApi.getEvents().forEach((event) => {
      event.remove();
    });
    calendarApi.addEvent({
      title,
      start: selectInfo.startStr,
    });

    this.myDate = selectInfo.start; // שמירת התאריך שנבחר למשתנה
  }

  createLesson() {
    this.newService
      .createLesson({
        student_id: this.userId,
        product_id: this.product._id,
        teacher_id: this.product.userId,
        length: this.product.length,
        myDate: this.myDate,
      })
      .subscribe(
        (data) => {
          console.log('date:', this.myDate);
          console.log('Response:', data);
          this.dialog.closeAll();
          // window.location.reload(); // רענון העמוד
        },
        (error) => {
          console.error('Error:', error.error.message);
          this.errorMessage = error.error.message;
        }
      );
  }
}
