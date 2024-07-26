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
import { ICalenderDropDownOption } from '../shared/interfaces/calender.interfaces';

interface Appointment {
  title: string;
  date: Date;
}

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
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  calendarOptions: ICalenderDropDownOption[] = [];
  selectedCalenderDate: Date = new Date();
  appointmentsByHour: { [key: string]: Appointment[] } = {};
  selectedOption: string = TimePeriod.Day;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.setCalenderDropdown();
    
    this.setCalendarDate(null);
  }

  setCalenderDropdown(){
    this.calendarOptions = [
      { value: TimePeriod.Day, viewValue: 'Day', disabled: false },
      { value: TimePeriod.Week, viewValue: 'Week', disabled: true },
      { value: TimePeriod.Month, viewValue: 'Month', disabled: true },
      { value: TimePeriod.Year, viewValue: 'Year', disabled: true },
    ];
    this.setDropDownSelectedOption(this.selectedOption);
  }

  setCalendarDate(event: Date | null) {
    this.selectedCalenderDate = event || new Date();
    this.setDateRouteParams(this.selectedCalenderDate || new Date());
  }
  
  setDropDownSelectedOption(option: string) {
    this.router.navigate([option.toLowerCase()], { relativeTo: this.activatedRoute });
  }

  setDateRouteParams(date: Date) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { date: date.toISOString() },
      queryParamsHandling: 'merge',
    }); 
  }

  addAppointment() {
    // Add appointment logic
  }

  onDropdownSelectionChange(value: string) {
    this.selectedOption = value;
    this.setDropDownSelectedOption(value);
  }
}
