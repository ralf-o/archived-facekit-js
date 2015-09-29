'use strict';

import Component from '../base/Component';
import ComponentHelper from '../helpers/ComponentHelper';
import {button} from './Button';
import {buttonGroup} from './ButtonGroup'

const {Reader} = mojo;

const counterView = (html, state) => props => {
    return (
        html.div(
            {},
            buttonGroup(
                {},
                button({onClick: _ => state.incrementCounter(-10), text: '-10'}),
                button({onClick: _ => state.incrementCounter(-1), text: '-1'})),

            html.span(
                {style: {padding: '0 10px'}},
                props.get('label') + ': ' + state.get('counter')),

            buttonGroup(
                {},
                button({onClick: _ => state.incrementCounter(1), text: '+1'}),
                button({onClick: _ => state.incrementCounter(10), text: '+10'})))
    );
}

export const Counter = Component.createClass({
    typeName: "facekit/Counter",
    view: counterView,
    initialState: new Reader({counter: 0}),
    stateTransitions: {
        incrementCounter: n => ({counter: {$update: c => c + n}})
    }
});

export default Counter;
export const counter = Counter.createElement;
