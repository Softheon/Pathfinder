import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubStepComponent } from './sub-step.component';

describe('SubStepComponent', () => {
  let component: SubStepComponent;
  let fixture: ComponentFixture<SubStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
