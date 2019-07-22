import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTree, MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material';
import { NavigationEnd, Router } from '@angular/router';

import { BehaviorSubject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { DisplayStep } from '../../models/display-step';
import { Path } from '../../models/path';
import { PathfinderService, staticMainStepStorage } from '../../pathfinder.service';

/** The nav finder component */
@Component({
    selector: 'pathfinder-nav',
    templateUrl: './navfinder.component.html',
    styleUrls: ['./navfinder.component.scss']
})
export class NavfinderComponent implements OnInit, OnDestroy {
    /** The tree selector */
    @ViewChild('treeSelector', { static: true }) tree: MatTree<DisplayStep>;

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
    public snapshot: Array<DisplayStep> = [];

    /** True if the tree should be shown */
    public showTree: boolean = false;

    /** The current group */
    public currentGroup: string;

    // tslint:disable: member-ordering
    /**
     * The tree transformer, Robots in disguise
     * @param step The step in the navigation
     * @param level The level in the tree
     */
    public transformer = (step: DisplayStep): DisplayStep => step;

    /** The tree control */
    public treeControl = new FlatTreeControl<DisplayStep>(
        (step: DisplayStep) => step.displaySettings.level,
        (step: DisplayStep) => step.displaySettings.hasChildren
    );

    /** The tree flattener */
    public treeFlattener = new MatTreeFlattener<DisplayStep, DisplayStep>(this.transformer, step => step.displaySettings.level, step => step.displaySettings.hasChildren, () => []);

    /** Gets the data source */
    public get dataSource(): Array<DisplayStep> {
        return this.dataStream.value;
    }

    /** Sets the data source */
    public set dataSource(value: Array<DisplayStep>) {
        this.tree.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener, value);
        this.dataStream.next(value);
    }

    /** The data stream */
    private dataStream: BehaviorSubject<Array<DisplayStep>> = new BehaviorSubject([]);

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
        if (!this.pathfinder.staticMode) {
            this.pathfinder.initialize(this.path.steps);
            const step = this.pathfinder.path.steps.find((s: DisplayStep) => s.displaySettings.level !== 1 && this.checkPath(s.action, s.actionType, this.router.url));
            this.pathfinder.currentStep = step || this.pathfinder.currentStep || this.pathfinder.path.steps.find(s => s.isStart);
            this.pathfinder.syncAllSteps();
            this.syncPathByRoute();
        }
        else {
            this.currentMainStepId = window.localStorage.getItem(staticMainStepStorage);
        }
        this.snapshotSubscription = this.pathfinder.snapshot$
            .subscribe((x: Path) => {
                console.log(x);
                const steps = x.steps as Array<DisplayStep>;
                this.showTree = true;
                this.dataSource = steps;
                this.currentGroup = steps.find(y => y.isCurrent).displaySettings.group;
            });
    }

    /** Angular life cycle hook for component destruction */
    public ngOnDestroy(): void {
        this.snapshotSubscription.unsubscribe();
    }

    /**
     * Determines if the step has a child and if its a level 1 step
     * @param _ The step number
     * @param node The node to check
     */
    public hasChild = (_: number, node: DisplayStep) => node.displaySettings.hasChildren || node.displaySettings.level === 1;

    /**
     * Determines if the node is part of the current group
     * @param _ The step number
     * @param node The node to check
     */
    public partOfCurrentGroup = (_: number, node: DisplayStep) => node.displaySettings.group === this.currentGroup && node.displaySettings.level !== 1;

    /** Determines the completion */
    public determineCompletion(step: DisplayStep): string {
        if (step.displaySettings.level === 1 && step.displaySettings.group === this.currentGroup) {
            return 'level-1-current';
        }
        else if (step.isCurrent) {
            return 'level-sub-current';
        }
        else if (step.isComplete && step.displaySettings.level === 1) {
            return 'level-1-complete';
        }
        else if (step.isComplete) {
            return 'level-complete';
        }

        return 'future-level';
    }

    /**
     * Determines the icon to use for the given step
     * @param step The step
     */
    public determineIcon(step: DisplayStep): string {
        const stepCompletion = this.determineCompletion(step);
        if (stepCompletion === 'level-1-current') {
            return 'fas fa-arrow-circle-right text-primary';
        }
        if (stepCompletion === 'level-1-complete') {
            return 'far fa-check-circle text-success';
        }

        return 'fas fa-circle text-regular';
    }

    public takeAction(step: DisplayStep): void {
        this.router.navigateByUrl(step.action);
        this.pathfinder.currentStep = step;
        this.pathfinder.syncAllSteps();
    }

    /** Syncs the path by route */
    private syncPathByRoute(): void {
        this.pathfinder.snapshot$.pipe(take(1))
            .subscribe(x => {
                const steps = x.steps;
                let step = steps.find(s => this.checkPath(s.action, s.actionType, this.router.url.replace(`/${this.currentMainStepId}`, '')));
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
        return action && action.includes(url.replace('.', ''));
    }
}
