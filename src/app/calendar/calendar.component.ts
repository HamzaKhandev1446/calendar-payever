import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { DatePickerComponent } from '../shared/components/date-picker/date-picker.component';
import { AppointmentsDayViewComponent } from '../appointments-day-view/appointments-day-view.component';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { SelectDropdownComponent } from '../shared/components/select-dropdown/select-dropdown.component';
import { TimePeriod } from '../shared/enums/time-periods-dropdown';
import { Appointment, ICalenderDropDownOption } from '../shared/interfaces/calender.interfaces';
import { AppointmentCalendarService } from '../shared/services/appointment-calendar.service';
import moment from 'moment';
import { Observable } from 'rxjs';
import { ScheduledAppointmentsComponent } from '../scheduled-appointments/scheduled-appointments.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    DatePickerComponent,
    AppointmentsDayViewComponent,
    RouterModule,
    SelectDropdownComponent,
    ScheduledAppointmentsComponent, 
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  calendarOptions: ICalenderDropDownOption[] = [];
  selectedCalenderDate: Date = new Date();
  appointmentsByHour: { [key: string]: Appointment[] } = {};
  selectedOption: string = TimePeriod.Day;
  allAppointments$: Observable<Appointment[]>;  

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appointmentCalendarService: AppointmentCalendarService
  ) {
    this.allAppointments$ = this.appointmentCalendarService.getAllScheduledAppointments();
  }

  ngOnInit() {
    this.setCalenderDropdown();
    this.setDropDownSelectedOption(this.selectedOption);
    this.setCalendarDate(null);
  }

  setCalenderDropdown() {
    this.calendarOptions = [
      { value: TimePeriod.Day, viewValue: 'Day', disabled: false },
      { value: TimePeriod.Week, viewValue: 'Week', disabled: true },
      { value: TimePeriod.Month, viewValue: 'Month', disabled: true },
      { value: TimePeriod.Year, viewValue: 'Year', disabled: true },
    ];
  }

  setCalendarDate(event: Date | null) {
    this.selectedCalenderDate = event || new Date();
    const formatedDate = moment(this.selectedCalenderDate).format('YYYY-MM-DD');
    this.setDateRouteParams(formatedDate);
  }

  setDropDownSelectedOption(option: string) {
    this.selectedOption = option;
    this.router.navigate([option.toLowerCase()], {
      relativeTo: this.activatedRoute,
      queryParams: { date: this.selectedCalenderDate.toISOString() },
      queryParamsHandling: 'merge',
    });
  }

  setDateRouteParams(date: string) {
    this.router.navigate(['day'], {
      relativeTo: this.activatedRoute,
      queryParams: { date: date },
      queryParamsHandling: 'merge',
    });
  }

  onDropdownSelectionChange(value: string) {
    this.setDropDownSelectedOption(value);
  }

  selectScheduledAppointment(date: string) {
    this.setCalendarDate(new Date(date));
  }
}
