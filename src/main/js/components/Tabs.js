'use strict';

import Component from '../base/Component';
import ComponentHelper from '../helpers/ComponentHelper';

const {Seq} = mojo;

function renderTab(tab, html) {
    console.log(222, tab);

    return html.li({}, html.a({}, tab.props.caption));
}

const tabsView = html => (props, children) => {console.log(children)
    return (
        html.ul(
            {className: 'nav nav-tabs'},
            ...Seq.from(children).map(child => renderTab(child, html)))
    );
};

const Tabs = Component.createClass({
    typeName: 'facekit/Tabs',
    view: tabsView
});

Tabs.Tab = Component.createClass({
    typeName: 'facekit/Tabs.Tab',
    view: html => props => {
        return html.div({}, "ATab");
    }
});


export default Tabs;


