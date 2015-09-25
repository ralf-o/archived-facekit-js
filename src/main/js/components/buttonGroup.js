'use strict';

import Component from '../base/Component';
import {Button} from './button'

const buttonGroupView = (html, ctrl) => (props, children, state, ctx) => {
    const hasChildren = children instanceof Array && children.length > 0;

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

export default Component.createFactory({
        typeName: "facekit/ButtonGroup",
        view: buttonGroupView
    });
