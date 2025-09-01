import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniLineChartComponent } from './mini-line-chart.component';

describe('MiniLineChartComponent', () => {
  let component: MiniLineChartComponent;
  let fixture: ComponentFixture<MiniLineChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiniLineChartComponent]
    });
    fixture = TestBed.createComponent(MiniLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
