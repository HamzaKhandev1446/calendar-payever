import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import moment from 'moment';
import { FormsModule } from '@angular/forms';
import { DialogBoxComponent } from '../shared/components/dialog-box/dialog-box.component';
import { MatDialog } from '@angular/material/dialog';

interface Appointment {
  title: string;
  date: Date;
}

@Component({
  selector: 'app-appointments-day-view',
  standalone: true,
  imports: [CommonModule, DragDropModule, FormsModule],
  templateUrl: './appointments-day-view.component.html',
  styleUrls: ['./appointments-day-view.component.scss'],
})
export class AppointmentsDayViewComponent implements OnInit {
  constructor(private dialog: MatDialog) {}
  appointmentTitle!: string;
  appointmentDate!: Date | null;
  hours: string[] = [];
  appointmentsByHour: { [key: string]: Appointment[] } = {};
  selectedCalenderDate: Date = new Date();
  editingAppointment: Appointment | null = null; // To hold the appointment being edited

  ngOnInit() {
    this.initializeHours();
    this.initializeAppointments();
  }

  initializeHours() {
    for (let i = 0; i < 24; i++) {
      this.hours.push(moment().startOf('day').add(i, 'hours').format('HH:00'));
    }
  }

  initializeAppointments() {
    this.hours.forEach((hour) => {
      this.appointmentsByHour[hour] = [];
    });
  }

  addAppointment() {
    if (this.appointmentTitle && this.appointmentDate) {
      const hour = moment(this.appointmentDate).format('HH:00');
      if (this.appointmentsByHour[hour]) {
        this.appointmentsByHour[hour].push({
          title: this.appointmentTitle,
          date: this.appointmentDate,
        });
        this.appointmentTitle = '';
        this.appointmentDate = null;
      }
    }
  }

  editAppointment(appointment: Appointment) {
    this.editingAppointment = appointment;
    this.appointmentTitle = appointment.title;
    this.appointmentDate = appointment.date;
  }

  updateAppointment() {
    if (
      this.editingAppointment &&
      this.appointmentTitle &&
      this.appointmentDate
    ) {
      const oldHour = moment(this.editingAppointment.date).format('HH:00');
      const newHour = moment(this.appointmentDate).format('HH:00');

      // Remove from old hour
      if (this.appointmentsByHour[oldHour]) {
        const index = this.appointmentsByHour[oldHour].indexOf(
          this.editingAppointment
        );
        if (index > -1) {
          this.appointmentsByHour[oldHour].splice(index, 1);
        }
      }

      // Add to new hour
      if (this.appointmentsByHour[newHour]) {
        this.editingAppointment.title = this.appointmentTitle;
        this.editingAppointment.date = this.appointmentDate;
        this.appointmentsByHour[newHour].push(this.editingAppointment);
      }

      this.editingAppointment = null;
      this.appointmentTitle = '';
      this.appointmentDate = null;
    }
  }

  deleteAppointment(appointment: Appointment) {
    const hour = moment(appointment.date).format('HH:00');
    if (this.appointmentsByHour[hour]) {
      const index = this.appointmentsByHour[hour].indexOf(appointment);
      if (index > -1) {
        this.appointmentsByHour[hour].splice(index, 1);
      }
    }
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
  }


  openDialog(appointment?: Appointment): void {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '450px',
      height: '450px',
      data: appointment ? { ...appointment } : { title: '', date: new Date() },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }
}
