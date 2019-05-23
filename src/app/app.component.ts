import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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
    "steps": [
        {
            "id": "shopping",
            "label": "Shopping",
            "isMainStep": true,
            "group": "group1",
            "isStart": true,
            "action": "/healthcare/shopping",
            "actionType": "internalPath",
            "conditions": [
                {
                    "stepId": "demographic",
                    "predicateType": "boolean",
                    "predicate": true,
                    "actionType": "route",
                    "action": "./demographic"
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
                    "actionType": "route",
                    "action": "./provider"
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
                    "actionType": "route",
                    "action": "./drug"
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
                    "actionType": "route",
                    "action": "./plans"
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
                    "action": "/healthcare/medicare"
                },
                {
                    "stepId": "enrollment",
                    "predicateType": "boolean",
                    "predicate": true,
                    "actionType": "internalPath",
                    "action": "/healthcare/enrollment"
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
                    "actionType": "route",
                    "action": "./apply"
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
};

}
