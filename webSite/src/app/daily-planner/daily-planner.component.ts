import {  Component, EventEmitter, Inject, Output} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NewService } from '../new.service';
import { Calendar, CalendarOptions, DateSelectArg} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-daily-planner',
  templateUrl: './daily-planner.component.html',
  styleUrls: ['./daily-planner.component.scss']
})
export class DailyPlannerComponent {
  myDate:any;
  product: any;
  userId =localStorage.getItem('userId');
  errorMessage: any;

constructor(@Inject(MAT_DIALOG_DATA) public data: any,
public dialog:MatDialog,
private newService:NewService,
){
  this.product = data.product; 
}


calendarOptions: CalendarOptions = {
  plugins: [
    interactionPlugin,
    dayGridPlugin,
    timeGridPlugin,
  ],
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek'
  },
  initialView: 'dayGridMonth',
  editable: true,
  selectable: true,
  selectMirror: true,
  select: this.handleDateSelect.bind(this),

};

//קביעת אירוע
handleDateSelect(selectInfo: DateSelectArg) {
  const title = 'my lesson';
  const calendarApi = selectInfo.view.calendar;

  calendarApi.unselect(); // clear date selection

    calendarApi.getEvents().forEach(event => {
      event.remove();
    });
    calendarApi.addEvent({
      title,
      start: selectInfo.startStr,
    });
    
     this.myDate = selectInfo.start; // שמירת התאריך שנבחר למשתנה 
    
  };


createLesson(){
   this.newService.createLesson({
    student_id:this.userId,
    product_id:this.product._id,
    teacher_id:this.product.userId,
    length:this.product.length,
  myDate:this.myDate 
}).subscribe(
      (data) => {
        console.log('date:',this.myDate)
        console.log('Response:', data);
        this.dialog.closeAll();
        // window.location.reload(); // רענון העמוד
      },
      (error) => {
        console.error('Error:', error.error.message);
        this.errorMessage = error.error.message;
      })}
  }
  



