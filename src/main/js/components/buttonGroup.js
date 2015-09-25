'use strict';

import Component from '../base/Component';
import button from './button'

const buttonGroupView = (html, ctrl) => (props, children, state, ctx) => {
    const hasChildren = children instanceof Array && children.length > 0;

console.log(children, hasChildren)
    return (
        html.div(
            {className: 'w-button-group ' + (hasChildren ? 'btn-group' : ''), role: 'group'}, ...children)
    );
};

export default Component.createFactory({
        typeName: "facekit/ButtonGroup",
        view: buttonGroupView,
        allowedChildrenTypes: [button]
    });
