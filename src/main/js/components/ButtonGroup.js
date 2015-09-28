'use strict';

import Component from '../base/Component';
import ComponentHelper from '../helpers/ComponentHelper';
import Button from './Button'

const buttonGroupView = html => (props, children) => {
    const
        hasChildren = children instanceof Array && children.length > 0,
        className = ComponentHelper.buildCssClass(
                'fk-button-group',
                (hasChildren ? 'btn-group' : ''),
                props.get('className'));

    return (
        html.section(
            {className: className, role: 'group'}, ...children)
    );
};

export default Component.createClass({
    typeName: "facekit/ButtonGroup",
    view: buttonGroupView,
    defaultProps: {
        disabled: false,
    },
    allowedChildrenTypes: [Button],
    className: ''
});

/**
 *
 *
 */
// This is just a fake class definition for ESDoc.
class ButtonGroup  {
}

