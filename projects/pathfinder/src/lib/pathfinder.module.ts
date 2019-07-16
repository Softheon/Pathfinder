import { NgModule } from '@angular/core';
import { MatTreeModule, MatIconModule, MatButtonModule, MatExpansionModule } from '@angular/material';
import { MultiStepperVModule } from '@softheon/ng-workshop';
import { NavfinderComponent } from './components/navfinder/navfinder.component';
import { PathfinderService } from './pathfinder.service';
import { MainStepComponent } from './components/main-step/main-step.component';
import { SubStepComponent } from './components/sub-step/sub-step.component';
import { CommonModule } from '@angular/common';

/** The pathfinder module */
@NgModule({
  declarations: [NavfinderComponent, MainStepComponent, SubStepComponent],
  imports: [
    MultiStepperVModule,
    MatTreeModule,
    MatExpansionModule,
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [
    PathfinderService
  ],
  exports: [
    NavfinderComponent
  ]
})
export class PathfinderModule { }