'use strict';

const buttonView = (state, props, ctx, send) => {
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
     <a className={className}
         title={tooltip}
         disabled={disabled}
         data-toggle={menu ? 'dropdown' : null}
         onClick={onClickCallback}
     >
         {['left', 'top'].indexOf(iconPosition) >= 0
                 ? [iconElement, text]
                 : [text, iconElement]
         }

         {isDropDown && !isSplitButton &&
             <span className="caret"></span>}
     </a>
    );
}

const buttonDefaultProps = {
    type: 'default'
}

var Button = Component.createClass({
        typeName: "facekit/Button",
        view: buttonView,
        defaultProps: buttonDefaultProps
    });

Button = Component.toReact(Button);


