'use strict';

import Component from '../base/Component';
import ComponentHelper from '../helpers/ComponentHelper';

const {Seq} = mojo;

function renderTab(tab, html, activeTab, idx) {
    const
        props = tab.getProps(),
        active = activeTab === props.get('name') || idx === parseInt(activeTab, 10),
        className = ComponentHelper.buildCssClass(active ? 'active' : null);

    return (
        html.li(
            {className},
            html.a(
                {},
                props.get('caption')))
    );
}

const tabsView = html => (props, children) => {
    const
       activeTab = props.get('activeTab');


    const ret = (
        html.div({},
            html.ul(
                {className: 'fk-tabs-header nav nav-tabs'},
                ...Seq.from(children).map((child, idx) => renderTab(child, html, activeTab, idx))),
            html.div(
                {className: 'fk-tabs-body'},
                 ...children.map((child, index) => html.div(
                        {className: 'fk-tabs-page', style: {display: activeTab === index || activeTab === child.getProps().get('name') ? 'block' : 'none'}},
                        child))))
    );

    return ret;
};

const Tabs = Component.createClass({
    typeName: 'facekit/Tabs',
    view: tabsView,
    defaultProps: {
        activeTab: 0
    },
    componentDidMount: (domElem) => {
        const
            $ = jQuery,
            $elem = $(domElem);

        $elem.find('.fk-tabs-header:first > li')
            .each((index, li) => {
                $(li).on('click', evt => {
                    evt.preventDefault();
                    $('.fk-tabs-body:first > .fk-tabs-page').hide();
                    $($('.fk-tabs-body:first > .fk-tabs-page').get(index)).show();
                });
            })
            .on('click', evt => {
                evt.preventDefault();
                jQuery(evt.target).tab('show')
            });
    },
    componentWillUnmount: () => {
        alert('unmounting');
    }
});

Tabs.Tab = Component.createClass({
    typeName: 'facekit/Tabs.Tab',
    view: html => (props, children) => {
        return html.div({}, ...children);
    }
});


export default Tabs;


