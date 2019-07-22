import { BehaviorSubject, Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { Step } from './step';

/** The path */
export class Path {

    /** The steps for the path */
    private _steps: Array<Step> = [];

    /** All possible steps in a path */
    public get steps(): Array<Step> {
        return this._steps;
    }

    /** Sets the steps for the path */
    public set steps(steps: Array<Step>) {
        this._steps = steps;
    }

    /** The behavior subject for the snapshot */
    private snapshot: BehaviorSubject<Array<Step>> = new BehaviorSubject([]);

    /**
     * The constructor
     * @param steps The steps
     */
    constructor(steps: Array<Step>) {
        this.steps = steps;
    }

}
