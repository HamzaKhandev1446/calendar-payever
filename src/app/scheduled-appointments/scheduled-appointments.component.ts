import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentCalendarService } from '../shared/services/appointment-calendar.service';
import { Appointment } from '../shared/interfaces/calender.interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-scheduled-appointments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scheduled-appointments.component.html',
  styleUrls: ['./scheduled-appointments.component.scss'],
})
export class ScheduledAppointmentsComponent {
  scheduledAppointments$: Observable<Appointment[]>;
  @Output() selectedAppointment = new EventEmitter<string>();

  constructor(private appointmentCalendarService: AppointmentCalendarService) {
    this.scheduledAppointments$ = this.appointmentCalendarService.getAllScheduledAppointments();
  }

  selectItem(value: string) {
    this.selectedAppointment.emit(value);
  }
}
