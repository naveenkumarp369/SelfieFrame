import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithoutcropperComponent } from './withoutcropper.component';

describe('WithoutcropperComponent', () => {
  let component: WithoutcropperComponent;
  let fixture: ComponentFixture<WithoutcropperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WithoutcropperComponent]
    });
    fixture = TestBed.createComponent(WithoutcropperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
