import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchingChartComponent } from './searching-chart.component';

describe('SearchingChartComponent', () => {
  let component: SearchingChartComponent;
  let fixture: ComponentFixture<SearchingChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchingChartComponent]
    });
    fixture = TestBed.createComponent(SearchingChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
