import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { ArrayCondition } from './models/array-condition';
import { Condition } from './models/condition';
import { Path } from './models/path';
import { Step } from './models/step';

/** The key to get the navigation from storage */
export const storageKey: 'pathfinder' = 'pathfinder';

/** The key to get the static path from storage */
export const staticPathStorage: 'static-path' = 'static-path';

/** The static main step storage key */
export const staticMainStepStorage: 'static-main-step' = 'static-main-step';

/** The pathfinder service */
@Injectable({
  providedIn: 'root'
})
export class PathfinderService implements OnDestroy {

  /** The current step for the path */
  public currentStep: Step;

  /** The data used for object predicate type */
  public data: any;

  /** The path */
  public path: Path;

  /** The snapshot subscription */
  public snapshotSub: Subscription;

  /** True if static mode is enabled */
  public staticMode: boolean = false;

  /** the snapshot of the path */
  private snapshot: Array<Step> = [];

  /**
   * The constructor
   * @param router The router
   */
  constructor(
    private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => { return false; };
    // subscribe to the snapshot if constructed with path
    if (this.path) {
      this.snapshotSub = this.path.snapshot$.subscribe(s => {
        this.snapshot = s;
      });
    }
  }

  /** Angular life cycle hook called on service destruction */
  public ngOnDestroy(): void {
    this.snapshotSub.unsubscribe();
  }

  /**
   * Sets the data
   * @param data New data
   */
  public setData(data: any): void {
    this.data = data;
  }

  /**
   * Initializes the service
   * @param steps The steps for the path
   * @param loadFromStorage True if the path should be loaded from storage
   */
  public initialize(steps?: Array<Step>, loadFromStorage: boolean = false): void {
    this.path = loadFromStorage ? JSON.parse(window.localStorage.getItem(storageKey)) : new Path(steps);

    // subscribe to the snapshot
    this.snapshotSub = this.path.snapshot$.subscribe(s => {
      this.snapshot = s;
    });

    this.currentStep = this.path.steps.find(s => s.isStart);
    if (!this.currentStep) {
      console.error('unable to find start step for current path');
    }
    this.syncAllSteps();
  }

  /** Takes a step forward in the path */
  public takeStepForward(): Step {
    if (this.staticMode) {
      const currentIndex = this.snapshot.findIndex(x => x.id === this.currentStep.id);
      if (currentIndex > -1 && currentIndex < this.snapshot.length - 1) {
        this.currentStep = this.snapshot[currentIndex + 1];
        this.executeAction(this.currentStep.action, this.currentStep.actionType);
      }

      return this.currentStep;
    }
    this.currentStep = this.determineNextStep();
    this.syncAllSteps();
    this.path.updateSnapshot();
    while (this.currentStep.actionType === 'dummy') {
      this.currentStep = this.determineNextStep(this.currentStep);
      this.syncAllSteps();
      this.path.updateSnapshot();
    }
    this.executeAction(this.currentStep.action, this.currentStep.actionType);

    return this.currentStep;
  }

  /** Takes a step backward in the path */
  public takeStepBack(): void {
    if (this.staticMode) {
      const currentIndex = this.snapshot.findIndex(x => x.id === this.currentStep.id);
      if (currentIndex > 0) {
        this.currentStep = this.snapshot[currentIndex - 1];
        this.executeAction(this.currentStep.action, this.currentStep.actionType);
      }
      return;
    }
    this.path.snapshot$.pipe(take(1))
      .subscribe(val => {
        let currentSnapIndex = val.findIndex(v => v.id === this.currentStep.id);
        if (currentSnapIndex === 0) {
          return;
        }
        else if (currentSnapIndex > 0) {
          this.currentStep = this.getStepById(val[currentSnapIndex - 1].id);
          this.executeAction(this.currentStep.action, this.currentStep.actionType);
          this.syncAllSteps();
        }
      });
  }

  /**
   * Sets the steps for the path
   * @param steps The steps
   */
  public setPath(steps: Array<Step>): void {
    if (!this.path) {
      this.path = new Path(steps);
    }
    else {
      this.path.steps = steps;
    }
    this.updateSnapshot();
  }

  /**
   * Gets the a step from the path by id
   * @param id The id of the desired step
   */
  public getStepById(id: string | number): Step {
    return this.path.steps.find(s => s.id === id);
  }

  /** Syncs all the steps current and complete values */
  public syncAllSteps(): void {
    let currentFound = false;
    for (let step of this.path.steps) {
      if (step.id === this.currentStep.id) {
        step.isComplete = false;
        step.isCurrent = true;
        currentFound = true;
      }
      else {
        step.isComplete = !currentFound;
        step.isCurrent = false;
      }
    }
    this.updateSnapshot();
  }

  /** Updates the snapshot of the path */
  public updateSnapshot(): void {
    let snapshot: Array<Step> = [];
    snapshot.push(this.path.steps.find(s => s.isStart));
    while (snapshot.findIndex(s => s.isEnd) === -1) {
      let step = snapshot[snapshot.length - 1];

      snapshot.push(this.determineNextStep(step));
    }
    this.path.updateSnapshot(snapshot);

    // save snapshot to local storage
    window.localStorage.setItem(storageKey, JSON.stringify(this.snapshot));
  }

