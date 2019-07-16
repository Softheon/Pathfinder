import { Component } from '@angular/core';
import { PathfinderService } from 'dist/@softheon/pathfinder';

@Component({
    selector: 'app-root',
    templateUrl: '/app.component.html',
    styleUrls: ['/app.component.css']
})
export class AppComponent {
    title = 'PathfinderLibrary';

    public data = {
        applicants: [
            {
                age: 65
            }
        ]
    };

    public path = {
        steps: [
            {
                id: 'shopping',
                isStart: true,
                action: '/shopping',
                actionType: 'route',
                conditions: [
                    {
                        stepId: 'demographic',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/demographic'
                    }
                ],
                displaySettings: {
                    title: 'Shopping',
                    hasChildren: true,
                    level: 1,
                    group: 'group1'
                }
            },
            {
                id: 'demographic',
                conditions: [
                    {
                        stepId: 'provider',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/provider?mode=somemode'
                    }
                ],
                displaySettings: {
                    title: 'Demographic',
                    hasChildren: false,
                    level: 2,
                    group: 'group1'
                }
            },
            {
                id: 'provider',
                label: 'Providers',
                group: 'group1',
                conditions: [
                    {
                        stepId: 'drug',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/drug'
                    }
                ],
                displaySettings: {
                    title: 'Provider',
                    hasChildren: false,
                    level: 2,
                    group: 'group1'
                }
            },
            {
                id: 'drug',
                group: 'group1',
                label: 'Drugs',
                conditions: [
                    {
                        stepId: 'plan',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/plans'
                    }
                ],
                displaySettings: {
                    title: 'Provider',
                    hasChildren: false,
                    level: 2,
                    group: 'group1'
                }
            },
            {
                id: 'plan',
                group: 'group1',
                label: 'Plans',
                conditions: [
                    {
                        stepId: 'medicare',
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
                        action: '/medicare'
                    },
                    {
                        stepId: 'enrollment',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/enrollment'
                    }
                ],
                displaySettings: {
                    title: 'Plan',
                    hasChildren: false,
                    level: 2,
                    group: 'group1'
                }
            },
            {
                id: 'enrollment',
                conditions: [
                    {
                        stepId: 'apply',
                        predicateType: 'boolean',
                        predicate: true,
                        actionType: 'route',
                        action: '/apply'
                    }
                ],
                displaySettings: {
                    title: 'Enrollment',
                    hasChildren: true,
                    level: 1,
                    group: 'group2'
                }
            },
            {
                id: 'apply',
                isEnd: true,
                displaySettings: {
                    title: 'Apply',
                    hasChildren: false,
                    level: 2,
                    group: 'group2'
                }
            },
            {
                id: 'medicare',
                isEnd: true,
                displaySettings: {
                    title: 'Medicare',
                    hasChildren: false,
                    level: 1,
                    group: 'group3'
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
        this.pathFinder.takeStepBack()
    }

}
