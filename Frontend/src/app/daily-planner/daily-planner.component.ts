import {
  Component,
  EventEmitter,
  Inject,
  Output,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NewService } from '../new.service';
import { CalendarOptions, DateSelectArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { DatePipe } from '@angular/common';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'app-daily-planner',
  templateUrl: './daily-planner.component.html',
  styleUrls: ['./daily-planner.component.scss'],
})
export class DailyPlannerComponent {
  @Output() dialogClosed: EventEmitter<any> = new EventEmitter();
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

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
  takenLessonArray: any[] = [];
  dailyTakenArray: any[] = [];
  isTaken: boolean;
  CalendarCounter: number = 0;
  nextButton: HTMLButtonElement;
  prevButton: HTMLButtonElement;
  timeRanges: string[] = ['morning', 'noon', 'afternoon', 'evening'];
  appointmentGuid: number = 1;
  userProfile = JSON.parse(localStorage.getItem('userProfile'));


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
    editable: true,
    selectable: true,
    selectMirror: true,
    selectAllow: this.selectAllow.bind(this),
    select: this.handleDateSelect.bind(this),
    dateClick: this.handleDateClick.bind(this),
  };

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
    this.nextButton.disabled = false;
  }
  handlePrevClick() {
    const calendarApi = this.calendarComponent.getApi();
    if (this.CalendarCounter > 0) {
      calendarApi.prev();
      this.CalendarCounter--;
      this.nextButton.disabled = false;
      if (this.CalendarCounter === 0) {
        this.prevButton.disabled = true;
      }
    }
  }
  handleNextClick() {
    const calendarApi = this.calendarComponent.getApi();
    if (this.CalendarCounter < 3) {
      calendarApi.next();
      this.CalendarCounter++;
      this.prevButton.disabled = false;
      if (this.CalendarCounter === 3) {
        this.nextButton.disabled = true;
      }
    }
  }
  selectAllow(selectInfo: any) {
    const selectedDate = selectInfo.start;
    const today = new Date();
    const lastDayOf3Month = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 4,
      0
    );

    return selectedDate >= today && selectedDate <= lastDayOf3Month;
  }

  handleDateClick(arg) {
    const calendarApi = arg.view.calendar;
    const selectedDate = new Date(arg.date);
    if (this.availableDays.has(selectedDate.getDay())) {
      if (selectedDate.getMonth() > calendarApi.getDate().getMonth()) {
        if (this.CalendarCounter < 3) {
          calendarApi.gotoDate(selectedDate);
          this.CalendarCounter++;
          this.prevButton.disabled = false;
        } else this.nextButton.disabled = true;
      }
      if (selectedDate.getMonth() < calendarApi.getDate().getMonth()) {
        if (this.CalendarCounter > 0) {
          calendarApi.gotoDate(selectedDate);
          this.CalendarCounter--;
          this.nextButton.disabled = false;
        } else this.prevButton.disabled = true;
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

    this.newService.getLessonByTeacher(this.product.userId).subscribe(
      (data) => {
        for (let index = 0; index < data.lesson.length; index++) {

          const newDate = {
            start: new Date(data.lesson[index].myDate),
            end: new Date(data.lesson[index].endDate),
          };

          this.takenLessonArray.push(newDate);
        }
      },
      (error) => {
        console.error('Error:', error.error.message);
        this.errorMessage = error.error.message;
      }
    );
    this.newService.getAllTeacherBusyEvents(this.product.userId).subscribe(
      (data) => {
        for (let index = 0; index < data.busyEvent.length; index++) {

          const newDate = {
            start: new Date(data.busyEvent[index].startDate),
            end: new Date(data.busyEvent[index].endDate),
          };

          this.takenLessonArray.push(newDate);
        }
        console.log(data)

      },
      (error) => {
        console.error('Error:', error.error.message);
        this.errorMessage = error.error.message;
      }
    );

  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.appointmentGuid=2
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
        this.teacherAvailabilityArray[index].start.setFullYear(
          this.myDate.getFullYear(),
          this.myDate.getMonth(),
          this.myDate.getDate()
        );
        this.teacherAvailabilityArray[index].end.setFullYear(
          this.myDate.getFullYear(),
          this.myDate.getMonth(),
          this.myDate.getDate()
        );

        this.newObjArray.push(this.teacherAvailabilityArray[index]);
      }
    }
    for (let index = 0; index < this.takenLessonArray.length; index++) {
      if (
        this.datePipe.transform(
          this.takenLessonArray[index].start,
          'yyyy-MM-dd'
        ) === this.datePipe.transform(this.myDate, 'yyyy-MM-dd')
      ) {
        this.dailyTakenArray.push(this.takenLessonArray[index]);
      }
    }

    this.removeOverlappingTimes();
  }

  removeOverlappingTimes() {
    let updatedArray2: any[] = [];
    let eventsToCheck = [...this.newObjArray];

    for (let i = 0; i < eventsToCheck.length; i++) {
      let event = eventsToCheck[i];
      let eventStart = new Date(event.start);
      let eventEnd = new Date(event.end);

      this.dailyTakenArray.forEach((removeEvent) => {
        const removeStart = new Date(
          new Date(removeEvent.start.getTime() - 15 * 60000)
        );
        const removeEnd = new Date(
          new Date(removeEvent.end.getTime() + 15 * 60000)
        );

        if (
          removeStart <= eventStart &&
          removeEnd < eventEnd &&
          removeEnd > eventStart
        ) {
          // Overlap at the beginning
          eventStart = removeEnd;
        } else if (
          removeStart > eventStart &&
          removeEnd >= eventEnd &&
          removeStart < eventEnd
        ) {
          // Overlap at the end
          eventEnd = removeStart;
        } else if (removeStart > eventStart && removeEnd < eventEnd) {
          // Overlap in the middle
          eventsToCheck.push({
            start: removeEnd,
            end: eventEnd,
          });
          eventEnd = removeStart;
        } else if (removeStart <= eventStart && removeEnd >= eventEnd) {
          // Whole event is overlapped
          eventStart = eventEnd; // This will skip adding the event
        }
      });
      const eventDuration = (eventEnd.getTime() - eventStart.getTime()) / 60000; // אורך השיעור בדקות

      if (eventDuration >= this.product.length) {
        updatedArray2.push({
          start: new Date(eventStart),
          end: new Date(eventEnd),
        });
      }
    }

    if (updatedArray2.length === 0) {
      this.isTaken = true;
    } else this.isTaken = false;

    this.newObjArray = updatedArray2;
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

    this.lessonsArray.forEach((person) => {
      this.comparisonArray.push(person);
    });
  }
  getTimeOfDay(lesson: string): string {
    const hour = +lesson.split(':')[0];
    if (hour >= 0 && hour < 6) {
        return 'morning';
    } else if (hour >= 6 && hour < 12) {
        return 'noon';
    } else if (hour >= 12 && hour < 18) {
        return 'afternoon';
    } else {
        return 'evening';
    }
}
areThereLessonsInTimeRange(timeRange: string): boolean {
  return this.lessonsArray.some(lesson => this.getTimeOfDay(lesson) === timeRange);
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
        teacher_name:this.product.userProfileName,
        student_name:this.userProfile.name,
        product_id: this.product._id,
        teacher_id: this.product.userId,
        length: this.product.length,
        // myDate: '2024-07-19T12:15:00Z',
        myDate: this.myDate,
      })
      .subscribe(
        (data) => {
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
