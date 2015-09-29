'use strict';

import Component from '../base/Component';
import ComponentHelper from '../helpers/ComponentHelper';

export const Tab = Component.createClass({
    typeName: 'facekit/Tabs.Tab',
    view: html => (props, children) => {
        return html.div({}, ...children);
    }
});

export default Tab;
export const tab = Tab.createElement;

