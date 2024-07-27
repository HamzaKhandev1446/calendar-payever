import { TimePeriod } from "../enums/time-periods-dropdown";

export interface ICalenderDropDownOption {
    value: TimePeriod;
    viewValue: string;
    disabled: boolean;
  }

  export interface Appointment {
    title: string;
    startTime: string;
    endTime: string;
    time?: string;
  }