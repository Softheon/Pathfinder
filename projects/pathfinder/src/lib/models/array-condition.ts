export class ArrayCondition {

    /** The logical operator */
    public logicalOperator: 'and' | 'or';

    /** The dictionary of predicates */
    public predicate: {[ key: string ]: any};
}