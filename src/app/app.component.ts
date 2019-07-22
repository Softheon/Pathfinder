import { Component } from '@angular/core';
import { PathfinderService } from 'projects/pathfinder/src/public-api';

@Component({
    selector: 'app-root',
    templateUrl: '/app.component.html',
    styleUrls: ['/app.component.css']
})
export class AppComponent {
    title = 'PathfinderLibrary';

    public data = [{
        applicationType: 'OnExQhp',
        applicants: [
            {
                age: 65
            }
        ]
    }];

    public path = {
        steps: [
            {
                id: 'demographic',
                label: 'Demographics',
                isMainStep: true,
                group: 'demographics',
                isStart: true,
                action: '/shopping/demographic',
                actionType: 'route',
                conditions: [
                    {
                        stepId: 'selfMedicare',
                        predicateType: 'function',
                        predicate: "(context) => { if (context.data.applicationType === 'Undefined') { return false } else { return (context.data.length > 0 && context.data[0].applicationType === 'Medicare') } }",
                        actionType: 'route',
                        action: './shopping/plans?type=self'
                    },
                    {
                        stepId: 'selfSpouseQhpMain',
                        predicateType: 'function',
                        predicate: "(context) => { if (context.data.applicationType === 'Undefined') { return false } else { return (context.data.length > 0 && context.data[0].applicationType === 'OnExQhp' && context.data[0].applicants.length === 2 && context.data[0].applicants.find(x => x.relationship === 'Spouse')) } }",
                        actionType: 'dummy',
                        action: './'
                    },
                    {
                        stepId: 'selfChildrenQhpMain',
                        predicateType: 'function',
                        predicate: "(context) => { if (context.data.applicationType === 'Undefined') { return false } else { return (context.data.length > 0 && context.data[0].applicationType === 'OnExQhp' && !context.data[0].applicants.find(x => x.relationship === 'Spouse') && context.data[0].applicants.find(x => x.relationship === 'Child') ) } }",
                        actionType: 'dummy',
                        action: './'
                    },
                    {
                        stepId: 'selfQhpMain',
                        actionType: 'dummy',
                        action: './',
                        predicateType: 'function',
                        predicate: "(context) => { if (context.data.applicationType === 'Undefined') { return false } else { return (context.data.length > 0 && context.data[0].applicationType === 'OnExQhp' && context.data[0].applicants.length === 1) } }"
                    },
                    {
                        stepId: 'selfSpouseChildrenQhp',
                        actionType: 'dummy',
                        action: './',
                        predicateType: 'function',
                        predicate: "(context) => { if (context.data.applicationType === 'Undefined') { return false } else { return (context.data.length > 0 && context.data[0].applicationType === 'OnExQhp' && context.data[0].applicants.length > 2) } }"
                    },
                    {
                        stepId: 'apply',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/healthcare/enrollment'
                    }
                ],
                displaySettings: {
                    title: 'Demographics',
                    hasChildren: true,
                    level: 1,
                    group: 'demographics'
                }
            },
            {
                id: 'selfSpouseQhpMain',
                group: 'selfSpouseQhp',
                label: 'Plans for Self and Spouse',
                isMainStep: true,
                conditions: [
                    {
                        stepId: 'selfSpouseProvider',
                        actionType: 'route',
                        action: './shopping/provider?type=selfspouse',
                        predicateType: 'boolean',
                        predicate: true
                    }
                ],
                displaySettings: {
                    title: 'Plans for Self and Spouse',
                    hasChildren: true,
                    level: 1,
                    group: 'selfSpouseQhp'
                }
            },
            {
                id: 'selfSpouseProvider',
                group: 'selfSpouseQhp',
                label: 'Select Providers',
                conditions: [
                    {
                        stepId: 'selfSpouseDrug',
                        actionType: 'route',
                        action: './shopping/drug?type=selfspouse',
                        predicateType: 'boolean',
                        predicate: true
                    }
                ],
                displaySettings: {
                    title: 'Select Providers',
                    hasChildren: false,
                    level: 2,
                    group: 'selfSpouseQhp'
                }
            },
            {
                id: 'selfSpouseDrug',
                group: 'selfSpouseQhp',
                label: 'Select Drugs',
                conditions: [
                    {
                        stepId: 'selfSpousePlan',
                        actionType: 'route',
                        action: './shopping/plans?type=selfspouse',
                        predicateType: 'boolean',
                        predicate: true
                    }
                ],
                displaySettings: {
                    title: 'Select Drugs',
                    hasChildren: false,
                    level: 2,
                    group: 'selfSpouseQhp'
                }
            },
            {
                id: 'selfSpousePlan',
                group: 'selfSpouseQhp',
                label: 'Plan Selection',
                conditions: [
                    {
                        stepId: 'dentalPlans',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'dummy',
                        action: './'
                    },
                    {
                        stepId: 'apply',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/healthcare/enrollment'
                    }
                ],
                displaySettings: {
                    title: 'Plan Selection',
                    hasChildren: false,
                    level: 2,
                    group: 'selfSpouseQhp'
                }
            },
            {
                id: 'selfMedicare',
                label: 'Plans for Self',
                isMainStep: true,
                conditions: [
                    {
                        stepId: 'spouseMedicare',
                        predicateType: 'function',
                        predicate: "(context) => { if (context.data.length <= 1) { return false } else { return (context.data[1].applicationType === 'Medicare') } }",
                        actionType: 'route',
                        action: './shopping/plans?type=spouse'
                    },
                    {
                        stepId: 'spouseChildrenQhpMain',
                        predicateType: 'function',
                        predicate: "(context) => { if (context.data.length <= 1) { return false } else { return (context.data[1].applicationType === 'OnExQhp' && context.data[1].applicants.length > 1) } }",
                        actionType: 'dummy',
                        action: './'
                    },
                    {
                        stepId: 'spouseQhp',
                        predicateType: 'function',
                        predicate: "(context) => { if (context.data.length <= 1) { return false } else { return (context.data[1].applicationType === 'OnExQhp' && context.data[1].applicants.length === 1 && context.data[1].applicants[0].relationship === 'Spouse' ) } }",
                        actionType: 'dummy',
                        action: './'
                    },
                    {
                        stepId: 'childrenQhpMain',
                        predicateType: 'function',
                        predicate: "(context) => { if (context.data.length <= 1) { return false } else { return (context.data[1].applicationType === 'OnExQhp' && context.data[1].applicants[0].relationship === 'Child') } }",
                        actionType: 'dummy',
                        action: './'
                    },
                    {
                        stepId: 'dentalPlans',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'dummy',
                        action: './'
                    },
                    {
                        stepId: 'apply',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/healthcare/enrollment'
                    }
                ],
                displaySettings: {
                    title: 'Plan for Self',
                    hasChildren: true,
                    level: 1,
                    group: 'selfMedicare'
                }
            },
            {
                id: 'spouseChildrenQhpMain',
                isMainStep: true,
                label: 'Plans for Spouse & Children',
                conditions: [
                    {
                        stepId: 'spouseChildrenProvider',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: './shopping/provider?type=spousechildren'
                    }
                ],
                displaySettings: {
                    title: 'Plans for Spouse & Children',
                    hasChildren: true,
                    level: 1,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'spouseChildrenProvider',
                label: 'Select Providers',
                conditions: [
                    {
                        stepId: 'plan',
                        predicateType: 'object',
                        predicate: {
                            applicants: {
                                logicalOperator: 'or',
                                predicate: {
                                    age: '>65'
                                }
                            }
                        },
                        actionType: 'route',
                        action: './shopping/plans'
                    },
                    {
                        stepId: 'spouseChildrenDrug',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: './shopping/drug?type=spousechildren'
                    }
                ],
                displaySettings: {
                    title: 'Select Providers',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'spouseChildrenDrug',
                label: 'Select Drugs',
                conditions: [
                    {
                        stepId: 'spouseChildrenPlan',
                        actionType: 'route',
                        action: './shopping/plans?type=spousechildren',
                        predicateType: 'boolean',
                        predicate: true
                    }
                ],
                displaySettings: {
                    title: 'Select Drugs',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'spouseChildrenPlan',
                label: 'Plan Selection',
                conditions: [
                    {
                        stepId: 'dentalPlans',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'dummy',
                        action: './'
                    },
                    {
                        stepId: 'apply',
                        actionType: 'route',
                        action: '/healthcare/enrollment',
                        predicateType: 'boolean',
                        predicate: true
                    }
                ],
                displaySettings: {
                    title: 'Plan Selection',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'spouseQhp',
                isMainStep: true,
                label: 'Plans for Spouse',
                conditions: [
                    {
                        stepId: 'spouseProvider',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: './shopping/provider?type=spouse'
                    }
                ],
                displaySettings: {
                    title: 'Plan for Spouse',
                    hasChildren: true,
                    level: 1,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'spouseProvider',
                label: 'Select Providers',
                conditions: [
                    {
                        stepId: 'spouseDrug',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: './shopping/drug?type=spouse'
                    }
                ],
                displaySettings: {
                    title: 'Select Providers',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'spouseDrug',
                label: 'Select Drugs',
                conditions: [
                    {
                        stepId: 'spousePlanQhp',
                        actionType: 'route',
                        action: './shopping/plans?type=spouse',
                        predicateType: 'boolean',
                        predicate: true
                    }
                ],
                displaySettings: {
                    title: 'Select Drugs',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'spousePlanQhp',
                label: 'Plan Selection',
                conditions: [
                    {
                        stepId: 'dentalPlans',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'dummy',
                        action: './'
                    },
                    {
                        stepId: 'apply',
                        actionType: 'route',
                        action: '/healthcare/enrollment',
                        predicateType: 'boolean',
                        predicate: true
                    }
                ],
                displaySettings: {
                    title: 'Plan Selection',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'spouseMedicare',
                label: 'Plans for Spouse',
                isMainStep: true,
                conditions: [
                    {
                        stepId: 'childrenQhpMain',
                        actionType: 'dummy',
                        action: './',
                        predicateType: 'function',
                        predicate: "(context) => { if (context.data.length <= 2) { return false } else { return (context.data[2].applicationType === 'OnExQhp') } }"
                    },
                    {
                        stepId: 'dentalPlans',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'dummy',
                        action: './'
                    },
                    {
                        stepId: 'apply',
                        actionType: 'route',
                        action: '/healthcare/enrollment',
                        predicateType: 'boolean',
                        predicate: true
                    }
                ],
                displaySettings: {
                    title: 'Plans for Spouse',
                    hasChildren: true,
                    level: 1,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'childrenQhpMain',
                label: 'Plans for Children',
                group: 'childrenQhp',
                isMainStep: true,
                conditions: [
                    {
                        stepId: 'childrenProvider',
                        actionType: 'route',
                        action: './shopping/provider?type=children',
                        predicateType: 'boolean',
                        predicate: true
                    }
                ],
                displaySettings: {
                    title: 'Plans for Children',
                    hasChildren: true,
                    level: 1,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'childrenProvider',
                label: 'Select Providers',
                group: 'childrenQhp',
                conditions: [
                    {
                        stepId: 'childrenDrug',
                        actionType: 'route',
                        action: './shopping/drug?type=children',
                        predicateType: 'boolean',
                        predicate: true
                    }
                ],
                displaySettings: {
                    title: 'Select Providers',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'childrenDrug',
                label: 'Select Drugs',
                group: 'childrenQhp',
                conditions: [
                    {
                        stepId: 'childrenPlan',
                        actionType: 'route',
                        action: './shopping/plans?type=children',
                        predicateType: 'boolean',
                        predicate: true
                    }
                ],
                displaySettings: {
                    title: 'Select Drugs',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'childrenPlan',
                label: 'Plan Selection',
                group: 'childrenQhp',
                conditions: [
                    {
                        stepId: 'dentalPlans',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'dummy',
                        action: './'
                    },
                    {
                        stepId: 'apply',
                        actionType: 'route',
                        action: '/healthcare/enrollment',
                        predicateType: 'boolean',
                        predicate: true
                    }
                ],
                displaySettings: {
                    title: 'Plan Selection',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'selfQhpMain',
                label: 'Plans for Self',
                group: 'selfQhp',
                isMainStep: true,
                conditions: [
                    {
                        stepId: 'selfProvider',
                        actionType: 'route',
                        action: './shopping/provider?type=self',
                        predicateType: 'boolean',
                        predicate: true
                    }
                ],
                displaySettings: {
                    title: 'Plans for Self',
                    hasChildren: true,
                    level: 1,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'selfProvider',
                label: 'Select Providers',
                group: 'selfQhp',
                conditions: [
                    {
                        stepId: 'selfDrug',
                        actionType: 'route',
                        action: './shopping/drug?type=self',
                        predicateType: 'boolean',
                        predicate: true
                    }
                ],
                displaySettings: {
                    title: 'Select Providers',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'selfDrug',
                label: 'Select Drugs',
                group: 'selfQhp',
                conditions: [
                    {
                        stepId: 'selfQhpPlan',
                        actionType: 'route',
                        action: './shopping/plans?type=self',
                        predicateType: 'boolean',
                        predicate: true
                    }
                ],
                displaySettings: {
                    title: 'Select Drugs',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'selfQhpPlan',
                label: 'Plan Selection',
                group: 'selfQhp',
                conditions: [
                    {
                        stepId: 'spouseMedicare',
                        actionType: 'route',
                        action: './shopping/plans?type=spouse',
                        predicateType: 'function',
                        predicate: "(context) => { if (context.data.length === 1) { return false} else { return (context.data[1].applicationType === 'Medicare') } }"
                    },
                    {
                        stepId: 'dentalPlans',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'dummy',
                        action: './'
                    },
                    {
                        stepId: 'apply',
                        actionType: 'route',
                        action: '/healthcare/enrollment',
                        predicateType: 'boolean',
                        predicate: true
                    }
                ],
                displaySettings: {
                    title: 'Plan Selection',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'selfSpouseChildrenQhp',
                label: 'Plans for Family',
                isMainStep: true,
                group: 'selfSpouseChildrenQhp',
                conditions: [
                    {
                        stepId: 'selfSpouseChildrenProvider',
                        actionType: 'route',
                        action: './shopping/provider?type=all',
                        predicateType: 'boolean',
                        predicate: true
                    }
                ],
                displaySettings: {
                    title: 'Plans for Family',
                    hasChildren: true,
                    level: 1,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'selfSpouseChildrenProvider',
                label: 'Select Providers',
                group: 'selfSpouseChildrenQhp',
                conditions: [
                    {
                        stepId: 'selfSpouseChildrenDrug',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: './shopping/drug?type=all'
                    }
                ],
                displaySettings: {
                    title: 'Select Providers',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'selfSpouseChildrenDrug',
                group: 'selfSpouseChildrenQhp',
                label: 'Select Drugs',
                conditions: [
                    {
                        stepId: 'selfSpouseChildrenPlan',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: './shopping/plans?type=all'
                    }
                ],
                displaySettings: {
                    title: 'Select Drugs',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'selfSpouseChildrenPlan',
                group: 'selfSpouseChildrenQhp',
                label: 'Select A Plan',
                conditions: [
                    {
                        stepId: 'dentalPlans',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'dummy',
                        action: './'
                    },
                    {
                        stepId: 'apply',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/healthcare/enrollment'
                    }
                ],
                displaySettings: {
                    title: 'Select a Plan',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'selfChildrenQhpMain',
                label: 'Plans for Self & Children',
                isMainStep: true,
                group: 'selfChildrenQhp',
                conditions: [
                    {
                        stepId: 'selfChildrenProvider',
                        actionType: 'route',
                        action: './shopping/provider?type=selfchildren',
                        predicateType: 'boolean',
                        predicate: true
                    }
                ],
                displaySettings: {
                    title: 'Plans for Self & Children',
                    hasChildren: true,
                    level: 1,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'selfChildrenProvider',
                label: 'Select Providers',
                group: 'selfChildrenQhp',
                conditions: [
                    {
                        stepId: 'selfChildrenDrug',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: './shopping/drug?type=selfchildren'
                    }
                ],
                displaySettings: {
                    title: 'Select a Plan',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'selfChildrenDrug',
                group: 'selfChildrenQhp',
                label: 'Select Drugs',
                conditions: [
                    {
                        stepId: 'selfChildrenPlan',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: './shopping/plans?type=selfchildren'
                    }
                ],
                displaySettings: {
                    title: 'Select Drugs',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'selfChildrenPlan',
                group: 'selfChildrenQhp',
                label: 'Select A Plan',
                conditions: [
                    {
                        stepId: 'spouseMedicare',
                        actionType: 'route',
                        action: './shopping/plans?type=spouse',
                        predicateType: 'function',
                        predicate: "(context) => { if (context.data.length === 1) { return false } else { console.log(context.data); return (context.data[1].applicationType === 'Medicare') } }"
                    },
                    {
                        stepId: 'dentalPlans',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'dummy',
                        action: './'
                    },
                    {
                        stepId: 'apply',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/healthcare/enrollment'
                    }
                ],
                displaySettings: {
                    title: 'Select A Plan',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'dentalPlans',
                group: 'dental',
                isMainStep: true,
                label: 'Dental Plans',
                conditions: [
                    {
                        stepId: 'visionPlans',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'dummy',
                        action: './'
                    }
                ],
                displaySettings: {
                    title: 'Dental Plans',
                    hasChildren: true,
                    level: 1,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'visionPlans',
                group: 'vision',
                isMainStep: true,
                label: 'Vision Plans',
                conditions: [
                    {
                        stepId: 'apply',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/healthcare/enrollment'
                    }
                ],
                displaySettings: {
                    title: 'Vision Plans',
                    hasChildren: true,
                    level: 1,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'apply',
                group: 'group2',
                isMainStep: true,
                label: 'Apply',
                conditions: [
                    {
                        stepId: 'medicare',
                        predicateType: 'object',
                        predicate: {
                            applicationType: 'Medicare'
                        },
                        actionType: 'route',
                        action: '/healthcare/medicare'
                    },
                    {
                        stepId: 'disclaimer',
                        predicateType: 'object',
                        predicate: {
                            applicationType: 'OffExQhp'
                        },
                        actionType: 'route',
                        action: './enrollment/disclaimer'
                    },
                    {
                        stepId: 'disclaimer',
                        predicateType: 'object',
                        predicate: {
                            applicationType: 'OnExQhp'
                        },
                        actionType: 'route',
                        action: './enrollment/disclaimer'
                    },
                    {
                        stepId: 'endState',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/enrollment/thank-you'
                    }
                ],
                displaySettings: {
                    title: 'Apply',
                    hasChildren: true,
                    level: 1,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'endState',
                group: 'endPoint',
                isEnd: true,
                displaySettings: {
                    title: 'endState',
                    hasChildren: true,
                    level: 1,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'disclaimer',
                group: 'group2',
                label: 'Disclaimer',
                conditions: [
                    {
                        stepId: 'tax-credit',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/enrollment/tax-credit'
                    }
                ],
                displaySettings: {
                    title: 'Disclaimer',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'tax-credit',
                group: 'group2',
                label: 'Tax Credit',
                conditions: [
                    {
                        stepId: 'ede',
                        predicateType: 'object',
                        predicate: {
                            applicationType: 'OnExQhp'
                        },
                        actionType: 'route',
                        action: '/enrollment/eligibility/embedded'
                    },
                    {
                        stepId: 'sep',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/enrollment/eligibility/sep'
                    }
                ],
                displaySettings: {
                    title: 'Tax Credit',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'sep',
                group: 'group2',
                label: 'Special Enrollment Period',
                conditions: [
                    {
                        stepId: 'primary-contact',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/enrollment/primary-contact'
                    }
                ],
                displaySettings: {
                    title: 'Special Enrollment Period',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'primary-contact',
                group: 'group2',
                label: 'Primary Contact',
                conditions: [
                    {
                        stepId: 'plans',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'internalPath',
                        action: '/healthcare/shopping/plans?mode=external'
                    }
                ],
                displaySettings: {
                    title: 'Primary Contact',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'plans',
                group: 'group2',
                label: 'Plans',
                conditions: [
                    {
                        stepId: 'authorized-user',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'internalPath',
                        action: '/healthcare/enrollment/authorized-user'
                    }
                ],
                displaySettings: {
                    title: 'Plans',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'authorized-user',
                group: 'group2',
                label: 'Authorized User',
                conditions: [
                    {
                        stepId: 'review',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: './enrollment/review'
                    }
                ],
                displaySettings: {
                    title: 'Authorized User',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'ede',
                group: 'group2',
                label: 'Eligibility Determination',
                conditions: [
                    {
                        stepId: 'ede-summary',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/enrollment/eligibility/summary'
                    }
                ],
                displaySettings: {
                    title: 'Eligibility Determination',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'ede-summary',
                group: 'group2',
                label: 'Eligibility Summary',
                conditions: [
                    {
                        stepId: 'review',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/enrollment/review'
                    }
                ],
                displaySettings: {
                    title: 'Eligibility Summary',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'review',
                group: 'group2',
                label: 'Review and Submit',
                conditions: [
                    {
                        stepId: 'thank-you',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/enrollment/thank-you'
                    }
                ],
                displaySettings: {
                    title: 'Review and Submit',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'thank-you',
                group: 'group2',
                label: 'Thank You',
                isEnd: true,
                displaySettings: {
                    title: 'Thank You',
                    hasChildren: true,
                    level: 1,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'medicare',
                group: 'group3',
                isMainStep: true,
                label: 'Medicare',
                conditions: [
                    {
                        stepId: 'welcome',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/medicare/welcome'
                    }
                ],
                displaySettings: {
                    title: 'Medicare',
                    hasChildren: true,
                    level: 1,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'welcome',
                group: 'group3',
                label: 'Welcome',
                conditions: [
                    {
                        stepId: 'medicare-insurance-info',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/medicare/medicare-insurance-info'
                    }
                ],
                displaySettings: {
                    title: 'Welcome',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'medicare-insurance-info',
                group: 'group3',
                label: 'Medicare Insurance Info',
                conditions: [
                    {
                        stepId: 'preliminary-questions',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/medicare/preliminary-questions'
                    }
                ],
                displaySettings: {
                    title: 'Medicare Insurance Info',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'preliminary-questions',
                group: 'group3',
                label: 'Preliminary Questions',
                conditions: [
                    {
                        stepId: 'personal-info',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/medicare/personal-info'
                    }
                ],
                displaySettings: {
                    title: 'Preliminary Questions',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'personal-info',
                group: 'group3',
                label: 'Personal Info',
                conditions: [
                    {
                        stepId: 'sep',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/medicare/sep'
                    }
                ],
                displaySettings: {
                    title: 'Personal Info',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'sep',
                group: 'group3',
                label: 'Special Enrollment Period',
                conditions: [
                    {
                        stepId: 'additional-coverage',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/medicare/additional-coverage'
                    }
                ],
                displaySettings: {
                    title: 'Special Enrollment Period',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'additional-coverage',
                group: 'group3',
                label: 'Additional Coverage',
                conditions: [
                    {
                        stepId: 'effective-date',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/medicare/effective-date'
                    }
                ],
                displaySettings: {
                    title: 'Additional Coverage',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'effective-date',
                group: 'group3',
                label: 'Effective Date',
                conditions: [
                    {
                        stepId: 'pcp',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/medicare/pcp'
                    }
                ],
                displaySettings: {
                    title: 'Effective Date',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'pcp',
                group: 'group3',
                label: 'Primary Care Provider',
                conditions: [
                    {
                        stepId: 'monthly-premium',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/medicare/monthly-premium'
                    }
                ],
                displaySettings: {
                    title: 'Primary Care Provider',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'monthly-premium',
                group: 'group3',
                label: 'Monthly Premium',
                conditions: [
                    {
                        stepId: 'riders',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/medicare/riders'
                    }
                ],
                displaySettings: {
                    title: 'Monthly Premium',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'riders',
                group: 'group3',
                label: 'Optional Supplemental Benefits',
                conditions: [
                    {
                        stepId: 'power-of-attorney',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/medicare/power-of-attorney'
                    }
                ],
                displaySettings: {
                    title: 'Optional Supplemental Benefits',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'power-of-attorney',
                group: 'group3',
                label: 'Power of Attorney',
                conditions: [
                    {
                        stepId: 'authorization',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/medicare/authorization'
                    }
                ],
                displaySettings: {
                    title: 'Power of Attorney',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'authorization',
                group: 'group3',
                label: 'Authorization',
                conditions: [
                    {
                        stepId: 'review',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/medicare/review'
                    }
                ],
                displaySettings: {
                    title: 'Authorization',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'review',
                group: 'group3',
                label: 'Review',
                conditions: [
                    {
                        stepId: 'complete',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/medicare/thank-you'
                    }
                ],
                displaySettings: {
                    title: 'Review',
                    hasChildren: false,
                    level: 2,
                    group: 'spouseChildrenQhpMain'
                }
            },
            {
                id: 'complete',
                group: 'group3',
                label: 'Complete',
                isEnd: true,
                displaySettings: {
                    title: 'Complete',
                    hasChildren: true,
                    level: 1,
                    group: 'spouseChildrenQhpMain'
                }
            }
        ]
    };
    constructor(
        private pathFinder: PathfinderService
    ) {}

    public next(): void {
        this.pathFinder.takeStepForward();
    }

    public back(): void {
        this.pathFinder.takeStepBack();
    }

}
