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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  startDate: Date | undefined;
  endDate: Date | undefined;

  constructor(
    public newService: NewService,
    public messageService: MessageService,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.myForm = this.fb.group({
      nameEvent: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
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
    let endDate = new Date(selectInfo.endStr);
    if (endDate.getHours() === 0 && endDate.getMinutes() === 0) {
      endDate.setMinutes(endDate.getMinutes() - 1);
    }
    
    calendarApi.addEvent({
      start: selectInfo.startStr,
      end: endDate.toISOString(),
    });

    this.newObj = {
      start: selectInfo.startStr,
      end: endDate.toISOString(),
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
    }
    this.openSnackBar();

  }
  calendarChronologicalOrder() {
    this.myForm.get('endDate').valueChanges.subscribe((value) => {

      const startDate = new Date(this.myForm.get('startDate').value);
      const endDate = new Date(this.myForm.get('endDate').value);
      const today = new Date();

      if (endDate <= today) {
        this.myForm.get('endDate').setValue(today);
      }
      if (endDate <= startDate) {
        startDate.setMinutes(startDate.getMinutes() + 1); // להוסיף דקה אחת

        this.myForm.get('endDate').setValue(startDate);
      }
    });
    this.myForm.get('startDate').valueChanges.subscribe((value) => {

      const startDate = new Date(this.myForm.get('startDate').value);
      const endDate = new Date(this.myForm.get('endDate').value);
      const today = new Date();

      if (startDate < today) {
        this.myForm.get('startDate').setValue(today);
      }
      if (endDate <= startDate) {
        startDate.setMinutes(startDate.getMinutes() + 1); // להוסיף דקה אחת

        this.myForm.get('endDate').setValue(startDate);
      }
    });
  }
  ngOnInit() {
    this.calendarChronologicalOrder();

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
    this.getAllTeacherBusyEvents();
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
  getAllTeacherBusyEvents() {
    this.newService.getAllTeacherBusyEvents(this.teacher_id).subscribe(
      (data) => {
        console.log('Response:', data);
        this.busyEvents = data.busyEvent;
      },
      (error) => {
        console.error('Error:', error.error.message);
      }
    );
  }

  createBusyEvent() {
    if (this.myForm.invalid) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }
    this.loading = true;

    const teacher_id = this.userId;
    const nameEvent = this.myForm.value.nameEvent;
    const startDate = this.myForm.value.startDate;
    const endDate = this.myForm.value.endDate;
    this.newService
      .createBusyEvent({ teacher_id, startDate, endDate, nameEvent })
      .subscribe(
        (data) => {
          console.log('Response:', data);
          this.getAllTeacherBusyEvents();
          this.myForm.reset();
          this.endDate=undefined
          this.startDate=undefined
          this.errorMessage = '';
          this.loading = false;
        },
        (error) => {
          console.error('Error:', error.error.message);
          this.errorMessage = error.error.message;
          this.loading = false;
        }
      );
  }
  deleteBusyEvent(_id) {
    this.newService.deleteBusyEvent(_id).subscribe(
      (data) => {
        console.log('Response:', data);
        this.getAllTeacherBusyEvents();
      },
      (error) => {
        console.error('Error:', error.error.message);
        this.errorMessage = error.error.message;
      }
    );
  }
}
