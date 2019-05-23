
/** The condition class */
export class Condition {

    /** The step id the condition leads to */
    public stepId: string | number;

    /**
     * The predicate type for the condition
     * boolean -- simple true false to validate the condition
     * object -- compare provided values against provided paths for a given object
     * function -- evaluate string as a typescript function
     * previousSteps -- steps provided must exists in the previous steps
     */
    public predicateType: 'boolean' | 'object' | 'function' | 'previousSteps';

    /** The predicate for the condition */
    public predicate: unknown;

    /** The logical operator */
    public logicalOperator: 'and' | 'or';

    /** The action to be taken if the predicate evaluates to true */
    public action: any;

    /** The action type */
    public actionType: 'route' | 'internalPath' | 'externalUrl' | 'dummy';

}
