# Pathfinder

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.2.0.

## Summary

Softheon Pathfinder is a deterministic finite automaton (DFA) based service that allows for highly configurable state logic to be provided and ran. The functionality will be described in regards to navigation, but the pathfinder service can be used on its own outside of the navigation scope.

## Installation

npm install @softheon/pathfinder

## Usage

The following sections will provide information code snippets on how to use and configure Pathfinder

### Setup

First, the module must be imported into one of the existing modules in the project

```javascript
import { PathfinderModule } from '@softheon/pathfinder';

NgModule({
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
```

This will initialize the `PathfinderService` and allow usage of any of the included components.

### Configuration

This section will explain the configuration structure, and how to configure Pathfinder.

#### Terms

> Path -- The main class for Pathfinder, the steps are all available states for the service
>
> Step -- One step in the path, contains the information of the step and the conditions of where the step can lead to
>
> Condition -- Logic for evaluating how to determine the next `Step` in the `Path`

#### Classes

##### Path

| Property  | Description                                | Type                      |
| --------- | ------------------------------------------ | ------------------------- |
| snapshot$ | The observable of the snapshot of the path | `Observable<Array<Step>>` |
| steps     | The steps of the path                      | `Array<Step>`             |

| Method Name    | Description                                                   | Arguments            | Return Type |
| -------------- | ------------------------------------------------------------- | -------------------- | ----------- |
| updateSnapshot | Updates the snapshot with the current steps or provided steps | `steps: Array<Step>` | `void`      |

##### Step

| Property   | Description                                               | Type                                                 |
| ---------- | --------------------------------------------------------- | ---------------------------------------------------- |
| id         | The step id                                               | `string | number`                                    |
| label      | The text to display for the step                          | `string`                                             |
| isMainStep | True if the step is a main step (navigation purposes)     | `boolean`                                            |
| group      | The group the step is a part of (navigation purposes)     | `string | number`                                    |
| isStart    | True if the step is a start step                          | `boolean`                                            |
| isEnd      | True if the step is an end step                           | `boolean`                                            |
| isCurrent  | True if the step is the current step                      | `boolean`                                            |
| isComplete | True if the step has been completed                       | `boolean`                                            |
| conditions | The array of conditions for determining what step is next | `Array<Condition>`                                   |
| action     | The action used to get to the step                        | `any`                                                |
| actionType | The action type used to get to the step                   | `'route' | 'internalPath' | 'externalUrl' | 'dummy'` |

##### Condition

| Property         | Description                                                          | Type                                                  |
| ---------------- | -------------------------------------------------------------------- | ----------------------------------------------------- |
| stepId           | The id of the step the condition leads to                            | `string | number`                                     |
| predicateType    | Determines the type of logic being given for resolving the condition | `'boolean' | 'object' | 'function' | 'previousSteps'` |
| predicate        | The logic to be run to resolve the condition                         | `unknown`                                             |
| action           | The action to take when a condition is resolved to true              | `any`                                                 |
| actionType       | How to run the provided action                                       | `'route' | 'internalPath' | 'externalUrl' | 'dummy'`  |
| logicalOperators | Determines if all or some of the predicate conditions need to be met | `'and' | 'or'`                                        |

##### ArrayCondition

| Property         | Description                                                          | Type                     |
| ---------------- | -------------------------------------------------------------------- | ------------------------ |
| logicalOperators | Determines if all or some of the predicate conditions need to be met | `'and' | 'or'`           |
| predicate        | The key values pairs to use for array matching                       | `{[ key: string ]: any}` |

#### Structure

The path class must be provided to the `PathfinderService`, currently, this done through the `initialize` function in the `PathfinderService`. it takes an argument of type `Array<Step>` which denotes all possible steps of the path. Each step contains an `Array<Condition>` which determines which step would be the next step in the `Path`. And example `Step` in JSON format is provided below.

```json
{
    "id": "begin",
    "label": "Ascend",
    "isMainStep": true,
    "group": "group1",
    "isStart": true,
    "action": "/start",
    "actionType": "route",
    "conditions": [
      ...
    ]
}
```

Every `Step` available to the `Path` is provided in the `Steps` property of the `Path`. The conditions denote where the step can lead and how to get there. Below is the same `Step` json except the conditions array has been populated.

```json
"steps": [
    {
        "id": "begin",
        "label": "Ascend",
        "isMainStep": true,
        "group": "group1",
        "isStart": true,
        "action": "/start",
        "actionType": "route",
        "conditions": [
            {
                "stepId": "minor-passive-1",
                "predicateType": "boolean",
                "predicate": true,
                "actionType": "route",
                "action": "./minor-passive-1"
            }
        ]
    },
    {
        "id": "minor-passive-1",
        "group": "group2",
        "label": "Minor Passive 1",
        "conditions": [
            ...
        ]
    }
]
```

