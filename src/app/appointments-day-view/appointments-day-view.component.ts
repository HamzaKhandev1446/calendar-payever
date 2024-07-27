import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import moment from 'moment';
import {
  DialogBoxComponent,
  AppointmentData,
} from '../shared/components/dialog-box/dialog-box.component';
import { MatIcon } from '@angular/material/icon';
import { Appointment } from '../shared/interfaces/calender.interfaces';
import { AppointmentCalendarService } from '../shared/services/appointment-calendar.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-appointments-day-view',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    FormsModule,
    MatDialogModule,
    MatIcon,
  ],
  templateUrl: './appointments-day-view.component.html',
  styleUrls: ['./appointments-day-view.component.scss'],
})
export class AppointmentsDayViewComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private appointmentCalendarService: AppointmentCalendarService,
    public route: ActivatedRoute,
  ) {}

  hours: string[] = [];
  appointmentsByHour: { [key: string]: Appointment[] } = {};
  selectedCalenderDate: Date = new Date();
  alreadyFilledData: Appointment[] = [];
  selectedDate: string = moment(this.selectedCalenderDate).format('YYYY-MM-DD');

  ngOnInit() {
    this.subscribeToQueryParams();
  }

  subscribeToQueryParams() {
    this.route.queryParams.subscribe((params) => { 
      this.selectedDate = params['date'];
      this.alreadyFilledData =
        this.appointmentCalendarService.getDataByDate(this.selectedDate);
        this.initializeHours();
        this.initializeAppointments();
        this.fillAlreadyFilledData();
     } 
    );
  }

  initializeHours() {
    this.hours = []; // Clear previous hours
    for (let i = 0; i < 24; i++) {
      this.hours.push(moment().startOf('day').add(i, 'hours').format('HH:mm'));
    }
  }

  initializeAppointments() {
    this.appointmentsByHour = {}; // Clear previous appointments
    this.hours.forEach((hour) => {
      this.appointmentsByHour[hour] = [];
    });
  }

  fillAlreadyFilledData() {
    this.alreadyFilledData.forEach((appointment) => {
      const hour = moment(appointment.startTime).format('HH:mm');
      if (this.appointmentsByHour[hour] && appointment.title !== '') {
        this.appointmentsByHour[hour].push(appointment);
      }
    });
  }

  addAppointment(data: AppointmentData) {
    const hour = moment(data.startTime).format('HH:mm');
    if (this.appointmentsByHour[hour]) {
      this.appointmentsByHour[hour].push({
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
      });
    }
    this.updateServiceData(this.selectedDate);
  }

  updateAppointment(appointment: Appointment, data: AppointmentData) {
    const oldHour = moment(appointment.startTime).format('HH:mm');
    const newHour = moment(data.startTime).format('HH:mm');

    // Remove from old hour
    if (this.appointmentsByHour[oldHour]) {
      const index = this.appointmentsByHour[oldHour].indexOf(appointment);
      if (index > -1) {
        this.appointmentsByHour[oldHour].splice(index, 1);
      }
    }

    // Add to new hour
    if (this.appointmentsByHour[newHour]) {
      appointment.title = data.title;
      appointment.startTime = data.startTime;
      appointment.endTime = data.endTime;
      this.appointmentsByHour[newHour].push(appointment);
    }
    this.updateServiceData(this.selectedDate);
  }

  deleteAppointment(appointment: Appointment, event: Event) {
    event.stopPropagation(); // Prevent event bubbling
    const hour = moment(appointment.startTime).format('HH:mm');
    if (this.appointmentsByHour[hour]) {
      const index = this.appointmentsByHour[hour].indexOf(appointment);
      if (index > -1) {
        this.appointmentsByHour[hour].splice(index, 1);
      }
    }
    this.updateServiceData(this.selectedDate);
  }

  drop(event: CdkDragDrop<Appointment[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.updateServiceData(this.selectedDate);
  }

  selectSlot(hour: string, event: Event): void {
    event.stopPropagation(); // Prevent event bubbling
    const appointments = this.appointmentsByHour[hour];
    if (appointments && appointments.length > 0) {
      this.openDialog(appointments[0], event);
    } else {
      const startTime = moment(this.selectedDate)
        .startOf('day')
        .add(hour.split(':')[0], 'hours')
        .toISOString();
      const endTime = moment(startTime).add(1, 'hours').toISOString();
      this.openDialog({ title: '', startTime, endTime }, event);
    }
  }

  openDialog(appointment?: Appointment, event?: Event): void {
    if (event) {
      event.stopPropagation(); // Prevent event bubbling
    }
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '450px',
      height: '450px',
      data: appointment
        ? { ...appointment }
        : {
            title: '',
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
          },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (appointment) {
          this.updateAppointment(appointment, result);
        } else {
          this.addAppointment(result);
        }
      }
    });
  }

  updateServiceData(date: string) {
    const appointmentsForDate = Object.keys(this.appointmentsByHour).flatMap(hour => this.appointmentsByHour[hour]);
    this.appointmentCalendarService.updateAppointmentsForDate(
      date,
      appointmentsForDate
    );
  }
}
