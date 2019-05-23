import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PathfinderModule } from 'dist/@softheon/pathfinder';

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
        age: 66
      }
    ]
  }

  public path = {
    "steps": [
        {
            "id": "shopping",
            "label": "Shopping",
            "isMainStep": true,
            "group": "group1",
            "isStart": true,
            "determinedAction": "/shopping/demographic",
            "determinedActionType": "internalPath",
            "conditions": [
                {
                    "stepId": "demographic",
                    "predicateType": "boolean",
                    "predicate": true,
                    "actionType": "internalPath",
                    "action": "/demographic"
                }
            ]
        },
        {
            "id": "demographic",
            "group": "group1",
            "label": "Demographic",
            "conditions": [
                {
                    "stepId": "provider",
                    "predicateType": "boolean",
                    "predicate": true,
                    "actionType": "internalPath",
                    "action": "/provider"
                }
            ]
        },
        {
            "id": "provider",
            "label": "Providers",
            "group": "group1",
            "conditions": [
                {
                    "stepId": "drug",
                    "predicateType": "boolean",
                    "predicate": true,
                    "actionType": "internalPath",
                    "action": "/drug"
                }
            ]
        },
        {
            "id": "drug",
            "group": "group1",
            "label": "Drugs",
            "conditions": [
                {
                    "stepId": "plan",
                    "predicateType": "boolean",
                    "predicate": true,
                    "actionType": "internalPath",
                    "action": "/plan"
                }
            ]
        },
        {
            "id": "plan",
            "group": "group1",
            "label": "Plans",
            "conditions": [
                {
                    "stepId": "medicare",
                    "predicateType": "object",
                    "predicate": {
                        "applicants": {
                            "logicalOperator": "or",
                            "predicate": {
                                "age": ">65"
                            }
                        }
                    },
                    "actionType": "internalPath",
                    "action": "/medicare"
                },
                {
                    "stepId": "enrollment",
                    "predicateType": "boolean",
                    "predicate": true,
                    "actionType": "internalPath",
                    "action": "/enrollment"
                }
            ]
        },
        {
            "id": "enrollment",
            "group": "group2",
            "isMainStep": true,
            "label": "Enrollment",
            "conditions": [
                {
                    "stepId": "apply",
                    "predicateType": "boolean",
                    "predicate": true,
                    "actionType": "internalPath",
                    "action": "/enrollment/apply"
                }
            ]
        },
        {
            "id": "apply",
            "group": "group2",
            "label": "Apply",
            "isEnd": true
        },
        {
            "id": "medicare",
            "isMainStep": true,
            "group": "group3",
            "label": "Medicare",
            "isEnd": true
        }
    ]
}

 }