The way the above example is read is the 'begin' step has a condition that leads to the 'minor-passive-1' step. The 'minor-passive-1' step has been provided in the 'steps' which signifies all possible steps of the `Path`. It should be noted that a step can have multiple conditions and that conditions are evaluated in the order provided. The first condition that is evaluated to be true, will be the one used and conditions following that will not be run.

##### Condition Predicates

The `predicate` and `predicateType` properties of the condition are what Pathfinder uses to determine the next step. The available predicate types are:

* `boolean`
* `object`
* `function`

###### Boolean

The `boolean` predicate type is a simple true or false conditional. The example condition shown below has `boolean` predicate type:

```json
{
    "stepId": "minor-passive-1",
    "predicateType": "boolean",
    "predicate": true,
    "actionType": "route",
    "action": "./minor-passive-1"
}
```

The above condition will always resolve to true, which means this predicate type should be used when a step only has one possible next step (linear) or as a fall back for if none of the previous conditions resolve to true (default).

###### Object

The `object` predicate type is a bit more complex. The `PathfinderService` has a data property. This property plays a key role in the `object` predicate type. The data property can be any object or any value and the predicate provides paths to values of the data property and values to compare them to. An example condition is shown below with a JSON snippet of the data for this path.

```json
"condition": {
    "stepId": "natures-reprisal",
    "predicateType": "object",
    "logicalOperator": "or",
    "predicate": {
        "ability.damageTypes": {
            "logicalOperator": "and",
            "predicate": {
                "element": "poison",
                "type": "dot",
                "amount": ">0"
            }
        }
    }
}

"data": {
    "ability" : {
        "damageTypes": [
            {
                "element": "poison",
                "type": "dot",
                "amount": "9000"
            }
        ]
    }
}
```

The above example is a condition regarding what is required to move to the `natures-reprisal` step. The selector in the condition follows the syntax used for accessing a JSON object. So first it will get the `ability`, then the `damageTypes` property. Since this property is an array, the predicate uses the `ArrayCondition` class. A logical operator is provided, in this case, and meaning all provided values must resolve to true when compared to the values in the data. An `or` logical operator means at least one of the provided values must resolve to true.

Translating to English, the data.ability.damageTypes list must contain an entry where the `element` property equals "poison" and the `type` property equals "dot" and the `amount` property is greater than 0. By fulfilling the requirements the condition will be resolved to true and the determined step will be the `natures-reprisal` step.

In order to get the data into the `PathfinderService` follow the code snippet bellow.

```javascript
export class AppComponent {
    constructor(
        private pathfinder: PathfinderService
    ) {
        this.pathfinder.path = // provide your path here
        this.pathfinder.data = // provide your data here
        this.pathfinder.initialize();
    }
    ...
```

**Numbers** -- when dealing with numbers, Pathfinder supports the following character preceding the number value

> `<` -- Less than value
>
> `>` -- Greater than value
>
> `<=` -- Less than or equal to value
>
> `>=` -- Greater than or equal to
>
> `!` -- Not equal (also works for strings)

###### Function

The function `predicateType` allows for writing typescript arrow function directly in the `predicate` property. This `predicateType` also works off the `data` property of the `PathfinderService`. This type allows for the most customization but is also the hardest to use as it requires knowledge of the typescript/javascript language. An example condition is provided below. The function mirrors the logic defined in the example above but shows an alternate way of writing it. The same data is used for this example

```json
"condition": {
    "stepId": "natures-reprisal",
    "predicateType": "function",
    "predicate": "(context) => { return context.ability.damageTypes.findIndex(x => {x.element === 'poison' && x.type === 'dot' && x.amount > 0 }) > -1; }"
}
```

This condition has the same logic as the object `predicateType` example provided above except it uses the function `predicateType` note the use of the `findIndex` function of an array. This notation allows for extremely complex logic but requires knowledge of the language in order to utilize it. This predicate type is meant to fill in the gaps that the object predicate type can't fulfill and should be used only when needed.

##### Full Example

A complete navigation example is provided below with the example data, all from in JSON format so it can be loaded from a file or an API call.

