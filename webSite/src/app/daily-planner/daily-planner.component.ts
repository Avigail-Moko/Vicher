import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Output,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NewService } from '../new.service';
import { Calendar, CalendarOptions, DateSelectArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { format, differenceInSeconds } from 'date-fns';
import { DatePipe, Time } from '@angular/common';
import { MatChipListbox } from '@angular/material/chips';
import { trusted } from 'mongoose';


@Component({
  selector: 'app-daily-planner',
  templateUrl: './daily-planner.component.html',
  styleUrls: ['./daily-planner.component.scss'],
})
export class DailyPlannerComponent {
  @ViewChild('chipSelected', { static: false }) chipSelect: ElementRef;
  @Output() dialogClosed: EventEmitter<any> = new EventEmitter();


  hasSelectedLessons: boolean = false;
  lessonsArray: any[] = [];
  myDate: any;
  product: any;
  userId = localStorage.getItem('userId');
  errorMessage: any;
  teacherAvailabilityArray: any[] = [];
  comparisonArray: any[] = [];
  flag: boolean = false;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private newService: NewService,
  ) {
    this.product = data.product;
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

  ngOnInit() {
    this.newService.getSchedule(this.product.userId).subscribe((data) => {
      for (
        let index = 0;
        index < data.schedule[0].objectsArray.length;
        index++
      ) {
        this.teacherAvailabilityArray[index] = {
          start: new Date(data.schedule[0].objectsArray[index].start),
          end: new Date(data.schedule[0].objectsArray[index].end),
        };
      }
    });
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const newObjArray: any[] = [];
    const title = 'my lesson';
    const calendarApi = selectInfo.view.calendar;

    calendarApi.removeAllEvents();

    calendarApi.addEvent({
      title,
      start: selectInfo.startStr,
    });
    this.myDate = selectInfo.start;

    for (let index = 0; index < this.teacherAvailabilityArray.length; index++) {
      if (
        this.teacherAvailabilityArray[index].start.getDay() ===
        this.myDate.getDay()
      ) {
        newObjArray.push(this.teacherAvailabilityArray[index]);
      }
    }
    this.calculatePossibleLessons(newObjArray);
  }
  
  //בעצם הבעיה היא: שאם עוברים לתאריך עם אותה שעה- היא נשארת כאילו בחרו אותה. 

  // (handleDateSelect) הפתרון הוא: שבפונקצייה שאחראית על בחירת התאריך
  //כלא לחוץ mat-chip-option   צריך להוסיף שורה בהתחלה שעושה את האלמנט 

  calculatePossibleLessons(newObjArray) {
    const emptyArray: any[] = [];
    newObjArray.forEach((person) => {
      const startDate = new Date(person.start);
      const endDate = new Date(person.end);
      const lessonLength = this.product.length;
      const startTimeInMinutes =
        startDate.getHours() * 60 + startDate.getMinutes();
      const endTimeInMinutes = endDate.getHours() * 60 + endDate.getMinutes();

      const numOfLessons = Math.floor(
        (endTimeInMinutes - startTimeInMinutes + 15) / (lessonLength + 15)
      );
      emptyArray.push({ numOfLessons, startDate });
    });
    this.saparatedHoursForLessons(emptyArray);
  }

  saparatedHoursForLessons(emptyArray) {
    this.comparisonArray = [];
    this.lessonsArray = [];
    emptyArray.forEach((person) => {
      const lessonsPerDay = person.numOfLessons;
      const startRange = new Date(person.startDate);
      const firstTime = `${startRange
        .getHours()
        .toString()
        .padStart(2, '0')}:${startRange
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
      this.lessonsArray.push(firstTime);

      for (let index = 1; index < lessonsPerDay; index++) {
        const newAllMinutes =
          startRange.getHours() * 60 +
          startRange.getMinutes() +
          (this.product.length + 15) * index;
        const newTime = `${Math.floor(newAllMinutes / 60)
          .toString()
          .padStart(2, '0')}:${(newAllMinutes % 60)
          .toString()
          .padStart(2, '0')}`;
        this.lessonsArray.push(newTime);
      }
    });
    this.lessonsArray.forEach((person) => {
      this.comparisonArray.push(person);
      console.log('in the for each:', this.comparisonArray);
    });
  }

  choosingTime(lesson) {
    this.lessonsArray.forEach((person) => {
      if (person !== lesson && !(this.comparisonArray.includes(person))) {
        this.comparisonArray.push(person);
      }
    });
    
    let myFlag: boolean = false;
    const [hours, minutes] = lesson.split(':').map(Number);
    console.log('this is my hour:', lesson);
    this.myDate.setHours(hours, minutes);
    for (let i = this.comparisonArray.length - 1; i >= 0; i--) {
      if (this.comparisonArray[i] === lesson) {
        this.comparisonArray.splice(i, 1);
        myFlag = true;
      }
    }
    if (!myFlag) {
      console.log('my flag', myFlag);
      this.comparisonArray.push(lesson);
    }

    console.log('the comparison array:', this.comparisonArray);
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
          this.dialogClosed.emit();
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
