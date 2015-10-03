'use strict';

import Element from '../base/Element';
import AbstractComponentAdapter from '../base/AbstractComponentAdapter';
import DOMBuilder from '../base/DOMBuilder';
import PropsReader from '../base/PropsReader';

const {Objects, Seq, Reader} = mojo;

export default class DekuComponentAdapter extends AbstractComponentAdapter {
    convertElement(element) {
        var ret;
        
        const
            tag = element.getTag(),
            props = element.getProps(),
            children = element.getChildren(),
            dekuProps = Objects.shallowCopy(props instanceof Reader ? props.__data : props), // TODO
            dekuChildren = Seq.from(children).map(child => child instanceof Element ? this.convertElement(child) : child).toArray(); // TODO

        if (typeof tag === 'string') {
            if (dekuProps) { // TODO - get rid of this condition?
                if (dekuProps.className) {
                    dekuProps['class'] = props.className;
                    delete dekuProps.className;
                }

                if (dekuProps.style && typeof dekuProps.style === 'object') {
                    const tokens = [];

                    for (let propName of Object.getOwnPropertyNames(dekuProps.style)) {
                        if (tokens.length > 0) {
                            tokens.push(', ');
                        }

                        tokens.push(propName);
                        tokens.push(": ");
                        tokens.push(Objects.asString(dekuProps.style[propName]));
                        tokens.push("");
                    }

                    dekuProps.style = tokens.join('');
                }
            }

            ret = {
                type: tag,
                children: dekuChildren,
                attributes: dekuProps
            };
        } else if (tag.prototype instanceof Component) {
            ret = {
                type: this.convertComponentClass(tag),
                children: children,
                attributes: dekuProps
            };
        } else {
            throw "This should never happen: " + tag;
        }

        return ret;
    }

    convertComponentClass(componentClass) {
        const ret = {
            defaultProps: componentClass.getDefaultProps(),

            initialState: () => {
                return {data: componentClass.getInitialState()};
            },

            render: ({props, state}, setState) => {
                const
                    view = componentClass.getView(),
                    stateCtrl = this.createStateController(componentClass, () => state.data, state => setState({data: state})),
                    children = Seq.from(props.children).map(child => child instanceof Element ? this.convertElement(child) : child); // TODO!!!!!

                return this.convertElement(view.renderView(DOMBuilder.getDefault(), stateCtrl)(PropsReader.from(props), children));
            },

            afterUpdate: (component) => {
            },

            afterMount: (component, domElement, setState) => {
                const view = componentClass.getView();
                component.__cleanupCallback = view.initView(domElement);
            },

            beforeUnmount: (component) => {
                if (component.__cleanupCallback === 'function') {
                    component.__cleanupCallback();
                    delete component.__cleanupCallback;
                }
            },

            shouldUpdate: (component, nextProps, nextState) => {
                    const {props, state, id} = component;

                    return componentClass.shouldComponentUpdate(props, nextProps, state.data, nextState.data);
            },

            __originalComponentClass: componentClass
        };

        return ret;
    }
}
