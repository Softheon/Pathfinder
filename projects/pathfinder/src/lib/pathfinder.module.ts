import { NgModule } from '@angular/core';
import { MultiStepperVModule } from '@softheon/ng-workshop';
import { NavfinderComponent } from './components/navfinder/navfinder.component';
import { PathfinderService } from './pathfinder.service';

/** The pathfinder module */
@NgModule({
  declarations: [NavfinderComponent],
  imports: [
    MultiStepperVModule
  ],
  providers: [
    PathfinderService
  ],
  exports: [
    NavfinderComponent
  ]
})
export class PathfinderModule { }