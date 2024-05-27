import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NewService } from '../new.service';
import { CalendarOptions, DateSelectArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-daily-planner',
  templateUrl: './daily-planner.component.html',
  styleUrls: ['./daily-planner.component.scss'],
})
export class DailyPlannerComponent {
  @Output() dialogClosed: EventEmitter<any> = new EventEmitter();

  selectedLesson: string | null = null; 
  hasSelectedLessons: boolean = false;
  lessonsArray: any[] = [];
  myDate: any;
  product: any;
  userId = localStorage.getItem('userId');
  errorMessage: any;
  teacherAvailabilityArray: any[] = [];
  comparisonArray: any[] = [];
  flag: boolean = false;
  newObjArray: any[] = [];
  availableDays: Set<number> = new Set(); 
  takenLessonArray: Date[] = [];
  dailyTakenArray: any[] = [];
  isTaken: boolean;
  startMonth=new Date(new Date().setDate(1))
  endDate = new Date(this.startMonth.getFullYear(), this.startMonth.getMonth() + 3, 1);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private newService: NewService,
    private datePipe: DatePipe
  ) {
    this.product = data.product;
  }

  calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin],
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'today',
    },
    validRange: {
      start: this.startMonth,
      end: this.endDate
    },
    initialView: 'dayGridMonth',
    editable: true,
    selectable: true,
    selectMirror: true,
    selectAllow:this.selectAllow.bind(this),
    select: this.handleDateSelect.bind(this),
    dateClick: this.handleDateClick.bind(this),
  };

  selectAllow(selectInfo: any) {
    const selectedDate = selectInfo.startStr;
    const todayStr = new Date().toISOString().split('T')[0];

    return selectedDate >= todayStr; 
  }
  handleDateClick(arg) {
    const calendarApi = arg.view.calendar;
    const selectedDate = new Date(arg.date);
    const today = new Date();
    if (selectedDate >= today) {
          if (this.availableDays.has(selectedDate.getDay())) {
      if (selectedDate.getMonth() !== calendarApi.getDate().getMonth()) {
        calendarApi.gotoDate(selectedDate);
      }
    }
    }
  }

  ngOnInit() {
    this.newService.getSchedule(this.product.userId).subscribe(
      (data) => {
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
          this.availableDays.add(start.getDay());
        }

        this.calendarOptions.selectConstraint = {
          daysOfWeek: Array.from(this.availableDays),
        };
        this.calendarOptions.businessHours = {
          daysOfWeek: Array.from(this.availableDays),
        };
      },
      (error) => {
        console.error('Error:', error.error.message);
        this.errorMessage = error.error.message;
      }
    );

    this.newService.getLessonByProduct(this.product._id).subscribe(
      (data) => {
        for (let index = 0; index < data.lesson.length; index++) {
          const newDate = new Date(data.lesson[index].myDate);
          this.takenLessonArray.push(newDate);
        }
        console.log('רשימה מלאה של כל הזמנים שנתפסו:', this.takenLessonArray);
      },
      (error) => {
        console.error('Error:', error.error.message);
        this.errorMessage = error.error.message;
      }
    );
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.dailyTakenArray = [];
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
    for (let index = 0; index < this.takenLessonArray.length; index++) {
      if (
        this.datePipe.transform(this.takenLessonArray[index], 'yyyy-MM-dd') ===
        this.datePipe.transform(this.myDate, 'yyyy-MM-dd')
      ) {
        this.dailyTakenArray.push(this.takenLessonArray[index]);
      }
    }
    console.log('רשימה פר תאריך:', this.dailyTakenArray);

    this.calculatePossibleLessons(this.newObjArray);
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
    this.dailyTakenArray.forEach((person) => {
      for (let index = this.lessonsArray.length - 1; index >= 0; index--) {
        if (
          this.lessonsArray[index] == this.datePipe.transform(person, 'HH:mm')
        ) {
          this.lessonsArray.splice(index, 1);
          if (this.lessonsArray.length == 0) {
            this.isTaken = true;
          }
          else this.isTaken=false
          console.log('bn', this.datePipe.transform(person, 'HH:mm'));
        }
      }
    });

    this.lessonsArray.forEach((person) => {
      this.comparisonArray.push(person);
    });
  }

  isSelected(lesson: string): boolean {
    return this.selectedLesson === lesson;
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
    this.myDate.setHours(hours, minutes);
    for (let i = this.comparisonArray.length - 1; i >= 0; i--) {
      if (this.comparisonArray[i] === lesson) {
        this.comparisonArray.splice(i, 1);
        myFlag = true;
      }
    }
    if (!myFlag) {
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
