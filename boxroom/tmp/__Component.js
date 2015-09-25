'use strict';

export default class Component {
    static mount(component, target) {
        throw "TODO";
    }

    static createClass(config) {
        if (config === null || typeof config !== 'object') {
            throw new TypeError("[Component.createClass] First argument 'config' must be an object");
        }

        const {typeName, view, stateTransitions, initialState, defaultProps} = config;

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
        }

        const newClass = function () {};
        newClass.prototype = Object.create(Component.prototype);

        newClass.getTypeName = () => typeName;
        newClass.getView = () => view;
        newClass.getStateTransitions = () => normalizeStateTransitions(stateTransitions);
        newClass.getInitialState = () => normalizeInitialState(initialState);
        newClass.getDefaultProps = () => normalizeProps(defaultProps);

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

function normalizeStateTransitions(stateTransitions) {
    return stateTransitions; // TODO
}

function normalizeInitialState(initialState) {
    return Immutable.Map(initialState);
}

function normalizeProps(props) {
    var ret;

    if (!props) {
        ret = Immutable.Map({});
    } else if (ret instanceof Immutable.Map) {
        ret = props;
    } else {
        ret = Immutable.Map(props);
    }

    return ret;
}

function toReactComponentClass(componentClass) {
    if (!componentClass || !(componentClass.prototype instanceof Component)) {
        throw new TypeError("[Component.toReact] First argument 'componentClass' is not really a component class");
    }

    var ret = null;

    const
        typeName = componentClass.getTypeName(),
        view = componentClass.getView(),
        stateTransitions = componentClass.getStateTransitions(),
        initialState = componentClass.getInitialState(),
        defaultProps = componentClass.getDefaultProps().toJS(), // TODO!!!
        sender = (reactComponent) => (transitionId, ...args) => {
            const
                transition = stateTransitions[transitionId],
                oldState = reactComponent.state.data,
                newState = transition(...args)(reactComponent.state.data, reactComponent.context);
                printStateTransitionDebugInfo(componentClass, oldState, newState, transitionId, args);
                reactComponent.setState({data: newState});
             return newState;
        };

    ret = React.createClass({
        render: function () {
            return view(DOMBuilder.REACT)(this.state.data, normalizeProps(this.props), this.context);
        },
        getInitialState: function () {
            return {data: initialState};
        },
        getDefaultProps: function() {
            return defaultProps;
        }
    });

    ret.displayName = typeName.replace(/^(.*?)([A-Za-z0-9-_\.]+)$/, '$2');
    return ret;
}

function printStateTransitionDebugInfo(componentClass, oldState, newState, transitionId, args) {
    console.log("\n=== COMPONENT STATE TRANSITION =======================\n");
    console.log("--- component type ---------------------------------");
    console.log(componentClass.getTypeName());
    console.log("--- old state --------------------------------------");
    console.log(oldState.toString());
    console.log("--- new state --------------------------------------");
    console.log((newState === oldState ? '(no changes)' : newState.toString()));
    console.log("--- transition -------------------------------------");
    console.log(transitionId);
    console.log("--- arguments --------------------------------------");
    console.log(args.toString());
    console.log("====================================================");
}