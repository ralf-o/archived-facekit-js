'use strict';

// import Immutable from 'Immutable';

function toJS(obj) {
    var ret = (obj instanceof Immutable.Collection) ? obj.toJS() : obj;
    return ret;
}

function isValidComponentState(state) {
    return !!state; // TODO
}

function isValidComponentProp(prop) {
    return true; // TODO
}

function checkComponentPropValidity(props) {
    return true; // TODO
}

function getTypeNameByComponent(component) {
    var ret;

    const facekitComponent = component instanceof Component
            ? component
            : (component instanceof React.Component && component.__facekitComponent instanceof Component
                    ? component.__facekitComponent
                    : null);

    if (!facekitComponent || !facekitComponent.constructor || typeof facekitComponent.constructor.getTypeName !== 'function') {
        ret = null;
    } else {
        const typeName = facekitComponent.constructor.getTypeName(component);

        if (!typeName || typeof typeName !== 'string' || typeName.length === 0 || typeName.trim() !== typeName) {
            ret = null;
        } else {
            ret = typeName;
        }
    }

    return ret;
}

function printStateTransitionDebugInfo(component, oldState, newState, msg) {
    console.log("\n=== COMPONENT STATE TRANSITION =======================\n");
    console.log("--- component type ---------------------------------");
    console.log(getTypeNameByComponent(component));
    console.log("--- old state --------------------------------------");
    console.log(toJS(oldState));
    console.log("--- new state --------------------------------------");
    console.log(toJS(newState === oldState ? '(no changes)' : newState));
    console.log("--- message ----------------------------------------");
    console.log(toJS(msg));
    console.log("====================================================");
}

function createComponentError(component, errorText) {
    const
        typeName = getTypeNameByComponent(component),
        msg = (typeName === null ? errorText : + `[Component type ${typeName}] ${errorText}`);

    return new TypeError(msg);
}

function getInitialState(componentClass) {
    var ret;

    if (!componentClass || typeof componentClass.getInitialState !== 'function') {
        ret = Component.getInitialState();
    } else {
        ret = componentClass.getInitialState();

        if (!isValidComponentState(ret)) {
            throw createClassError(componentClass,
                        `Facekit component class method 'getInitialState' returned invalid state: ${ret}`);
        }
    }

    return ret;
}

function getDefaultProps(componentClass) {
    var ret;

    if (!componentClass || componentClass.getDefaultProps !== 'function') {
        ret = Component.getDefaultProps();
    } else {
        ret = componentClass.getDefaultProps();

        if (!checkComponentPropValidity(ret)) {
            throw createClassError(componentClass,
                        `Facekit component class method 'getDefaultProps' returned invalid value for props: ${ret}`);
        }
    }

    return ret;
}

function getReactComponentClass(facekitComponentClass) {
    var ret;

    if (facekitComponentClass.__reactComponentClass) {
        ret = facekitComponentClass.__reactComponentClass;
    } else {
        const construct = function (facekitComponent, facekitComponentClass) {
            FacekitToReactComponent.call(this, facekitComponent, facekitComponentClass);
        };

        construct.prototype = new FacekitToReactComponent(null, null);
        construct.initialState = {data: getInitialState(facekitComponentClass)};

        construct.defaultProps = getDefaultProps(facekitComponentClass);
        construct.getTypeNameByComponent = () => getTypeNameByComponent(facekitComponentClass);

        facekitComponentClass.__reactComponentClass = construct;
        ret = construct;
    }

    return ret;
}

/**
 * The Face-Kit component class
 */
class Component {
    constructor() {
        this.__reactComponent = null;
    }


    render(props, state, dispatch) {
       return <span></span>;
    }

    handleMessage(state, msg) {
        return state;
    }

    componentWillMount() {
    }

    componentWillReceiveProps(props, nextProps) {
    }

    shouldComponentUpdate(props, nextProps, state, nextState) {
        return (props !== nextProps || state !== nextState)
    }

    componentWillUpdate(props, nextProps, state, nextState) {
    }

    componentDidUpdate(props, prevProps, state, prevState) {
    }

    componentWillUnmount() {
    }

    static getInitialState() {
       return Immutable.Map({});
    }

    static getDefaultProps() {
        return {};
    }

    static getTypeNameByComponent() {
        return 'facekit/Component';
    }

    static findDOMNode(component) {
        var ret;

        if (component instanceof Component && component.__reactComponent !== null) {
            ret = React.findDOMNode(this.__reactComponent);
        } else if (component instanceof React.Component) {
            ret = React.findDOMNode(component);
        } else {
            ret = null;
        }

        return ret;
    }

    static toReact(facekitComponentClass) {
        if (typeof facekitComponentClass !== 'function' || !(facekitComponentClass.prototype instanceof Component)) {
            throw new Error('[Component.toReact] First parameter must be a valid Facekit component class');
        }

        if (getTypeNameByComponent(facekitComponentClass) !== null) {
            throw new Error('[Component.toReact] First parameter must be a valid Facekit component class that '
                    + 'implements the static method "getTypeNameByComponent" properly '
                    + '(must return a non-empty string without leading or trailing whitespace)');
        }

        const reactComponentClass = getReactComponentClass(facekitComponentClass);

        return () => {
            const
                facekitComponent = new facekitComponentClass(),
                reactComponent = new reactComponentClass(facekitComponent, facekitComponentClass);

            facekitComponent.__reactComponent = reactComponent;
            return reactComponent;
       }
    }
}

/**
 * Face-Kit to React adapter class
 */
class FacekitToReactComponent extends React.Component {
    constructor(facekitComponent, facekitComponentClass) {
        this.__facekitComponent = facekitComponent;

        this.state = facekitComponentClass
                ? {data: getInitialState(facekitComponentClass)}
                : null;
    }

    render() {
        const facekitComponent = this.__facekitComponent;

        const dispatch = (msg) => {
            const
               state = this.state.data,
               nextState = facekitComponent.handleMessage(state, msg);

            if (!isValidComponentState(nextState)) {
                throw new createComponentError(facekitComponent,
                        `FaceKit component method 'handleMessage' returned invalid next state: ${nextState}`);
            }

            if (nextState !== state) {
                this.setState({data: nextState});
            }

            printStateTransitionDebugInfo(facekitComponent, state, nextState, msg);
        }

        return this.__facekitComponent.render(this.props, this.state.data, dispatch);
    }

    componentWillMount() {
        return this.__facekitComponent.componentWillMount();
    }

    componentWillReceiveProps(nextProps) {
        return this.__facekitComponent.componentWillReceiveProps(this.props, nextProps);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.__facekitComponent.shouldComponentUpdate(this.props, nextProps, this.state.data, nextState.data);
    }

    componentWillUpdate(nextProps, nextState) {
        return this.__facekitComponent.componentWillUpdate(this.props, nextProps, this.state, nextState);
    }

    componentDidUpdate(prevProps, prevState) {
        return this.__facekitComponent.componentDidUpdate(this.props, prevProps, this.state, prevState);
    }

    componentWillUnmount() {
        return this.__facekitComponent.componentWillUnmount();
    }
}