```json
"data": {
    "ability" : {
        "damageTypes": [
            {
                "element": "poison",
                "type": "dot",
                "amount": "9000"
            }
        ]
    }
}

"path": {
    "steps": [
        {
            "id": "start",
            "label": "Ascend",
            "group": "group1",
            "isStart": true,
            "action": "./start",
            "actionType": "route",
            "conditions": [
                {
                    "stepId": "minor-passive-1",
                    "predicateType": "object",
                    "logicalOperator": "or",
                    "action": "/minor-passive-1",
                    "actionType": "route",
                    "predicate": {
                        "ability.damageTypes": {
                            "logicalOperator": "and",
                            "predicate": {
                                "element": "poison",
                                "type": "dot",
                                "amount": ">0"
                            }
                        }
                    }
                },
                {
                    "stepId": "minor-passive-3",
                    "predicateType": "boolean",
                    "predicate": true,
                    "action": "./minor-passive-3",
                    "actionType": "route"
                }
            ]
        },
        {
            "id": "minor-passive-1",
            "label": "Flask Effect, Chaos Damage",
            "group": "group2",
            "conditions": [
                {
                    "stepId": "natures-reprisal",
                    "predicateType": "boolean",
                    "predicate": true,
                    "action": "./natures-reprisal",
                    "actionType": "route"
                }
            ]
        },
        {
            "id": "natures-reprisal",
            "label": "Nature's Reprisal",
            "group": "group2",
            "conditions": [
                {
                    "stepId": "minor-passive-2",
                    "predicateType": "boolean",
                    "predicate": true,
                    "action": "./minor-passive-2",
                    "actionType": "route"
                }
            ]
        },
        {
            "id": "minor-passive-2",
            "label": "Flask Effect, Chaos Damage",
            "group": "group2",
            "conditions": [
                {
                    "stepId": "master-toxicist",
                    "predicateType": "boolean",
                    "predicate": true,
                    "action": "./master-toxist",
                    "actionType": "route"
                }
            ]
        },
        {
            "id": "master-toxicist",
            "label": "Master Toxicist",
            "group": "group2",
            "isEnd": true
        },
        {
            "id": "minor-passive-3",
            "label": "Flask Effect and Charges Gained",
            "group": "group3",
            "conditions": [
                {
                    "stepId": "natures-boon",
                    "predicateType": "boolean",
                    "predicate": true,
                    "action": "./natures-boon",
                    "actionType": "route"
                }
            ]
        },
        {
            "id": "natures-boon",
            "label": "Nature's Boon",
            "group": "group3",
            "conditions": [
                {
                    "stepId": "minor-passive-4",
                    "predicateType": "boolean",
                    "predicate": true,
                    "action": "./minor-passive-4",
                    "actionType": "route"
                }
            ]
        },
        {
            "id": "minor-passive-4",
            "label": "Flask Effect and Charges Gained",
            "group": "group3",
            "conditions": [
                {
                    "stepId": "master-alchemist",
                    "predicateType": "boolean",
                    "predicate": true,
                    "action": "./master-alchemist",
                    "actionType": "route"
                }
            ]
        },
        {
            "id": "master-alchemist",
            "label": "Master Alchemist",
            "group": "group3",
            "isEnd": true
        }
    ]
}
```

The figure below shows a visual representation of the path provided

