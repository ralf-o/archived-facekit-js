'use strict';

import Component from '../base/Component';

const buttonGroupView = html => (props, children, state, ctx) => {
    const hasChildren = children instanceof Array && children.length > 0;
console.log(typeof children, Array.isArray(children), children instanceof mojo.Seq, children)
/*
    if (hasChildren) {
        for (let child of children) {
            if (child !== null && child !== undefined && child !== false && child.type !== Button) {
                throw new TypeError('Component ButtonGroup can only contain elements of type Button');
            }
        }
    }
*/
    return (
        html.div(
            {className: 'w-button-group ' + (hasChildren ? 'btn-group' : ''), role: 'group'}, ...children)
    );
};

const ButtonGroup = Component.createClass({
        typeName: "facekit/ButtonGroup",
        view: buttonGroupView
    });

export default ButtonGroup;