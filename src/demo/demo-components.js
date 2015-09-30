'use strict';

import Component from '../main/js/base/Component';
import {button} from '../main/js/components/Button';
import {buttonGroup} from '../main/js/components/ButtonGroup';
import {pager} from '../main/js/components/Pager';
import {tabs} from '../main/js/components/Tabs';
import {tab} from '../main/js/components/Tab';
import {counter} from '../main/js/components/Counter';

const
    {Seq} = mojo;

const
    buttonTypes = ['default', 'primary', 'success', 'info', 'warning', 'danger', 'link'],
    sizes = ['large', 'default', 'small', 'extra-small'],
    exampleIcons = ['fa-calendar', 'fa-twitter', 'glyphicon-home', 'glyphicon-print'],
    iconPositions = ['left', 'top', 'right', 'bottom'];

export const DemoOfButtons = Component.createClass({
    typeName: 'DemoOfButtons',
    view: html => props => (
        html.div(
            {className: 'container-fluid'},
            html.div(
                {className: 'row'},
                html.div(
                    {className: 'col-md-2'},
                    'Enabled buttons:'
                ),
                ...Seq.from(buttonTypes).map(buttonType =>
                    html.div(
                        {className: 'col-md-1'},
                        button({
                            text: buttonType,
                            type: buttonType,
                            onClick: () => alert('You clicked: ' + buttonType)
                        })
                    )
                )
            ),
            html.div(
                {className: 'row'},
                html.div(
                    {className: 'col-md-2'},
                    'Disabled buttons:'
                ),
                ...Seq.from(buttonTypes).map(buttonType =>
                    html.div(
                        {className: 'col-md-1'},
                        button({
                            text: buttonType,
                            type: buttonType,
                            disabled: true
                        })
                    )
                )
            ),
            html.div(
                {className: 'row'},
                html.div(
                    {className: 'col-md-2'},
                    'Buttons with icons'
                ),
                ...Seq.from(exampleIcons).map(icon =>
                    html.div(
                        {className: 'col-md-1'},
                        button({text: icon.replace(/^[^\-]+-/, ''), icon: icon})
                    )
                )
            ),
            html.div(
                {className: 'row'},
                html.div(
                    {className: 'col-md-2'},
                    'Buttons with different icon positions'
                ),
                ...Seq.from(iconPositions).map(iconPosition =>
                    html.div(
                        {className: 'col-md-1'},
                        button({text: iconPosition, icon: 'fa-cab', iconPosition: iconPosition})
                    )
                )
            ),
            html.div(
                {className: 'row'},
                html.div(
                    {className: 'col-md-2'},
                    'Links with different icon positions'
                ),
                ...Seq.from(iconPositions).map(iconPosition =>
                    html.div(
                        {className: 'col-md-1'},
                        button({
                            text: iconPosition,
                            icon: 'fa-cab',
                            iconPosition: iconPosition,
                            type: 'link'
                        })
                    )
                )
            ),
            html.div(
                {className: 'row'},
                html.div(
                    {className: 'col-md-2'},
                    'Button sizes:'
                ),
                ...Seq.from(sizes).map(size =>
                    html.div(
                        {className: 'col-md-1'},
                        button({text: size, size: size})
                    )
                )
            ),
            html.div(
                {className: 'row'},
                html.div(
                    {className: 'col-md-2'},
                    'Link sizes:'
                ),
                ...Seq.from(sizes).map(size =>
                    html.div(
                        {className: 'col-md-1'},
                        button({text: size, size: size, type: 'link'})
                    )
                )
            ),
            html.div(
                {className: 'row'},
                html.div(
                    {className: 'col-md-2'},
                    'Menu buttons:'
                ),
                button({className: 'col-md-2', type: 'info', text: 'Dropdown button', menu: [{text: 'Item 1'}]}),
                button({className: 'col-md-2', text: 'Split button', onClick: () => alert('Juhuuu'), menu: [{text: 'Item 1'}]})
            )
        )
    )
});

export const DemoOfButtonGroups = Component.createClass({
    typeName: 'DemoOfButtonGroups',
    view: html => props => (
        html.div(
            {className: 'container-fluid'},
            html.div(
                {className: 'row'},
                buttonGroup(
                    {className: 'col-md-2'},
                    button({text: 'New'}),
                    button({text: 'View'}),
                    button({text: 'Edit'}),
                    button({text: 'Delete'})
                ),
                buttonGroup(
                    {className: 'col-md-2'},
                    button({text: 'New', type: 'info'}),
                    button({text: 'Edit', type: 'warning'}),
                    button({text: 'Delete', type: 'danger'}),
                    button({text: 'Export', type: 'success', menu: [{text: 'Juhu'}]})
                ),
                buttonGroup(
                    {className: 'col-md-3'},
                    button({text: 'Single Button', type: 'default'})
                )
            )
        )
    )
});

export const DemoOfPagination = Component.createClass({
    typeName: 'DemoOfPagination',
    view: html => props => (
        html.div(
            {className: 'container-fluid'},
                html.div(
                    {className: 'row'},
                    pager({
                        className: 'col-md-3',
                        pageIndex: 2,
                        pageSize: 25,
                        totalItemCount: 255
                    })
                )
            )
    )
});

export const DemoOfTabs = Component.createClass({
    typeName: 'DemoOfTabs',
    view: html => props => (
        html.div(
            {className: 'container-fluid'},
            html.div(
                {className: 'row'},
                tabs(
                    {className: 'col-md-10', tabPosition: 'left', tabStyle: 'pills'},
                    tab(
                        {caption: 'default'},
                        tabs(
                            {},
                            tab({caption: 'Tab-1' }),
                            tab({caption: 'Tab-2' }),
                            tab({caption: 'Tab-3' }),
                            tab({caption: 'Tab-4' })
                        )
                    ),
                    tab(
                        {caption: 'Pills'},
                        tabs(
                            {tabType: 'pills'},
                            tab({caption: 'Tab-1'}),
                            tab({caption: 'Tab-2'}),
                            tab({caption: 'Tab-3'}),
                            tab({caption: 'Tab-4'})
                        )
                    ),
                    tab({caption: 'Tab-3'}),
                    tab({caption: 'Tab-4'})
                )
            )
        )
    )
});

export const DemoOfCounter = Component.createClass({
    typeName: 'DemoOfCounter',
    view: html => props => (
        counter({label: 'My Counter'})
    )
});