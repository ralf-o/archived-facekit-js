'use strict';

import Component from '../base/Component';
import ComponentHelper from '../helpers/ComponentHelper';

export default Component.createClass({
    typeName: 'facekit/Tabs.Tab',
    view: html => (props, children) => {console.log(333, children)
        return html.div({}, ...children);
    }
});