  /** Puts the pathfinder service in static mode */
  public useStaticMode(): void {
    this.staticMode = true;
    if (this.snapshotSub) {
      this.snapshotSub.unsubscribe();
    }
    this.path = new Path(JSON.parse(window.localStorage.getItem(staticPathStorage)));
    this.snapshot = this.path.steps;
    this.path.updateSnapshot(this.snapshot);
    this.currentStep = this.snapshot.find(x => x.isCurrent);
  }

  /**
   * Determines the next step for the given step or current step
   * @param givenStep The given step
   */
  private determineNextStep(givenStep?: Step): Step {
    let step = !!givenStep ? givenStep : this.currentStep;

    if (step.isEnd) {
      return undefined;
    }

    let condition = step.conditions.find(c => {
      switch (c.predicateType) {
        case 'boolean': {
          if (c.predicate as boolean) {
            return true;
          }
          break;
        }
        case 'object': {
          if (this.data && this.checkProps(c)) {
            return true;
          }
          break;
        }
        case 'function': {
          if (eval((c.predicate as any))(this)) {
            return true;
          }
          break;
        }
        case 'previousSteps': {
          let count = 0;
          let stepIds = c.predicate as Array<string>;
          stepIds.forEach(id => {
            if (this.snapshot.findIndex(snapStep => snapStep.id === id) > -1) {
              count++;
            }
          });
          if (c.logicalOperator === 'and' && count === stepIds.length) {
            return true;
          }
          else if (c.logicalOperator === 'or' && count > 0) {
            return true;
          }
          else if (c.logicalOperator !== 'or' && c.logicalOperator !== 'and') {
            console.error('logical operator not found for condition');
          }
          break;
        }
        default: {
          console.error('No predicate type found for condition');
          break;
        }
      }
    });

    let nextStep = this.getStepById(condition.stepId);
    this.setActionForStep(nextStep, condition);

    return nextStep;
  }

  /**
   * checks the properties against the values for the given condition
   * @param condition The condition
   */
  private checkProps(condition: Condition): boolean {
    let result: boolean = true;

    Object.keys((condition.predicate) as { [key: string]: any })
      .forEach(key => {
        let value = this.evalProps(key, (condition.predicate as { [key: string]: any })[key]);
        result = result && value;
      });

    return result;
  }

  /**
   * Evaluates the properties for object predicate type
   * @param key The key to get the property
   * @param value The value to compare it to
   * @param givenData The given data to use for the comparison
   */
  private evalProps(key: string, value: any, givenData?: any): boolean {
    let propVal = !!givenData ? givenData : this.data;

    // convert index to props
    let scrubbedPath: string = key.replace(/\[([0-9]+)\]/g, '.$1');

    // strip the leading dot
    scrubbedPath = scrubbedPath.replace(/^\./, '');

    let splitProps = scrubbedPath.split('.');
    for (let prop of splitProps) {
      // prop is an array, then continue
      if (Array.isArray(propVal)) {
        continue;
      }
      if (prop in propVal) {
        propVal = propVal[prop];
      }
      else {
        return false;
      }
    }

    // array checking
    if (typeof value === 'object') {
      let arrayCondition: ArrayCondition = value as ArrayCondition;
      let propMatchCount: number = 0;
      Object.keys(arrayCondition.predicate)
        .forEach(arrayKey => {
          for (let arrItem of propVal) {
            if (this.evalProps(arrayKey, arrayCondition.predicate[arrayKey], arrItem)) {
              propMatchCount++;
            }
          }
        });

      // if and make sure count of trues === number of keys, otherwise make at least true returned
      return arrayCondition.logicalOperator === 'and' ? propMatchCount === Object.keys(arrayCondition.predicate).length : propMatchCount > 0;
    }
    // single object checking
    else {
      return this.propValueCompare(propVal, value);
    }
  }

  /**
   * The condition
   * @param action The action
   * @param actionType The action type
   */
  private executeAction = (action: any, actionType: string): void => {
    switch (actionType) {
      case 'route': {
        const actionStr = action as string;
        this.router.navigateByUrl(actionStr.replace('.', ''));
        break;
      }
      case 'externalUrl': {
        window.location = action;
        break;
      }
      default: {
        console.error('action type not found');
        break;
      }
    }
  }

  /**
   * Compares the actual and the expected prop values
   * @param actual The actual value
   * @param expected The expected value
   */
  private propValueCompare = (actual: string | number, expected: string): boolean => {

    if (expected.includes('>=')) {
      return actual >= +expected.replace('>=', '')
        .replace(/\s/gm, ''); // excluding all spaces bc number
    }

    if (expected.includes('<=')) {
      return actual <= +expected.replace('<=', '')
        .replace(/\s/gm, ''); // excluding all spaces bc number
    }

    if (expected.includes('>')) {
      return actual > +expected.replace('>', '')
        .replace(/\s/gm, ''); // excluding all spaces bc number
    }

    if (expected.includes('<')) {
      return actual < +expected.replace('<', '')
        .replace(/\s/gm, ''); // excluding all spaces bc number
    }

    if (expected.includes('!')) {
      // uses != just in case of numbers
      return actual != (expected.includes('! ') ? expected.replace('! ', '') : expected.replace('!', ''));
    }

    // uses == just in case of numbers
    return actual == expected;
  };

  /**
   * Sets the action based on the condition for the step
   * @param step The step
   * @param condition The condition
   */
  private setActionForStep = (step: Step, condition: Condition): void => {
    step.action = condition.action;
    step.actionType = condition.actionType;
  };

}
