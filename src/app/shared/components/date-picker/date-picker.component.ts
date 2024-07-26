import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [MatCardModule, MatDatepickerModule, MatNativeDateModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent {
  selected: Date | null = null;
  @Output() setDate = new EventEmitter<Date | null>();

  onSelectedDate(event: Date | null) {
    console.log('Selected date:', event);
    this.setDate.emit(event);
  }
}
