'use strict';

import Component from '../base/Component';
import Button from './Button'

const buttonGroupView = (html, ctrl, ctx) => (props, children) => {
    const hasChildren = children instanceof Array && children.length > 0;

console.log(children, hasChildren)
    return (
        html.div(
            {className: 'w-button-group ' + (hasChildren ? 'btn-group' : ''), role: 'group'}, ...children)
    );
};

export default Component.createClass({
    typeName: "facekit/ButtonGroup",
    view: buttonGroupView,
    allowedChildrenTypes: [Button]
});

/**
 *
 *
 */
// This is just a fake class definition for ESDoc.
class ButtonGroup  {
}

