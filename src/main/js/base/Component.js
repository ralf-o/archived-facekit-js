'use strict';

class Component {
    constructor(viewClass, controllerClass) {
        if (!(viewClass.prototype instanceof View)) {
            throw new TypeError("[Component.constructor] First argument 'viewClass' must extend class View");
        } else if (!(controllerClass.prototype instanceof Controller)) {
            throw new TypeError("[Component.constructor] Second argument 'component' must extends class Controller");
        }

        this.__viewClass = viewClass;
        this.__controllerClass = controllerClass;
    }

    getViewClass() {
        return this.__viewClass;
    }

    getControllerClass() {
        return this.__controllerClass;
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    shouldComponentUpdate(props, nextProps, state, nextState) {
        return true; // TODO
    }

    componentWillUpdate(props, nextProps, state, nextState) {
    }

    componentDidUpdate(props, prevProps, state, prevState) {
    }

    static toReact(componentClass) {
        if (typeof componentClass !== 'function' || !(componentClass.prototype instanceof Component)) {
            throw new TypeError("[Component.toReact] First parameter 'componentClass' must be a valid component class");
        }

        if (getTypeNameByComponentClass(componentClass) === null) {
            throw new Error("[Component.toReact] First parameter 'componentClass' must be a valid component class "
                    + "which implements the static method 'getTypeName' properly "
                    + '(must return a non-empty string without leading or trailing whitespace)');
        }

        const factory = () => {
            const
                component = new componentClass(),

                reactConstructor = function () {
                    ReactComponent.call(this, component, componentClass);
                    component.__reactComponent = this;
                };

            reactConstructor.prototype = new ReactComponent(null, null);
            reactConstructor.initialState = getInitialState(componentClass);
            return new reactConstructor();
        };

        return factory;
    }

    static getInitialState() {
        return {};
    }
}

// ----------------------------------------------------------------------------

// ReactComponent is a friend of Component therefore it is by definition allowed to read those non-public members.
class ReactComponent extends React.Component {
    constructor(wrappedComponent, wrappedComponentClass) {
        this.__wrappedComponent = wrappedComponent;
        this.__wrappedComponentClass = wrappedComponentClass;

        this.state = wrappedComponentClass
                ? {data: getInitialState(wrappedComponentClass)}
                : null;

        this.__view = wrappedComponentClass
                ? new (wrappedComponent.getViewClass())()
                : null;
    }

    render() {
        const dispatch = (msg) => {
            const
               state = this.state.data,
               ctrl = new (this.__wrappedComponent.getControllerClass())(state),
               ctrlCalls = getControllerCallsFromMessage(msg, ctrl);

            for (let ctrlCall of ctrlCalls) {
            setTimeout(() => {
               const
                   methodName = ctrlCall.methodName,
                   args = ctrlCall.args,
                   nextState = ctrl[methodName].apply(ctrl, args);

                if (!isValidComponentState(nextState)) {
                    throw new createComponentError(this._wrappedComponent,
                            `Component method '${ctrlMethodName}' returned invalid next state: ${nextState}`);
                }

                if (nextState !== state) {
                    this.setState({data: nextState});
                }

                printStateTransitionDebugInfo(this.__wrappedComponent, state, nextState, msg);
            }, 0);
            }
        }

        return this.__view.render(this.state.data, this.props, dispatch);
    }

    componentWillMount() {console.debug(this.__wrappedComponent.componentWillMount)
        return this.__wrappedComponent.componentWillMount();
    }

    componentWillReceiveProps(nextProps) {
        return this.__wrappedComponent.componentWillReceiveProps(this.props, nextProps);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.__wrappedComponent.shouldComponentUpdate(this.props, nextProps, this.state.data, nextState.data);
    }

    componentWillUpdate(nextProps, nextState) {
        return this.__wrappedComponent.componentWillUpdate(this.props, nextProps, this.state, nextState);
    }

    componentDidUpdate(prevProps, prevState) {
        return this.__wrappedComponent.componentDidUpdate(this.props, prevProps, this.state, prevState);
    }

    componentWillUnmount() {
        return this.__wrappedComponent.componentWillUnmount();
    }
}

function getInitialState(componentClass) {
    var ret;

    if (!componentClass || typeof componentClass.getInitialState !== 'function') {
        ret = Component.getInitialState();
    } else {
        ret = componentClass.getInitialState();

        if (!isValidComponentState(ret)) {
            throw createClassError(componentClass,
                        `Component class method 'getInitialState' returned invalid state: ${ret}`);
        }
    }

    return ret;
}

function getTypeNameByComponent(anyComponent) {
    var ret;

    const component = anyComponent instanceof Component
            ? anyComponent
            : (anyComponent instanceof React.Component && anyComponent.__component instanceof Component
                    ? component.__component
                    : null);

    if (!component || !component.constructor || typeof component.constructor.getTypeName !== 'function') {
        ret = null;
    } else {
        const typeName = component.constructor.getTypeName(component);

        if (!typeName || typeof typeName !== 'string' || typeName.length === 0 || typeName.trim() !== typeName) {
            ret = null;
        } else {
            ret = typeName;
        }
    }

    return ret;
}

function getTypeNameByComponentClass(anyComponentClass) {
    var ret;

    const
        proto = typeof anyComponentClass === 'function' ? anyComponentClass.prototype : null,
        componentClass = proto instanceof Component
            ? anyComponentClass
            : (proto instanceof React.Component && anyComponent.__component instanceof Component
                    ? component.__component
                    : null);
}
function createComponentError(component, errorText) {
    const
        typeName = getTypeNameByComponent(component),
        msg = (typeName === null ? errorText : + `[Component of type ${typeName}] ${errorText}`);

    return new TypeError(msg);
}

function createComponentClassError(componentClass, errorText) {
    return new TypeError(errorText); // TODO - add component class information
}

function isValidComponentState(state) {
    return !!state; // TODO
}

function isValidComponentProp(prop) {
    return true; // TODO
}

function toJS(obj) {
    var ret = (obj instanceof Immutable.Collection) ? obj.toJS() : obj;
    return ret;
}

function getControllerCallsFromMessage(msg, controller) {
    const ret = [];

    if (msg instanceof Array) {
        for (let m of msg) {
            ret = ret.concat(getControllerCallsFromMessage(m, controller));
        }
    } else {
        for (let prop in msg) {
            if (msg.hasOwnProperty(prop)) {
                let args = msg[prop];

                if (!(args instanceof Array)) {
                    args = [args];
                }

                ret.push({methodName: prop, args: args});
            }
        }
    }

    return ret;
}

function printStateTransitionDebugInfo(component, oldState, newState, msg) {
    console.log("\n=== COMPONENT STATE TRANSITION =======================\n");
    console.log("--- component type ---------------------------------");
    console.log(getTypeNameByComponent(component));
    console.log("--- old state --------------------------------------");
    console.log(oldState.toString());
    console.log("--- new state --------------------------------------");
    console.log(toJS(newState === oldState ? '(no changes)' : newState.toString()));
    console.log("--- message ----------------------------------------");
    console.log(toJS(msg));
    console.log("====================================================");
}
