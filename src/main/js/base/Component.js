'use strict';

import DOMBuilder from './DOMBuilder';

const {Objects, Seq, Reader} = mojo;

Array.from = (items) => Seq.from(items).toArray(); // TODO - get rid of this

/**
 * The base component class.
 */
export default class Component {
    constructor(attributes, ...children) {
        this.__attributes = attributes;
        this.__children == children;
    }

    static mount(component, target) {
        throw "TODO";
    }

    static createClass(config) {
        if (config === null || typeof config !== 'object') {
            throw new TypeError("[Component.createClass] First argument 'config' must be an object");
        }

        const {typeName, view, stateTransitions, initialState, defaultProps, allowedChildrenTypes} = config;

        if (typeName === undefined || typeName === null) {
           throw new TypeError("[Component.createClass] No 'typeName' provided in configuration object");
        } else if (typeof typeName !== 'string' || typeName !== typeName.trim()) {
            throw new TypeError("[Component.createClass] Invalid 'typeName' provided in configuration object");
        } else if (view === undefined) {
            throw new TypeError("[Component.createClass] No 'view' provided in configuration object");
        } else if (view === null || (typeof view !== 'function' && typeof view !== 'object')) {
            throw new TypeErorr("[Component.createClass] Invalid 'view' provided in configuration object");
        } else if (typeof view !== 'function') {
            if (view.renderView === undefined) {
                throw new TypeError("[Component.createClass] No 'renderView' function provided in 'view' object");
            } else if (typeof view.renderView !== 'function') {
                throw new TypeError("[Component.createClass] Invalid 'renderView' function provided in 'view' object");
            } else if (view.initView !== undefined && view.initView !== null && typeof view.initView !== 'function') {
                throw new TypeError("[Component.createClass] Invalid 'initView' function provided in 'view' object");
            } else if (view.disposeView !== undefined && view.disposeView !== null
                    && typeof view.disposeView !== 'function') {
                throw new TypeError("[Component.createClass] Invalid 'disposeView' function provided in 'view' object");
            }
        } else if (stateTransitions !== undefined && stateTransitions !== null
                && typeof stateTransitions !== 'object') {
            throw new TypeError("[Component.createClass] Invalid 'stateTransition' provided in configuration object");
        } else if (initialState !== undefined && initialState !== null && typeof initialState !== 'object') {
            throw new TypeError("[Component.createClass] Invalid 'initialState' provided int configuration object");
        } else if (allowedChildrenTypes !== undefined && !Array.isArray(allowedChildrenTypes)) {
            throw new TypeError("[Component.createClass] Invalid value for 'allowedChildrenTypes'");
        }


        const newClass = function (attributes = {}, ...children) {
            const ret = (this instanceof newClass ? this : new newClass(attributes, ...children));
            ret.constructor = newClass;
            ret.__attributes = attributes;
            ret.__children = children;

            return ret;
        };

        newClass.prototype = Object.create(Component.prototype);
        newClass.prototype.getAttributes = function() {return this.__attributes};
        newClass.prototype.getChildren = function() {return this.__children};

        const messageHandler = (stateSetter, oldState, message) => {
            const propNames = Object.getOwnPropertyNames(message);

            if (propNames.length > 1) {
                throw new TypeError('Event handler has sent illegal message');
            } else if (propNames.length === 1) {
                const
                    stateTransitionName = propNames[0],
                    stateTransition = stateTransitions[stateTransitionName];

                if (typeof stateTransition !== 'function') {
                    throw new TypeError(`Unknown state transition '${stateTransitionName}'`);
                }

                const
                    args = message[stateTransitionName],
                    argsArr = Array.isArray(args) ? args : [args],
                    newState = Objects.transform(oldState, stateTransition(...argsArr));


                stateSetter(newState);
                printStateTransitionDebugInfo(newClass, oldState, newState, stateTransitionName, argsArr);
            }
        }

        newClass.getTypeName = () => typeName;

        newClass.getView = () => (domBuilder, state, ctx) => (props, children) => {
            // TODO!!!!
            const allowedChildren = true || !allowedChildrenTypes
                ? children
                : Seq.from(children)
                    .filter(child => child !== undefined && child !== null && child !== false)
                    .map(child => {
                        if (allowedChildrenTypes.length === 0) {
                            throw new TypeError("Components of type '${newClass.getTypeName()}' must not have children");
                        } else if (!(child instanceof Component) || child.getComponentClass !== 'function' || !allowedChildrenTypes.includes(child.getFactory())) {
                            throw new TypeError(`Illegal child for component of type '${typeName}'`);
                        }
                    })
                    .toArray();

            return view(domBuilder, state, ctx)(new Reader(props), allowedChildren);
        };

        newClass.getStateTransitions = () => stateTransitions;
        newClass.getInitialState = () => initialState || {};
        newClass.getDefaultProps = () => defaultProps || {};

        newClass.toReact = () => {
            if (typeof newClass.__reactClass !== 'function') {
                newClass.__reactClass = toReactComponentClass(newClass);
            }

            return newClass.__reactClass;
        }

        return newClass;
    }
}

// ------------------------------------------------------------------

class ReactComponent extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        const
            componentClass = this.__originalComponentClass,
            stateTransitions = componentClass.getStateTransitions(),
            view = componentClass.getView();
            
        const state = {};

        if (stateTransitions) {
            for (let transitionName of Object.getOwnPropertyNames(stateTransitions)) {
                const transition = stateTransitions[transitionName];

                state[transitionName] = (...args) => {
                    const
                        oldState = this.state.data,
                        newState = Objects.transform(oldState, transition(...args));

                    printStateTransitionDebugInfo(componentClass, oldState, newState, transitionName, args);

                    this.setState({data: newState});
                }
            }
        }

       // TODO !!!!
        state.get = key => {
            const state = this.state.data;

            return (state instanceof Reader
                        || typeof Immutable === ' object' && Immutable && state instanceof Immutable.Collection)

                   ? state.get(key)
                   : state[key];
        }

        return view(DOMBuilder.REACT, state)(this.props, this.props.children);
    }
}


function toReactComponentClass(componentClass) {
    if (!componentClass || !(componentClass.prototype instanceof Component)) {
        throw new TypeError("[Component.toReact] First argument 'componentClass' is not really a component class");
    }

    const
        typeName = componentClass.getTypeName(),
        stateTransitions = componentClass.getStateTransitions(),
        initialState = componentClass.getInitialState(),
        defaultProps = componentClass.getDefaultProps();

    const ret = function(...args) {
        ReactComponent.call(this, ...args);
        this.state = {data: this.__originalComponentClass.getInitialState()};
    }

    ret.prototype = new ReactComponent();
    ret.defaultProps = componentClass.getDefaultProps();
    ret.prototype.__originalComponentClass = componentClass;
    ret.__originalComponentClass = componentClass;
    ret.displayName = typeName.replace(/^(.*?)([A-Za-z0-9-_\.]+)$/, '$2');
    return ret;
}

function printStateTransitionDebugInfo(componentClass, oldState, newState, transitionId, args) {
    const
        oldStateString = oldState instanceof Reader ? 'Reader: ' + JSON.stringify(oldState.__state) : oldState.toString(),
        newStateString = newState instanceof Reader ? 'Reader: ' + JSON.stringify(newState.__state) : newState.toString();


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