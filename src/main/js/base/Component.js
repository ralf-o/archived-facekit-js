'use strict';

import Element from './Element';
import DOMBuilder from './DOMBuilder';

const {Objects, Seq, Reader} = mojo;

Array.from = (items) => Seq.from(items).toArray(); // TODO - get rid of this

/**
 * The base component class.
 */
export default class Component {
    static mount(component, target) {
        var ret;

        const domElement = typeof target === 'string'
            ? document.querySelector(target)
            : target;

        if (!domElement) {
            ret = false;
        } else {
            const
                dekuAvailable = typeof deku === 'object' && deku && typeof deku.render === 'function',
                reactAvailable = typeof React === 'object' && React && typeof React.render === 'function';

            if (!dekuAvailable && !reactAvailable) {
                throw new Error('[Component.mount] Neither react nor deku are available as render engines');
            }

            var uiKitToUse = null,
                uiComponentToMount = null;

            if (typeof component === 'function' && component.prototype instanceof Component) {
                uiKitToUse = 'deku';
                uiComponentToMount = new Element(component, {}, []).toDeku();
            } else if (component instanceof Element) {
                if (dekuAvailable) {
                    uiKitToUse = 'deku';
                    uiComponentToMount = component.toDeku();
                } else if (reactAvailable) {
                    uiKitToUse = 'react';
                    uiComponentToMount = component.toReact();
                }
            } else if (reactAvailable && React.isValidElement(component)) {
                uiKitToUse = 'react';
                uiComponentToMount = component;
            } else if (dekuAvailable && component.type && typeof component.type === 'object') {
                uiKitToUse = 'deku';
                uiComponentToMount = component;
            } else {
                console.error('Invalid component:', component);
                throw new TypeError("[Component.mount] First argument 'component' is not a valid component");
            }

            if (uiKitToUse === 'deku') {
                const mounting = deku.render(deku.tree(uiComponentToMount), domElement);

                domElement.__unmountComponent = () => {
                    mounting.remove();
                    delete domElement.__unmount;
                }
            } else if (uiKitToUse === 'react') {
                React.render(uiComponentToMount, domElement);

                domElement.__unmountComponent = () => {
                    React.unmountComponentAtNode(domElement);
                    delete domElement.__unmount;
                }
            }


            ret = true;
        }

        return ret;
    }

    static unmount(target) {
        var ret;

        const domElement = typeof target === 'string'
            ? document.querySelector(target)
            : target;

        if (!domElement || typeof domElement.__unmountComponent !== 'function') {
            ret = false;
        } else {
            domElement.__unmountComponent();
        }

        return ret;
    }

    static registerWebComponent(componentClass, elementName, doc = null) {
        const document = (doc ? doc : window.document);

        if (typeof document.registerElement !== 'function') {
            throw new Error('Browser to old to support web components');
        }

        const webComponentClass = true || componentClass.prototype instanceof Component
            ? toWebComponentClass(componentClass)
            : componentClass; // TODO!!!

        document.registerElement(elementName, webComponentClass);
    }

    static createClass(config) {
        if (config === null || typeof config !== 'object') {
            throw new TypeError("[Component.createClass] First argument 'config' must be an object");
        }

        const {typeName, view, stateTransitions, initialState, defaultProps,
                allowedChildrenTypes, componentDidMount, componentWillUnmount} = config;

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
        } else if (Objects.isSomething(componentDidMount) && typeof componentDidMount !== 'function') {
           throw new TypeError('[Component.createClass] '
                + "Configuration parameter 'componentDidMount must be a function");
        } else if (Objects.isSomething(componentWillUnmount) && typeof componentWillUnmount !== 'function') {
           throw new TypeError('[Component.createClass] '
                + "Configuration parameter 'componentWillUnmount must be a function");
        }

        const newClass = function () {
            throw new Error('Components are not instantiable');
        };

        newClass.prototype = Object.create(Component.prototype);

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


        const
            renderView = (typeof view === 'object' ? view.renderView : view),
            initView = (typeof view === 'object' ? view.initView : domElem => () => {});


