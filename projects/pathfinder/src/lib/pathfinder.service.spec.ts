import { TestBed } from '@angular/core/testing';
import { RouterEvent, ActivatedRoute, Router } from '@angular/router';

import { Observable, of } from 'rxjs';

import { PathfinderService } from './pathfinder.service';
import { Step } from './models/step';
import { Condition } from './models/condition';
import { Path } from './models/path';

describe('PathfinderService', () => {
  let service: PathfinderService;

  let routerStub: {
    events: Observable<RouterEvent>,
    routeReuseStrategy: {
      shouldReuseRoute(): boolean
    }
  };

  let step1: Step = {
    id: 'step1',
    label: 'Step 1',
    group: 'group1',
    isStart: true,
    conditions: [
      { 
        stepId: 'dummy',
        predicateType: 'boolean',
        predicate: true,
        actionType: 'dummy',
        action: ''
      }
    ] as Array<Condition>
  } as Step;

  let dummyStep: Step = {
    id: 'dummy',
    label: 'Dummy',
    group: 'group2',
    isMainStep: true,
    conditions: [
      {
        stepId: 'step2',
        predicateType: 'boolean',
        predicate: true,
        actionType: 'route',
        action: './step2'
      }
    ] as Array<Condition>
  } as Step;

  let step2: Step = {
    id: 'step2',
    label: 'Step 2',
    group: 'group2',
    actionType: 'route',
    action: './step2', 
    conditions: [
      {
        stepId: 'step3',
        predicateType: 'boolean',
        predicate: true,
        actionType: 'route',
        action: './step3'
      }
    ] as Array<Condition>
  } as Step;

  let step3: Step = {
    id: 'step3',
    label: 'Step 3',
    group: 'group3',
    isEnd: true,
    actionType: 'route',
    action: './step3'
  } as Step;


  beforeEach(() => {
    routerStub = {
      events: new Observable<RouterEvent>(),
      routeReuseStrategy: {
        shouldReuseRoute(): boolean { return false; }
      }
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: ActivatedRoute, useValue: {params: of({id: 'test'})}}
      ]
    });
    service = TestBed.get(PathfinderService);
  });

  it('should be created', () => {
    expect(service)
      .toBeTruthy();
  });

  it('should skip over dummy node and execute next action', () => {
    // Arrange
    let path = new Path([step1, dummyStep, step2, step3]);
    service.path = path;
    service.currentStep = step1;
    let executeSpy = spyOn<any>(service, 'executeAction');

    // Act
    service.takeStepForward();

    // Assert
    expect(executeSpy).toHaveBeenCalledTimes(1);
    expect(executeSpy).toHaveBeenCalledWith( './step2', 'route' );

    // Act
    service.takeStepForward();

    // Assert
    expect(executeSpy).toHaveBeenCalledTimes(2);
    expect(executeSpy).toHaveBeenCalledWith( './step3', 'route' );
  });
});
