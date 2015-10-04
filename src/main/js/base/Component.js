'use strict';

import Element from './Element';
import DOMBuilder from './DOMBuilder';
import PropsReader from './PropsReader';

const {Objects, Seq, Reader} = mojo;

Array.from = (items) => Seq.from(items).toArray(); // TODO - get rid of this

const registeredComponentAdapters = {
};

/**
 * The base component class.
 */
export default class Component {
    static registerComponentAdapter(name, adapter) {
        registeredComponentAdapters[name] = adapter;
    }

    static getComponentAdapter(name) {
        return registeredComponentAdapters[name];
    }

    static mount(component, target) {
        let responsibleAdapter = null;

        for (let adapterName of Object.getOwnPropertyNames(registeredComponentAdapters)) {
            const adapter = registeredComponentAdapters[adapterName];

            if (adapter.isMountable(component)) {console.log(444, adapterName)
                responsibleAdapter = adapter;
                break;
            }
        }
console.log(3333, responsibleAdapter)
        return (responsibleAdapter && responsibleAdapter.mount(component, target));
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

        const webComponentClass = true || componentClass.prototype instanceof Component // TODO
            ? toWebComponentClass(componentClass)
            : componentClass; // TODO!!!

        document.registerElement(elementName, webComponentClass);
    }

    static createClass(config) {
        if (config === null || typeof config !== 'object') {
            throw new TypeError("[Component.createClass] First argument 'config' must be an object");
        }

        const {typeName, view, stateTransitions, initialState, defaultProps,
                allowedChildrenTypes, componentDidMount, componentWillUnmount, shouldComponentUpdate} = config;

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
                + "Configuration parameter 'componentWillUnmount' must be a function");
        } else if (Objects.isSomething(shouldComponentUpdate) && typeof shouldComponentUpdate !== 'function') {
           throw new TypeError('[Component.createClass] '
                + "Configuration parameter 'shouldComponentUpdate' must be a function");
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
                                ? new Element(child.type.__originalComponentClass, PropsReader.from(child.props), child.props.children)
                                : (child.type && child.type.__originalComponentClass ? new Element(child.type.__originalComponentClass, PropsReader.from(child.attributes), child.children) : child); // TODO!!!

                        //if (allowedChildrenTypes.length === 0) {
                        //    throw new TypeError("Components of type '${newClass.getTypeName()}' must not have children");
                        //} else if (!(child instanceof Component) || child.getComponentClass !== 'function' || !allowedChildrenTypes.includes(child.getFactory())) {
                        //    throw new TypeError(`Illegal child for component of type '${typeName}'`);
                        //}

                    })
                    .toArray();



             return renderView(domBuilder, state)(PropsReader.from(props), allowedChildren);
        };

        newClass.getView = () => ({initView: initView, renderView: enhancedRenderView});


        newClass.getStateTransitions = () => stateTransitions;
        newClass.getInitialState = () => initialState || {};
        newClass.getDefaultProps = () => defaultProps || {};
        newClass.shouldComponentUpdate = (oldProps, newProps, oldState, newState) => {
            const stateHasChanged = newState !== oldState;

            return !shouldComponentUpdate
                    ? true
                    : stateHasChanged || shouldComponentUpdate(oldProps, newProps);
        }

        newClass.createElement = (attributes = {}, ...children) => {
            return new Element(newClass, attributes, children);
        };

        newClass.convertTo = (adapterName) => {
            return registeredComponentAdapters[adapterName].convertComponentClass(newClass);
        }

       // newClass.getComponentDidMountHandler = () => componentDidMount || null;
       // newClass.getComponentWillUnmountHandler = () => componentWillUnmount || null;

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
        //Component.mount(componentClass.type ? componentClass : DOMBuilder.DEKU.createElement(componentClass, props), this);
        Component.mount(componentClass.type ? componentClass : React.createElement(componentClass, props), this);

//        Component.mount(React.render(React.createElement(componentClass.toReact(), props), this));
    }

    return constructor;
}

