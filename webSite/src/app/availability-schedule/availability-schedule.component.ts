import { Component } from '@angular/core';
import {
  CalendarOptions,
  DateSelectArg,
  DatesSetArg,
  EventClickArg,
  EventDropArg,
  EventSourceInput,
} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {
  EventResizeStartArg,
} from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { NewService } from '../new.service';
import { Message, MessageService } from 'primeng/api';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';

// import { Dropdown, DropdownItem } from 'primeng/dropdown';
// import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-availability-schedule',
  templateUrl: './availability-schedule.component.html',
  styleUrls: ['./availability-schedule.component.scss'],
})
export class AvailabilityScheduleComponent {
  objectsArray: { start: any; end: any; day: any }[] = [];
  newObj: any;
  myForm: FormGroup;
  errorMessage = '';
  indexOfEvent: number;
  teacher_id = localStorage.getItem('userId');
  messages: Message[] | undefined;
  userId = localStorage.getItem('userId');
  userProfile = JSON.parse(localStorage.getItem('userProfile'));
  today: Date;
  lastDayOf3Month: Date;
  loading: boolean = false;
  busyEvents: any[];

  constructor(
    public newService: NewService,
    public messageService: MessageService,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.myForm = this.fb.group({
      endDate: Date,
      startDate: Date,
    });
  }
  load() {
    this.loading = true;

    setTimeout(() => {
        this.loading = false
    }, 2000);
}
  calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin],
    headerToolbar: {
      left: '',
      center: '',
      right: '',
    },
    initialView: 'timeGridWeek',
    initialDate: '2024-05-01',
    dayHeaderFormat: { weekday: 'long' },
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    },
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    },
    selectConstraint: {
      daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
    },
    allDaySlot: false,
    selectOverlap: false,
    // editable: true, //אחראי על הוזזת אירועים
    selectable: true,
    droppable: true,
    selectMirror: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    events: [],
  };

  handleDateSelect(selectInfo: DateSelectArg) {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.addEvent({
      start: selectInfo.startStr,
      end: selectInfo.endStr,
    });

    this.newObj = {
      start: selectInfo.startStr,
      end: selectInfo.endStr,
    };

    this.objectsArray.push(this.newObj);
    console.log('objects array:', this.objectsArray);
    this.openSnackBar();
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete`)) {
      //מציאת מיקום האירוע במערך האירועים שב objectsArray ומחיקתו
      for (let item = 0; item < this.objectsArray.length; item++) {
        if (
          this.objectsArray[item].start === clickInfo.event.startStr &&
          this.objectsArray[item].end === clickInfo.event.endStr
        ) {
          this.indexOfEvent = item;
        }
      }
      this.objectsArray.splice(this.indexOfEvent, 1);
      //מחיקת האירוע מהקלנדר
      clickInfo.event.remove();
      this.openSnackBar();
    }
  }
  ngOnInit() {
    this.today = new Date();
    this.lastDayOf3Month = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 4,
      0
    );
    this.newService.getSchedule(this.teacher_id).subscribe(
      (data) => {
        console.log('Response:', data);
        data.schedule[0].objectsArray.forEach((object) => {
          this.objectsArray.push(object);
          this.calendarOptions.events = this.objectsArray;
        });
      },
      (error) => {
        console.error('Error:', error.error.message);
      }
    );
    this.newService.getAllTeacherBusyEvents(this.teacher_id).subscribe(
      (data) => {
        console.log('Response:', data);
        this.busyEvents=data.busyEvent
        console.log('this.busyEvent',this.busyEvents )
        console.log('data',data )
      },
      (error) => {
        console.error('Error:', error.error.message);
      }
    );

  }
  onSave() {
    this.newService
      .createSchedule(this.objectsArray, this.teacher_id)
      .subscribe(
        (data) => {
          console.log('Response:', data);
          this.messageService.add({
            severity: 'success',
            detail: 'Your Details Saved Successfully!',
          });
        },
        (error) => {
          console.error('Error:', error.error.message);
          this.messageService.add({
            severity: 'error',
            detail: 'error on saving data',
          });
        }
      );
  }
  openSnackBar() {
    if (this.objectsArray.length > 0) {
      this._snackBar
        .open(
          'Changes have been made. Remember to save them. Otherwise, they will not be preserved',
          'Save Changes',
          {
            horizontalPosition: 'start',
            verticalPosition: 'bottom',
          }
        )
        .onAction()
        .subscribe(() => {
          this.onSave();
        });
    } else {
      this._snackBar.dismiss(); // תקרא לפונקציה dismiss כאן
    }
  }

  createBusyEvent() {
    this.load()
    const teacher_id = this.userId;
    const startDate = this.myForm.value.startDate;
    const endDate = this.myForm.value.endDate;
    this.newService.createBusyEvent({ teacher_id, startDate,endDate }).subscribe(
      (data) => {
        console.log('Response:', data);
      },
      (error) => {
        console.error('Error:', error.error.message);
        this.errorMessage = error.error.message;
      }
    );
  }
}
