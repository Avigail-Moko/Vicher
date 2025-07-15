import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletingAccountComponent } from './deleting-account.component';

describe('DeletingAccountComponent', () => {
  let component: DeletingAccountComponent;
  let fixture: ComponentFixture<DeletingAccountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeletingAccountComponent]
    });
    fixture = TestBed.createComponent(DeletingAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
