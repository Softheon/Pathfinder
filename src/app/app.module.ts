import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PathfinderModule } from 'projects/pathfinder/src/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PathfinderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

  public data = {
    applicants : [
      {
        age: 55
      }
    ]
  };

 }
