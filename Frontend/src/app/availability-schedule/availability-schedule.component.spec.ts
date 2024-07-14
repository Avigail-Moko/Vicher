import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityScheduleComponent } from './availability-schedule.component';

describe('AvailabilityScheduleComponent', () => {
  let component: AvailabilityScheduleComponent;
  let fixture: ComponentFixture<AvailabilityScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvailabilityScheduleComponent],
    });
    fixture = TestBed.createComponent(AvailabilityScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
