import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { IMultiStepper, IStep } from '@softheon/ng-workshop';

import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { Path } from '../../models/path';
import { Step } from '../../models/step';
import { PathfinderService, staticMainStepStorage } from '../../pathfinder.service';

/** The nav finder component */
@Component({
    selector: 'pathfinder-nav',
    templateUrl: './navfinder.component.html',
    styleUrls: ['./navfinder.component.css']
})
export class NavfinderComponent implements OnInit, OnDestroy {

    /** The nav text input */
    @Input() public navText: string = 'Navfinder';

    /** The id of the current main step */
    @Input() public currentMainStepId: string | number = 'shopping';

    /** The data to use */
    @Input() public data: any;

    /** The path */
    @Input() public path: Path;

    /** True if skip ahead is allowed */
    @Input() public skipAhead: boolean = false;

    /** The snapshot subscription */
    public snapshotSubscription: Subscription;

    /** The snapshot */
    public snapshot: Array<Step> = [];

    /** The multi stepper V config */
    public multiStepperVConfig: IMultiStepper;

    /**
     * The constructor
     * @param pathfinder The pathfinder service
     * @param router The router
     */
    constructor(
        private pathfinder: PathfinderService,
        private router: Router
    ) { }

    /** Angular life cycle hook for component initialization */
    public ngOnInit(): void {
        this.pathfinder.data = this.data;
        this.multiStepperVConfig = {
            menuText: this.navText,
            steps: []
        }
        if (!this.pathfinder.staticMode) {
            this.pathfinder.initialize(this.path.steps);
            this.syncPathByRoute();
        }
        else {
            this.currentMainStepId = window.localStorage.getItem(staticMainStepStorage);
        }
        this.snapshotSubscription = this.pathfinder.path.snapshot$.subscribe(x => {
            this.snapshot = x;
            this.configureNavFromPath();
        });
    }

    /** Angular life cycle hook for component destruction */
    public ngOnDestroy(): void {
        this.snapshotSubscription.unsubscribe();
    }

    /** Syncs the path by route */
    private syncPathByRoute(): void {
        this.pathfinder.path.snapshot$.pipe(take(1))
            .subscribe(x => {

                let step = x.find(s => this.checkPath(s.action, s.actionType, this.router.url.replace(`/${this.currentMainStepId}`, '')));
                if (!step) {
                    step = this.path.steps.find(y => y.id === x[0].id);
                }
                this.pathfinder.currentStep = step;
                this.pathfinder.updateSnapshot();
            });
        this.router.events.subscribe(routeEvent => {
            // find navigation end type
            if (this.pathfinder.staticMode) {
                return;
            }
            if (routeEvent instanceof NavigationEnd) {
                const step = this.pathfinder.path.steps.find(s => this.checkPath(s.action, s.actionType, routeEvent.urlAfterRedirects));
                this.pathfinder.currentStep = step;
                this.pathfinder.updateSnapshot();
            }
        });
    }

    /**
     * Checks the action against the provider url
     * @param action The action
     * @param actionType The action type
     * @param url The url
     */
    private checkPath(action: string, actionType: string, url: string): boolean {
        return action && (action.replace('.', '') === url || (actionType === 'internalPath' && action.includes(url.replace('.', ''))));
    }

    /** Configures the navigation from the path */
    private configureNavFromPath(): void {
        // reset the steps
        this.multiStepperVConfig.steps.length = 0;

        // create ISteps from snapshot steps
        let currentMainStep = -1;
        let foundCurrent = false;
        let mainGroup;
        this.snapshot.forEach(step => {
            if (step.isMainStep) {
                // if main step id provided, set the main group
                if (this.currentMainStepId ? step.id === this.currentMainStepId : false) {
                    mainGroup = step.group;
                    console.log(mainGroup);
                }
                currentMainStep++;
            }
            if (step.id === this.pathfinder.currentStep.id) {
                foundCurrent = true; 
            }
            // if main group is provided don't add a step for non main steps not in the group
            if (this.currentMainStepId ? step.group === mainGroup || step.isMainStep : true) {
                let temp;
                if (step.actionType === 'internalPath') {
                    temp = (step.action as string).split('/');
                };
                let navStep: IStep = {
                    stepTitle: step.label,
                    stepUrl: step.actionType === 'internalPath' ? `./${temp[temp.length - 1]}`: (step.actionType === 'route' || step.actionType === 'dummy') ? step.action : undefined,
                    stepExternalUrl: step.actionType === 'externalUrl' ? step.action : undefined,
                    stepGroupIndex: currentMainStep,
                    isSubStep: !step.isMainStep,
                    isCollapsible: step.isMainStep && this.currentMainStepId ? step.id === this.currentMainStepId : false,
                    isCurrent: step.id === this.pathfinder.currentStep.id,
                    isPassed: step.id === this.pathfinder.currentStep.id ? false : !foundCurrent
                };
                this.multiStepperVConfig.steps.push(navStep);
            }
        });
    }

}
