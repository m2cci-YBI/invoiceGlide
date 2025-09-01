import { TestBed } from '@angular/core/testing';
import { MailAuthenticationComponent } from './mail-authentication.component';
describe('MailAuthenticationComponent', () => {
    let component;
    let fixture;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [MailAuthenticationComponent]
        });
        fixture = TestBed.createComponent(MailAuthenticationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=mail-authentication.component.spec.js.map