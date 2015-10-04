'use strict';

import Component from '../base/Component';
import Element from '../base/Element';
import ComponentAdapter from '../base/ComponentAdapter';
import DOMBuilder from '../base/DOMBuilder';
import PropsReader from '../base/PropsReader';

const {Objects, Seq, Reader} = mojo;

export default class ReactAdapter extends ComponentAdapter {
    isMountable(obj) {console.log(45555, obj)
        return obj && typeof obj === 'object' && React.isValidElement(obj);
    }

    mount(obj, domElement) {
        var ret;

        if (!this.isMountable(obj) || !domElement || typeof domElement.appendChild !== 'function') {
            ret = false;
        } else {
            React.render(obj, domElement);

            domElement.__unmountComponent = () => {
                React.unmountComponentAtNode(domElement);
                delete domElement.__unmount;
            }

            ret = true;
        }

        return ret;
    }

    convertElement(element) {
        var ret;

        const
            tag = element.getTag(),
            props = element.getProps(),
            reactChildren = Seq.from(element.getChildren()).map(child => child instanceof Element ? this.convertElement(child) : child), // TODO
            reactProps = Objects.shallowCopy(props instanceof Reader ? props.__data : props); // TODO

        reactProps.children = reactChildren.toArray();

        if (typeof tag === 'string') {
            ret = React.createElement(tag, reactProps);
        } else if (tag.prototype instanceof Component) {
            ret = React.createElement(this.convertComponentClass(tag), reactProps);
        } else {
            throw "This should never happen: " + tag;
        }

        return ret;
    }

    convertComponentClass(componentClass) {
        if (!componentClass || !(componentClass.prototype instanceof Component)) {
            throw new TypeError('[ReactComponentAdaptor.convertComponentClass] '
                    + "First argument 'componentClass' is not really a component class");
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
        ret.prototype.__componentAdapter = this;
        ret.__originalComponentClass = componentClass;
        ret.displayName = typeName.replace(/^(.*?)([A-Za-z0-9-_\.]+)$/, '$2');
        return ret;
    }
}

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
            children = this.props.children,
            stateController = this.__componentAdapter.createStateController(
                    componentClass,
                    () => this.state.data,
                    state => this.setState({data: state}));

        return this.__componentAdapter.convertElement(view.renderView(DOMBuilder.getDefault(), stateController)(PropsReader.from(this.props), children));
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

    shouldComponentUpdate(nextProps, nextState) {
        const componentClass = this.__originalComponentClass;
        return componentClass.shouldComponentUpdate(this.props, nextProps, this.state.data, nextState.data);
    }
}
