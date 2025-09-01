import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailAuthenticationComponent } from './mail-authentication.component';

describe('MailAuthenticationComponent', () => {
  let component: MailAuthenticationComponent;
  let fixture: ComponentFixture<MailAuthenticationComponent>;

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
