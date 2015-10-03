'use strict';

import Component from './Component';
import Element from './Element';

const {Objects, Seq} = mojo;

export default class DOMBuilder {
    /**
     * @param {object} config
     *   The configuration of the DOMBuilder
     */
    constructor(config) {
        this.createElement = (tag, props, ...children) => {
            const childrenSeq = Seq.from(children).flatMap(child =>
                Seq.isNonStringSeqable(child)
                    ? Seq.from(child)
                    : (Objects.isNothing(child) || child === false ? Seq.empty() : Seq.of(child)));

            return config.createElement(tag, props, childrenSeq.toArray());
        }
    }

    static getDefault() {
        let ret = DOMBuilder.__default;

        if (!ret) {
            ret = DOMBuilder.__default = new DOMBuilder({
                createElement: (tag, props, children) => new Element(tag, props, children)
            });
        }

        return ret;
    }
}


/*
DOMBuilder.REACT = new DOMBuilder({
    convertElement: function convertElement (element) {
        const tag = element.getTag(),
              props = element.getProps(),
              children = Seq.from(children).map(convertElement);

        if (typeof tag === 'string') {
            ret = React.createElement(tag, props, ...children);
        } else if (tag.prototype instanceof Component) {
            ret = React.createElement(tag.toReact(), props, ...children);
        }

        return ret;
    }
});
*/


DOMBuilder.DEKU = new DOMBuilder({
    createElement: function createElement (tag, props, children) {
        var ret;

        if (tag.prototype instanceof Component) {
            ret = {
                type: tag.convertTo('deku'),
                attributes: props,
                children: children
            }
        } else {
            ret = {
                type: tag,
                attributes: props,
                children: children
            }
        }

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
    DOMBuilder.prototype[tagName] = function (props, ...children) {
        return this.createElement(tagName, props, ...children);
    };
}