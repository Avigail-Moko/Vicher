import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomingsellerComponent } from './becomingseller.component';

describe('BecomingsellerComponent', () => {
  let component: BecomingsellerComponent;
  let fixture: ComponentFixture<BecomingsellerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BecomingsellerComponent]
    });
    fixture = TestBed.createComponent(BecomingsellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
