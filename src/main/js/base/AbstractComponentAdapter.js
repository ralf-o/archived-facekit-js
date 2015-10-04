'use strict';

const {Objects, Reader} = mojo;

export default class AbstractComponentAdapter {
    convertComponentClass(componentClass) {
        throw Error('[Extension of AbstractComponentAdapter] '
                + "Abstract method 'convertComponentClass' has not been implemented");
    }

    convertElement(element) {
        throw Error('[Extension of AbstractComponentAdapter] '
                + "Abstract method 'convertElement' has not been implemented");
    }

    isMountable(obj) {
        throw Error('[Extension of AbstractComponentAdapter] '
                + "Abstract method 'isMountable' has not been implemented");
    }

    mount(obj, domElement) {
        throw Error('[Extension of AbstractComponentAdapter] '
                + "Abstract method 'mount' has not been implemented");
    }

    createStateController(componentClass, getState, setState) {
        const
            ret = {},
            stateTransitions = componentClass.getStateTransitions();

        if (stateTransitions) {
            for (let transitionName of Object.getOwnPropertyNames(stateTransitions)) {
                const transition = stateTransitions[transitionName];

                ret[transitionName] = (...args) => {
                    const
                        oldState = getState(),
                        newState = Objects.transform(oldState, transition(...args));

                    printStateTransitionDebugInfo(componentClass, oldState, newState, transitionName, args);
                    setState(newState);
                }
            }
        }

       // TODO !!!!
        ret.get = key => {
            const state = getState();

            return (state instanceof Reader
                        || typeof Immutable === ' object' && Immutable && state instanceof Immutable.Collection)

                   ? state.get(key)
                   : state[key];
        }

        return ret;
    }
}

function printStateTransitionDebugInfo(componentClass, oldState, newState, transitionId, args) {
    const
        oldStateString = oldState instanceof Reader ? 'Reader: ' + JSON.stringify(oldState.__state) :  oldState,
        newStateString = newState instanceof Reader ? 'Reader: ' + JSON.stringify(newState.__state) : newState;

    console.log("\n=== COMPONENT STATE TRANSITION =======================\n");
    console.log("--- component type ---------------------------------");
    console.log(componentClass.getTypeName());
    console.log("--- old state --------------------------------------");
    console.log(oldStateString);
    console.log("--- new state --------------------------------------");
    console.log((newState === oldState ? '(no changes)' : newStateString));
    console.log("--- transition -------------------------------------");
    console.log(transitionId);
    console.log("--- arguments --------------------------------------");
    console.log(args.toString());
    console.log("====================================================");
}
