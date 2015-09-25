'use strict';

import Component from '../base/Component';
import ComponentHelper from '../helpers/ComponentHelper';
import Button from './Button';
import ButtonGroup from './ButtonGroup'

const {Reader} = mojo;

const counterView = (html, ctrl) => (props, children, state, ctx) => {
    return (
        html.div(
            {},
            ButtonGroup(
                {},
                Button({onClick: _ => ctrl.incrementCounter(-10), text: '-10'}),
                Button({onClick: _ => ctrl.incrementCounter(-1), text: '-1'})),

            html.span(
                {style: {padding: '0 10px'}},
                props.get('label') + ': ' + state.get('counter')),

            ButtonGroup(
                {},
                Button({onClick: _ => ctrl.incrementCounter(1), text: '+1'}),
                Button({onClick: _ => ctrl.incrementCounter(10), text: '+10'})))
    );
}

export default Component.createClass({
    typeName: "facekit/Button",
    view: counterView,
    initialState: new Reader({counter: 0}),
    stateTransitions: {
        incrementCounter: n => ({counter: {$update: c => c + n}})
    }
});

