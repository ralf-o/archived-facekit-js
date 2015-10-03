'use strict';

import Component from './Component';

const {Objects, Seq, Reader} = mojo;

export default class Element {
    constructor(tag, props, children) {
        this.__tag = tag;
        this.__props = props || {};
        this.__children = children;

        if (Objects.isNothing(this.__children)) {
            this.__children = [];
        } else if (!Array.isArray(this.__children)) {
            if (typeof this.__children !== 'string' && Seq.isSeqable(this.__children)) {
                this.__children = Seq.from(this.__children).toArray();
            } else {
                this.__children = [this.__children];
            }
        }
    }

    getTag() {
        return this.__tag;
    }

    getProps() {
        return this.__props;
    }

    getChildren() {
        return this.__children;
    }

    convertTo(componentAdapterName) {
        return Component.getComponentAdapter(componentAdapterName).convertElement(this);
    }
}