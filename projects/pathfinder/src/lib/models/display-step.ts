import { Step } from './step';
import { StepDisplaySettings } from './step-display-settings';

/** Step used for display purposes, extends step but includes additional properties */
export class DisplayStep extends Step{
    /** The display settings for the step */
    public displaySettings: StepDisplaySettings = new StepDisplaySettings();
}