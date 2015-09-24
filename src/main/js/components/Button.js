'use strict';

import Component from '../base/Component';
import ComponentHelper from '../helpers/ComponentHelper';

const {Reader} = mojo;

const buttonView = html => (props, state, ctx) => {
    return (
        html.span(
            {className: 'counter'},
            html.span(
                {className: 'button-group'},
                html.button({onClick: _ => ({incrementCounter: -10})}, '-10'),
                html.button({onClick: _ => ({incrementCounter: -1})}, '-1')),

            html.span(
                {style: {padding: '0 10px'}},
                props.get('label') + ': ' + state.get('counter')),

            html.span(
                {className: 'button-group'},
                html.button({onClick: _ => ({incrementCounter: 1})}, '+1'),
                html.button({onClick: _ => ({incrementCounter: 10})}, '+10')))
    );
}

const Button = Component.createClass({
    typeName: "facekit/Button",
    view: buttonView,
    initialState: new Reader({counter: 0}),
    stateTransitions: {
        incrementCounter: n => ({counter: {$update: c => c + n}})
    }
});

export default Button;
