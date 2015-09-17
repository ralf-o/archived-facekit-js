'use strict';

const counterStateTransitions = {
    incrementCounter: (n = 1) => state => {
        var ret = state.update('counter', c => c + n);
        return ret;
    }
}

const counterView = (state, props, ctx, send) => {
    return (
        <div style={{padding: '50px'}}>
            <ButtonGroup>
                <Button onClick={ () => send('incrementCounter', -10) } text="-10"/>
                <Button onClick={ () => send('incrementCounter', -1) } text="-1"/>
            </ButtonGroup>
            <span style={{padding: '0 10px'}}>{props.get('text') + ': ' + state.get('counter')}</span>

            <ButtonGroup>
                <Button onClick={ () => send('incrementCounter', 1) } text="+ 1" />
                <Button onClick={ () => send('incrementCounter', 10) } text="+ 10" />
            </ButtonGroup>
        </div>
    );
}

var Counter = Component.createClass({
        typeName: "facekit/Counter",
        view: counterView,
        stateTransitions: counterStateTransitions,
        initialState: {counter: 0}
    });

Counter = Component.toReact(Counter);


