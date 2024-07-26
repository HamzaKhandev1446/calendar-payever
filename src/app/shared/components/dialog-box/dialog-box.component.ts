import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import moment from 'moment';

export interface AppointmentData {
  title: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
}

@Component({
  selector: 'app-appointment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})
export class DialogBoxComponent {
  appointmentForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AppointmentData,
    private fb: FormBuilder
  ) {
    // Convert startTime and endTime to hh:mm A format
    const startTime = moment(data.startTime).format('hh:mm A');
    const endTime = moment(data.endTime).format('hh:mm A');

    this.appointmentForm = this.fb.group({
      title: [data.title, Validators.required],
      startTime: [startTime, Validators.required],
      endTime: [endTime, Validators.required]
    });
  }

  onSave(): void {
    if (this.appointmentForm.valid) {
      // Convert startTime and endTime back to ISO string before returning
      const formValue = this.appointmentForm.value;
      const startTime = moment(formValue.startTime, 'hh:mm A').toISOString();
      const endTime = moment(formValue.endTime, 'hh:mm A').toISOString();
      this.dialogRef.close({ ...formValue, startTime, endTime });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
