'use strict';

import Component from './Component';

const Seq = mojo.Seq;

export default class DOMBuilder {
    /**
     * @param {object} config
     *   The configuration of the DOMBuilder
     */
    constructor(config) {
        this.__createElement = config.createElement;
    }

    createElement(tag, attributes, ...children) {
        if (typeof tag !== 'string' || !tag.match(/^[A-Za-z][A-Za-z0-9_\-\.]*$/)) {
            throw new TypeError(`[DOMBuilder#createElement] Illegal argument 'tag': ${tag}`);
        }

/*
        const
            children = [],
            attrs = attributes || {};

        for (let child of children) {
            if (child !== undefined && child !== null && child !== '') {
                const type = typeof arg;

                if (type === 'function') {
                    throw new TypeError("TODO"); //TODO
                } else if (arg !== '') {
                    children.push(arg);
                }
            }
        }
*/

        return this.__createElement(tag, attributes, ...children);
    }
}

function toReact(elem) {
    var ret;

    if (elem instanceof Component) {
        const children = Seq.from(elem.getChildren()).map(toReact);
        ret = React.createElement(elem.constructor.toReact(), elem.getAttributes(), ...children);
    } else {
        ret = elem;
    }
    return ret;
}

DOMBuilder.REACT = new DOMBuilder({
    createElement(tag, attrs, ...children) {
        const mappedChildren = Seq.from(children).map(toReact).toArray();
        var ret = React.createElement(tag, attrs, ...mappedChildren);
        return ret;
    }
});

const tagNames = [
    'a',
    'abbr',
    'acronym',
    'address',
    'applet',
    'area',
    'article',
    'aside',
    'audio',
    'b',
    'base',
    'basefont',
    'bdi',
    'bdo',
    'bgsound',
    'big',
    'blink',
    'blockquote',
    'body',
    'br',
    'button',
    'canvas',
    'caption',
    'center',
    'cite',
    'code',
    'col',
    'colgroup',
    'command',
    'content',
    'data',
    'datalist',
    'dd',
    'del',
    'details',
    'dfn',
    'dialog',
    'dir',
    'div',
    'dl',
    'dt',
    'element',
    'em',
    'embed',
    'fieldset',
    'figcaption',
    'figure',
    'font',
    'footer',
    'form',
    'frame',
    'frameset',
    'head',
    'header',
    'hgroup',
    'hr',
    'html',
    'i',
    'iframe',
    'image',
    'img',
    'input',
    'ins',
    'isindex',
    'kbd',
    'keygen',
    'label',
    'legend',
    'li',
    'link',
    'listing',
    'main',
    'map',
    'mark',
    'marquee',
    'menu',
    'menuitem',
    'meta',
    'meter',
    'multicol',
    'nav',
    'nobr',
    'noembed',
    'noframes',
    'noscript',
    'object',
    'ol',
    'optgroup',
    'option',
    'output',
    'p',
    'param',
    'picture',
    'plaintext',
    'pre',
    'progress',
    'q',
    'rp',
    'rt',
    'rtc',
    'ruby',
    's',
    'samp',
    'script',
    'section',
    'select',
    'shadow',
    'small',
    'source',
    'spacer',
    'span',
    'strike',
    'strong',
    'style',
    'sub',
    'summary',
    'sup',
    'table',
    'tbody',
    'td',
    'template',
    'textarea',
    'tfoot',
    'th',
    'thead',
    'time',
    'title',
    'tr',
    'track',
    'tt',
    'u',
    'ul',
    'var',
    'video',
    'wbr',
    'xmp'
];

for (let tagName of tagNames) {
    DOMBuilder.prototype[tagName] = function (...args) {
        return this.createElement(tagName, ...args);
    };
}