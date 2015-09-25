'use strict';

import Component from '../base/Component';
import ComponentHelper from '../helpers/ComponentHelper';

const
    {Reader} = mojo;

const counterView = html => (props, children, state, ctx) => {
    const {button, buttonGroup} = facekit;

    return (
        html.div(
            {},
            buttonGroup(
                {},
                button({onClick: _ => ({incrementCounter: -10}), text: '-10'}),
                button({onClick: _ => ({incrementCounter: -1}), text: '-1'})),

            html.span(
                {style: {padding: '0 10px'}},
                props.get('label') + ': ' + state.get('counter')),

            buttonGroup(
                {},
                button({onClick: _ => ({incrementCounter: 1}), text: '+1'}),
                button({onClick: _ => ({incrementCounter: 10}), text: '+10'})))
    );
}

const Counter = Component.createClass({
    typeName: "facekit/Button",
    view: counterView,
    initialState: new Reader({counter: 0}),
    stateTransitions: {
        incrementCounter: n => ({counter: {$update: c => c + n}})
    }
});

export default Counter;
