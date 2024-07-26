import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select-dropdown',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './select-dropdown.component.html',
  styleUrls: ['./select-dropdown.component.scss']
})
export class SelectDropdownComponent {
  @Input() label: string = 'Select an option';
  @Input() options: { value: string, viewValue: string, disabled: boolean }[] = [];
  @Input() selected: string | null = null;
  @Output() selectedChange = new EventEmitter<string>();

  onSelectionChange(value: string) {
    this.selectedChange.emit(value);
  }
}
