'use strict';

import Component from './Component';

const {Objects, Seq} = mojo;

export default class Element {
    constructor(tag, props, children) {
        this.__tag = tag;
        this.__props = props;
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

    toReact() {
        var ret;

        const props = Objects.shallowCopy(this.__props instanceof Reader ? this.__props.__data : this.__props); // TODO

        props.children = Seq.from(this.__children).map(child => child && child.toReact ? child.toReact() : child).toArray(); // TODO

        if (typeof this.__tag === 'string') {
            ret = React.createElement(this.__tag, props);
        } else if (this.__tag.prototype instanceof Component) {
            ret = React.createElement(this.__tag.toReact(), props);
        } else {
            throw "This should never happen: " + tag;
        }

        return ret;
    }
}