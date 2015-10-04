'use strict';

import Component from '../base/Component';
import Element from '../base/Element';
import AbstractComponentAdapter from '../base/AbstractComponentAdapter';
import {h, state, app} from 'mercury';
//import {diff, patch, create, h} from 'virtual-dom';
//import vdom from 'virtual-dom';


const {Objects, Seq, Reader} = mojo;

export default class MercuryComponentAdapter extends AbstractComponentAdapter {
    isMountable(obj) {console.log(4444, obj.render, obj)
        return typeof obj === 'function' && typeof obj.render === 'function';
    }

    mount(obj, domElement) {
        app(domElement, obj(), obj.render);
    }

    convertElement(element) {
        var ret;

        const
            tag = element.getTag(),
            props = element.getProps(),
            hgChildren = Seq.from(element.getChildren()).map(child => child instanceof Element ? this.convertElement(child) : child), // TODO
            hgProps = Objects.shallowCopy(props instanceof Reader ? props.__data : props); // TODO

        if (typeof tag === 'string') {
            ret = h(tag, hgProps, hgChildren);
        } else if (tag.prototype instanceof Component) {
            ret = this.convertComponentClass(tag).render();
        } else {
            throw "This should never happen: " + tag;
        }

        return ret;
    }

    convertComponentClass(componentClass) {
        const ret = () => state({
            data: componentClass.getInitialState()
        });

        ret.render = state => h('div', {}, 'JUHUU');

        return ret;
    }
}