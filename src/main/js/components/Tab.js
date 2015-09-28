'use strict';

import Component from '../base/Component';
import ComponentHelper from '../helpers/ComponentHelper';

export default Component.createClass({
    typeName: 'facekit/Tabs.Tab',
    view: html => (props, children) => {
        return html.div({}, ...children);
    }
});
