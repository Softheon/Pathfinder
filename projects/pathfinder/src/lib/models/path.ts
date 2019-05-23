import { BehaviorSubject, Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { Step } from './step';

/** The path */
export class Path {

    /** The snapshot of steps for the path */
    public snapshot$: Observable<Array<Step>>;

    /** The steps for the path */
    private _steps: Array<Step> = [];

    /** All possible steps in a path */
    public get steps(): Array<Step> {
        return this._steps;
    }

    /** Sets the steps for the path */
    public set steps(steps: Array<Step>) {
        this._steps = steps;
        this.updateSnapshot();
    }

    /** The behavior subject for the snapshot */
    private snapshot: BehaviorSubject<Array<Step>> = new BehaviorSubject([]);

    /** The constructor
     * @param steps The steps
     */
    constructor(steps: Array<Step>) {
        this.steps = steps;
        this.snapshot$ = this.snapshot.asObservable();
        // shares the observable to avoid double subscription triggers
        this.snapshot$.pipe(share());
    }

    /** Updates the snapshot based on the current steps
     * @param steps The steps
     */
    public updateSnapshot(steps: Array<Step> = this._steps): void {
        this.snapshot.next(steps);
    }
}
