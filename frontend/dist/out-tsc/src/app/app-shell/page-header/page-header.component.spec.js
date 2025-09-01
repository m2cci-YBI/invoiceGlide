import { TestBed } from '@angular/core/testing';
import { PageHeaderComponent } from './page-header.component';
describe('PageHeaderComponent', () => {
    let component;
    let fixture;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PageHeaderComponent]
        });
        fixture = TestBed.createComponent(PageHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=page-header.component.spec.js.map