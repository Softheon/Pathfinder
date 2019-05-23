import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterEvent, ActivatedRoute } from '@angular/router';

import { MultiStepperVModule } from '@softheon/ng-workshop';
import { Observable, of } from 'rxjs';

import { Path } from '../../models/path';
import { PathfinderService } from '../../pathfinder.service';
import { NavfinderComponent } from './navfinder.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Step } from '../../models/step';

describe('NavfinderComponent', () => {
  let component: NavfinderComponent;
  let fixture: ComponentFixture<NavfinderComponent>;

  let pathfinderStub: {
    path: Path,
    initialize(): void,
    updateSnapshot(): void;
  };

  let routerStub: {
    events: Observable<RouterEvent>
  };

  const pathMock = new Path([new Step()]);

  beforeEach(async(() => {

    pathfinderStub = {
      path: pathMock,
      initialize(): void {
        return;
      },
      updateSnapshot(): void {
        return;
      }
    };
    routerStub = {
      events: new Observable<RouterEvent>()
    };

    TestBed.configureTestingModule({
      declarations: [ NavfinderComponent ],
      imports: [
        MultiStepperVModule
      ],
      providers: [
        { provide: PathfinderService, useValue: pathfinderStub},
        { provide: Router, useValue: routerStub },
        { provide: ActivatedRoute, useValue: {params: of({id: 'test'})}}
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavfinderComponent);
    component = fixture.componentInstance;
    component.path = pathMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component)
      .toBeTruthy();
  });
});