        const enhancedRenderView = (domBuilder, state) => (props, children) => {
            // TODO!!!!
            const allowedChildren = false // || !allowedChildrenTypes
                ? children
                : Seq.from(children)
                    .filter(child => child !== undefined && child !== null && child !== false)
                    .map(child => {
                        return child.type && typeof child.type === 'function' && child.type.__originalComponentClass
                                ? new Element(child.type.__originalComponentClass, Reader.from(child.props), child.props.children)
                                : (child.type && child.type.__originalComponentClass ? new Element(child.type.__originalComponentClass, Reader.from(child.attributes), child.children) : child); // TODO!!!

                        //if (allowedChildrenTypes.length === 0) {
                        //    throw new TypeError("Components of type '${newClass.getTypeName()}' must not have children");
                        //} else if (!(child instanceof Component) || child.getComponentClass !== 'function' || !allowedChildrenTypes.includes(child.getFactory())) {
                        //    throw new TypeError(`Illegal child for component of type '${typeName}'`);
                        //}

                    })
                    .toArray();



             return renderView(domBuilder, state)(Reader.from(props), allowedChildren);
        };

        newClass.getView = () => ({initView: initView, renderView: enhancedRenderView});


        newClass.getStateTransitions = () => stateTransitions;
        newClass.getInitialState = () => initialState || {};
        newClass.getDefaultProps = () => defaultProps || {};

        newClass.createElement = (attributes = {}, ...children) => {
            return new Element(newClass, attributes, children);
        };

       // newClass.getComponentDidMountHandler = () => componentDidMount || null;
       // newClass.getComponentWillUnmountHandler = () => componentWillUnmount || null;

        newClass.toReact = () => {
            if (typeof newClass.__reactClass !== 'function') {
                newClass.__reactClass = toReactComponentClass(newClass);
            }

            return newClass.__reactClass;
        }

        newClass.toDeku = ()  => {
            if (typeof newClass.__dekuClass !== 'function') {
               newClass.__dekuClass = toDekuComponentClass(newClass);
            }

            return newClass.__dekuClass;
        }

        newClass.toAngular = () => ({
            restrict: 'E',
            replace: true,
            transclude: false,
            compile: function (element, attrs) {
                const newElement = document.createElement('div');
                Component.mount(new Element(newClass, attrs), newElement);
                element.replaceWith(newElement);
            }
        });

        return newClass;
    }
}


// ------------------------------------------------------------------

class ReactComponent extends React.Component {
    constructor() {
        super();
        this.__cleanupCallback = null;
    }

    render() {
        const
            componentClass = this.__originalComponentClass,
            stateTransitions = componentClass.getStateTransitions(),
            view = componentClass.getView(),
            stateController = createStateController(
                    componentClass,
                    () => this.state.data,
                    state => this.setState({data: state}));

        return view.renderView(DOMBuilder.getDefault(), stateController)(Reader.from(this.props), this.props.children).toReact();
    }

    componentDidMount() {
        const view = this.__originalComponentClass.getView();

        this.__cleanupCallback = view.initView(React.findDOMNode(this));
    }

    componentWillUnmount() {
        if (typeof this.__cleanupCallback === 'function') {
            this.__cleanupCallback();
            this.__cleanupCallback = null;
        }
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

function toDekuComponentClass(componentClass) {
    const ret = {
        defaultProps: componentClass.getDefaultProps(),

        initialState() {
            return {data: componentClass.getInitialState()};
        },

        render({props, state}, setState) {
            const
                view = componentClass.getView(),
                stateCtrl = createStateController(componentClass, () => state.data, state => setState({data: state}));

            return view.renderView(DOMBuilder.getDefault(), stateCtrl)(Reader.from(props), props.children).toDeku();
        },

        afterUpdate(component) {
        },

        afterMount(component, domElement, setState) {
            const view = componentClass.getView();
            component.__cleanupCallback = view.initView(domElement);
        },

        beforeUnmount(component) {
            if (component.__cleanupCallback === 'function') {
                component.__cleanupCallback();
                delete component.__cleanupCallback;
            }
        }
    };

    ret.__originalComponentClass = componentClass;
    return ret;
}

function toWebComponentClass(componentClass) {
    const
        elementPrototype = Object.create(HTMLElement.prototype),
        constructor = () => {};

    constructor.prototype = elementPrototype;

    elementPrototype.createdCallback = function ()  {
        const props = {};

        for (let i = 0; i < this.attributes.length; ++i) {
            const
                attribute = this.attributes[i],
                key = attribute.name,
                value = attribute.value;

            props[key] = value;
        }

        // TODO - handle children => this.innerHTML | also support react web components | bad implementation
        Component.mount(componentClass.type ? componentClass : DOMBuilder.DEKU.createElement(componentClass, props), this);

//        Component.mount(React.render(React.createElement(componentClass.toReact(), props), this));
    }

    return constructor;
}

function createStateController(componentClass, getState, setState) {
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