'use strict';

import Component from '../base/Component';
import ComponentHelper from '../helpers/ComponentHelper';

const {Strings, Arrays} = mojo;

const buttonView = html => props => {
    const onClickProp = props.get('onClick'),
          onClick = (typeof onClickProp === 'function' ? onClickProp: null),
          icon = Strings.trimToNull(props.get('icon')),
          iconPosition = props.get('iconPosition'),
          iconElement = ComponentHelper.createIconElement(icon, 'fk-button-icon fk-icon fk-' + iconPosition),
          type = Arrays.selectValue(['default', 'primary', 'success', 'info', 'warning', 'danger', 'link'],
                props.get('type'), 'default'),
          text = Strings.trimToNull(props.get('text')),
          textElement = (text === null ? null : html.span({className: 'fk-button-text'}, text)),
          tooltip = props.get('tooltip'), // TODO
          disabled = !!props.get('disabled'),
          menu = Seq.from(props.get('menu')).filter(item => item instanceof Reader).toArray(),
          hasMenu = menu.length > 0,
          isDropdown = hasMenu && !onClick,
          isSplitButton = hasMenu && onClick,
          caret = hasMenu ? html.span({className: 'caret'}) : null,

          sizeClass = Objects.get(
                {large: 'btn-lg', small: 'btn-sm', 'extra-small': 'btn-xs'},
                props.get('size'), ''),

          className = ComponentHelper.buildCssClass(
                'btn btn-' + type,
                sizeClass,
                (text === null ? null : 'fk-has-text'),
                (iconElement === null ? null : 'fk-has-icon'),
                (!isDropdown ? null : 'dropdown-toggle'));

    const button = (
        html.button(
            {
                type: 'button',
                className: className,
                title: tooltip,
                disabled: disabled,
                onClick: onClick
             },
             ...(iconPosition === 'left' || iconPosition === 'top'
                    ? [iconElement, (text !== null && icon !== null ? ' ' : null), textElement]
                    : [textElement, (text !== null && icon !== null ? ' ' : null), iconElement]),
             (isDropdown ? caret : null)
        )
    );

    var ret;

    if (isDropdown) {
        ret = html.div({className: 'fk-button btn-group ' + props.get('className')}, button, html.ul(
            {className: 'dropdown-menu'},
            html.li({}, html.a({}, 'Juhu'))
        ));
    } else if (isSplitButton) {
        ret = html.div({className: 'fk-button btn-group ' + props.get('className')}, button, html.button({className: 'btn dropdown-toggle btn-' + type }, caret), html.ul(
            {className: 'dropdown-menu'},
            html.li({}, html.a({}, 'Juhu'))
        ));
    } else {
        ret = html.div({className: 'fk-button btn-group ' + props.get('className')}, button);
    }

    return ret;
}


export default Component.createClass({
    typeName: 'facekit/Button',
    view: buttonView,
    defaultProps: {
        text: '',
        icon: '',
        type: 'default',
        disabled: false,
        size: 'default',
        iconPosition: 'left',
        menu: []
    },
    componentDidMount: function(domElem) {
        jQuery(domElem).find('.dropdown-toggle').dropdown();
    }
});


/**
 *
 *
 */
// This is just a fake class definition for ESDoc.
class Button  {
}


