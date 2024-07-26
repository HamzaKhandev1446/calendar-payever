import { TimePeriod } from "../enums/time-periods-dropdown";

export interface ICalenderDropDownOption {
    value: TimePeriod;
    viewValue: string;
    disabled: boolean;
  }