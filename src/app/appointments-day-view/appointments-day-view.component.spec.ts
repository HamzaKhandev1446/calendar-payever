import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsDayViewComponent } from './appointments-day-view.component';

describe('AppointmentsDayViewComponent', () => {
  let component: AppointmentsDayViewComponent;
  let fixture: ComponentFixture<AppointmentsDayViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentsDayViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppointmentsDayViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
