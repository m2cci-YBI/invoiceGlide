import { TestBed } from '@angular/core/testing';
import { MiniLineChartComponent } from './mini-line-chart.component';
describe('MiniLineChartComponent', () => {
    let component;
    let fixture;
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
//# sourceMappingURL=mini-line-chart.component.spec.js.map