'use strict';

import Component from '../base/Component';
import ComponentHelper from '../helpers/ComponentHelper';

const buttonView = (html, ctrl) => (props, children, state, ctx) => {
    const onClickProp = props.get('onClick'),
          onClickCallback = (typeof onClickProp === 'function' ? onClickProp: null),
          icon = props.get('icon'),
          iconPosition = props.get('iconPosition'),
          iconElement = ComponentHelper.createIconElement(icon, 'w-icon w-' + iconPosition),
          type = props.get('type'),
          text = props.get('text'),
          tooltip = props.get('tooltip'), // TODO
          disabled = !!props.get('disabled'),
          menu = null, // TODO
          isDropDown = false,
          isSplitButton = false,
          className = ComponentHelper.buildCssClass(
                'btn w-button btn-' + type,
                props.get('className'),
                (text === null ? null : 'w-has-text'),
                (iconElement === null ? null : 'w-has-icon'),
                (!menu ? null : 'dropdown-toggle'));

    return (
        html.a(
            {
                className: className,
                title: tooltip,
                disabled: disabled,
                onClick: onClickCallback
             }, text
        )
    );
}

const buttonDefaultProps = {
    type: 'default'
}

export default Component.createFactory({
        typeName: "facekit/Button",
        view: buttonView,
        defaultProps: buttonDefaultProps
    });
