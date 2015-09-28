'use static';

import Element from '../base/Element';

export default class ComponentHelper {
    static buildCssClass(...tokens) {
        let ret = '';

        for (let token of tokens) {
            if (typeof token === 'string' && token.length > 0) {
                if (ret.length > 0) {
                    ret += ' ';
                }

                ret += token;
            } else if (token instanceof Array) {
                for (let subtoken of token) {
                    let subCssClass = ComponentHelper.buildCssClass(subtoken);

                    if (ret.length > 0) {
                        ret += ' ';
                    }

                    ret += subCssClass;
                }
            }
        }

        return ret;
    }

    static buildIconCssClass(icon) {
        let ret = '';

        if (icon && typeof icon === 'string' && icon.indexOf('.') === -1) {
            let match = icon.match(/(?:^|\s)(fa|glyphicon)-./);

            if (match) {
                ret = match[1] + ' ' + icon;
            }
        }

        return ret;
    }

    static createIconElement(icon, className) {
        let ret = null;

        icon = Strings.trimToNull(icon);
        className = ComponentHelper.buildCssClass(className);

        if (icon !== null) {
            if (icon.indexOf('.') >= 0) {
                ret = new Element('img', {href: icon, alt: '', className: className});
            } else {
                let match = icon.match(/(?:^|\s)(fa|glyphicon)-./),
                    fullClassName = (match ? match[1] : '') + ' ' + icon + ' ' + className;

                if (match) {
                    ret =new Element('span', {className: fullClassName});
                }
            }
        }

        return ret;
    }

/*
    static isComponentOfType(obj, componentType) {
        return obj
                && React.isValidElement(obj)
                && obj.type === componentType;
    }

    static streamChildrenOfType(parent, componentType) {
        let children = parent.props.children || [];

        if (!(children instanceof Array)) {
            children = [children];
        }

        return React.isValidElement(parent)
                ? Stream.empty()
                :  Stream.from(children)
                        .filter(child => ComponentHelper.isComponentOfType(child, componentType));
    }
*/
}
