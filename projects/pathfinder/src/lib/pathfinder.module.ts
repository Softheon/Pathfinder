import { NgModule } from '@angular/core';
import { MatTreeModule, MatIconModule, MatButtonModule, MatExpansionModule } from '@angular/material';
import { MultiStepperVModule } from '@softheon/ng-workshop';
import { NavfinderComponent } from './components/navfinder/navfinder.component';
import { PathfinderService } from './pathfinder.service';
import { CommonModule } from '@angular/common';

/** The pathfinder module */
@NgModule({
  declarations: [NavfinderComponent],
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