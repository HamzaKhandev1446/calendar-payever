import { Injectable } from '@angular/core';
import moment from 'moment';
import { Appointment } from '../interfaces/calender.interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CalendarDay {
  [key: string]: Appointment[];
}

@Injectable({
  providedIn: 'root',
})
export class AppointmentCalendarService {
  private calendarData: CalendarDay[] = [];
  private appointmentsSubject = new BehaviorSubject<CalendarDay[]>(this.calendarData);

  appointments$ = this.appointmentsSubject.asObservable();

  constructor() {
    this.initializeCalendarData();
  }

  private initializeCalendarData() {
    for (let i = -30; i <= 30; i++) {
      const date = moment().startOf('day').add(i, 'days').format('YYYY-MM-DD');
      const appointments: Appointment[] = this.initializeHoursForDate(date);
      this.calendarData.push({ [date]: appointments });
    }
    this.appointmentsSubject.next(this.calendarData);
  }

  private initializeHoursForDate(date: string): Appointment[] {
    const appointments: Appointment[] = [];
    for (let i = 0; i < 24; i++) {
      const startTime = moment(date).startOf('day').add(i, 'hours').toISOString();
      const endTime = moment(startTime).add(1, 'hour').toISOString();
      appointments.push({ title: '', startTime, endTime });
    }
    return appointments;
  }

  getAllData(): CalendarDay[] {
    return this.calendarData;
  }

  getDataByDate(date: string): Appointment[] {
    const dayData = this.calendarData.find(day => day.hasOwnProperty(date));
    return dayData ? dayData[date] : [];
  }

  updateAppointmentsForDate(date: string, newAppointments: Appointment[]): void {
    const dayIndex = this.calendarData.findIndex(day => day.hasOwnProperty(date));
    if (dayIndex !== -1) {
      this.calendarData[dayIndex][date] = newAppointments;
    }
    this.appointmentsSubject.next(this.calendarData);
  }

  getAllScheduledAppointments(): Observable<Appointment[]> {
    return this.appointments$.pipe(
      map(calendarData =>
        calendarData.flatMap(day => 
          Object.entries(day).flatMap(([date, appointments]) =>
            appointments
              .filter(appointment => appointment.title !== '')
              .map(appointment => ({
                ...appointment,
                startTime: moment(appointment.startTime).format('YYYY-MM-DD HH:mm'),
                endTime: moment(appointment.endTime).format('YYYY-MM-DD HH:mm'),
                time: date
              }))
          )
        )
      )
    );
  }
}