![Sample Path Visual](data:image/png;base64,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0WlTe9OT3Cw1otMiotOsdqUnuVl2RKdFRKdlF09PcrMLEJ0WEZ3GXSQ9yc3uQHRaRHTad770JDe7BtFpEdFZCq2mJ7nZTYhOi4jOsmg+PcnNLkN0WkR0lkgz6Uludh+i0yKis1wapye52ZWITouIztKpl57kZrciOi0iOssoTE9ys4sRnRYRnSXlpye52d2ITouIzvJy6Uludj2i0yKis9QkPaVdkZvdjei0iOgsu+PjY51ClyI6LSI6AeOITouITsA4otMiohMwjui0iOgEjCM6LSI6AeOITouITsA4otMiohMwjui0iOgEjCM6LSI6AeOITouITsA4otMiohMwjui0iOgEjCM6LSI6AeOITouITsA4otMiohMwjui0iOgEjCM6LSI6AeOITouITsA4otMiohMwjui0iOgEjCM6LSI6AeOITouITsA4otMiohMwjui0iOgEjCM6LSI6AeOITouITsA4otMiohMwjui0iOgEjCM6LSI6AeOITouITsA4otMiohMwjui0iOgEjCM6LSI6AeOITouITsA4otMiohMwjui0iOgEjCM6LSI6AeOITouITsA4otMiohMwjui0iOgEjCM6LSI6AeOITouITsA4otMiohMwjui0iOgEjCM6LSI6AeOITiv29vZ2YhKdOrWzs7u7qzUAFOrg4ECb5c7O0NDQ+vq6FnZ2tEY5lTs6FxYWJDFDs7OzWgNAoZaWlrRZpk1NTWmNcip3dMqDS69D2vb2ttYAUCgZoWuzTFtdXdUa5VT694MyBNBLERscHDw9PdXFAIp2584dbZye4+NjXVxOpY/OcMzOaB0wJRyzl320LkofneGYndE6YEo4Zi/7aF2UPjqFP2ZntA4YlBmzl320LrohOv0xO6N1wCB/zN4Fo3XRDdHpj9kZrQMG+WP2Lhiti26ITuHG7IzWAbOSMXsXjNZFl0SnG7MzWgfMcmP27hitiy6JTjdmZ7QOmOXG7N0xWhddEp1ibGyM0TpgmYzZu2O0LhpF58nJyZMnT+7duzcxMTFs3o9//GOdMkzOpJxPOatHR0d6loGLWVxclJvq9u3bepMZVopGOj4+Ludzbm5uf39fT3EttaNzY2Pjxo0bvb29Dx48ePbsmfSxZUSMi5MzKedTzmp/f7+cYTnPesaBFr1+/VoauTTS6elpuamWl5f1JsPFrK2tyfmcmZkZ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xYsXWq5IRac4OjoaHh6enp6m+9lpcoYfPHhw7do1vhpCS6QHJCP3W7du0f3sNBkRPn78+PLly5ubmzorlo1OZ3FxcWBgYHR0dGlpSTqhaC85q+Pj43KGnzx5omccaNHy8vLVq1elo/P111/rjYX2kdN79+7dS5cuPXr0SM94Wu3odGQUOTk5KdemFHp7e3XKPDmr/ksT4NykN/TZZ5/pjWXeO++8I8MsLdh2+/bt58+f61mupVF0lktPT/d8FqArjYyMdM2bQKITQE6ITouITsA4otMiohMwjui0iOgEjCM6LSI6AeOITouITsA4otMiohMwjui0iOgEjCM6LSI6AeOITouITsA4otMiohMwjui0iOgEjCM6LSI6AeOITouITsA4otMiohMwjui0iOgEjCM6LSI6AeOITouITsA4otMiohMwjui0iOgEjCM6LSI6AeOITouITsA4otMiohMwjui0iOgEjCM6LSI6AeOITouITsA4otMiohMwjui0iOgEjCM6LSI6AeOITouITsA4otMiohMwjui0iOgEjCM6LSI6AeOITouITsA4otMiohMwjui0iOgEjCM6LSI6AeOITouITsA4otMiohMwjui0iOgEjCM6LSI6AeOITouITsA4otMiohMwjui0iOgEjCM6LSI6AeOITouITsA4otMiohMwjui0iOgEjCM6LSI6AeOITouITsA4otMiohMwjui0YnFxcSom0alTU1NPnz7VGgAKtby8rM1yaqqvr+/OnTtuemZmRmuUU7mjc3V1VRIztLS0pDUAFGp7e1ubZdrCwoLWKKdyR+fx8bFeh7SuGRQAZXd6ejo4OKgt07Ozs6M1yqn07wel56+XIiYjAl0GwIDZ2VltnLGhoSFdVlqlj85wzM5oHTAlHLOXfbQuSh+d4Zid0TpgSjhmL/toXZQ+OoU/Zme0Dhjkj9m7YLQuuiE6/TE7o3XAIH/M3gWjddEN0emP2RmtAwb5Y/YuGK2LbohO4cbsjNYBs9yYvTtG66JLotON2RmtA2a5MXt3jNZFl0SnG7MzWgfMcmP27hiti6aic39/f9m8v//7v9cpw+RM6jkF2uro6EhvMsNK0Uhfv36t57ShutG5ubk5OTl5+fJl6c0NDAzcMu+jjz7SKcPkTMr5lLN6+/ZtOcN6roFzkUb+2WefXb16VW6q/v5+vckMK0Uj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)

##### Action and Action Type

The `action` and `actionType` property control what should happen when the condition is resolved to true. The currently supported action types are listed below:

> route -- Uses the angular router to navigate to the provided route, ex `./master-alchemist`
>
> internalPath -- Uses the base path of the site to navigation to the provide href, ex `/some/url`
>
> externalUrl -- Opens a new tab with provided full URL, ex `https://google.com`
>
> dummy -- skips the action and moves to the next step (allows for steps to show with out having actions)

### Navfinder

The NavFinder component allows for a quick @softheon/workshop themed multi-stepper. This navigation is rendered off the provided path in the `PathfinderService`. Inputs can be found below:

| Name              | Description                                              | Required | Type              |
| ----------------- | -------------------------------------------------------- | -------- | ----------------- |
| data              | The data to use for the `PathfinderService`              | True     | `any`             |
| path              | The path to use for the navigation                       | True     | `Path`            |
| navText           | The text that displays on top of the navigation          | False    | `string`          |
| currentMainStepId | Highlights the current main step based on provided value | False    | `string | number` |
| skipAhead         | True if skip ahead is enabled                            | False    | `boolean`         |

The nav finder component uses a snapshot of the current path to display the navigation. In order to navigate to the next step, the `PathfinderService`'s `takeStepForward()` function can be used. This will advance the stepper and update the snapshot re-running all the logic to show a preview of the path.