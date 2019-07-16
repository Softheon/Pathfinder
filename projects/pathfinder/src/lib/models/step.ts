import { Condition } from './condition';

/** The step class */
export class Step {

    /** The id of the step */
    public id: string | number;

    /** True if the step is a start step */
    public isStart: boolean;

    /** True if the step is an end step */
    public isEnd: boolean;

    /** True if the step is a middle step */
    public get isMiddle(): boolean {
        return !this.isStart && !this.isEnd;
    }

    /** True if the step is current */
    public isCurrent: boolean;

    /** True if the step has been completed */
    public isComplete: boolean;

    /** The conditions for determining the next step */
    public conditions: Array<Condition> = [];

    /** The static action for the step if needed */
    public action?: any;

    /** The static action type for the step if needed */
    public actionType?: 'route' | 'internalPath' | 'externalUrl' | 'dummy';
}
