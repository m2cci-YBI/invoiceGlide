import { TestBed } from '@angular/core/testing';
import { StatusBadgeComponent } from './status-badge.component';
describe('StatusBadgeComponent', () => {
    let component;
    let fixture;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [StatusBadgeComponent]
        });
        fixture = TestBed.createComponent(StatusBadgeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=status-badge.component.spec.js.map