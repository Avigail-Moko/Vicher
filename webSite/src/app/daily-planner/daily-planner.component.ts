import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NewService } from '../new.service';
import { CalendarOptions, DateSelectArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-daily-planner',
  templateUrl: './daily-planner.component.html',
  styleUrls: ['./daily-planner.component.scss'],
})
export class DailyPlannerComponent {
  @Output() dialogClosed: EventEmitter<any> = new EventEmitter();

  selectedLesson: string | null = null; // ניהול שיעור נבחר יחיד

  hasSelectedLessons: boolean = false;
  lessonsArray: any[] = [];
  myDate: any;
  product: any;
  userId = localStorage.getItem('userId');
  errorMessage: any;
  teacherAvailabilityArray: any[] = [];
  comparisonArray: any[] = [];
  flag: boolean = false;
  newObjArray: any[] = [2];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private newService: NewService
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
      const availableDays = new Set<number>();
      for (
        let index = 0;
        index < data.schedule[0].objectsArray.length;
        index++
      ) {
        this.teacherAvailabilityArray[index] = {
          start: new Date(data.schedule[0].objectsArray[index].start),
          end: new Date(data.schedule[0].objectsArray[index].end),
        };
        const start = new Date(data.schedule[0].objectsArray[index].start);
        availableDays.add(start.getDay());
      }

      this.calendarOptions.selectConstraint = {
        daysOfWeek: Array.from(availableDays),
      };
      console.log(availableDays);
    });
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.selectedLesson = null;
    this.newObjArray = [];
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
        this.newObjArray.push(this.teacherAvailabilityArray[index]);
      }
    }
    this.calculatePossibleLessons(this.newObjArray);
  }

  isSelected(lesson: string): boolean {
    return this.selectedLesson === lesson;
  }

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
    });
  }

  choosingTime(lesson) {
    if (this.selectedLesson === lesson) {
      this.selectedLesson = null;
    } else {
      this.selectedLesson = lesson;
    }

    this.lessonsArray.forEach((person) => {
      if (person !== lesson && !this.comparisonArray.includes(person)) {
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
        },
        (error) => {
          console.error('Error:', error.error.message);
          this.errorMessage = error.error.message;
        }
      );
  }
}
