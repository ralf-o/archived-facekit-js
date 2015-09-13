'use strict';

//import Component from 'Component.jsx';

class FKButton extends Component {
    handleMessage(state, msg) {
        return state.update('counter', (val) => val + 1);
    }

    render(props, state, dispatch) {
        return <button className="button btn" onClick={() => dispatch({type: 'clicked'})}>{props.text + ' ' + state.get('counter')}</button>;
    }

    static getTypeName() {
        return 'facekit/Button';
    }

    static getInitialState() {
        return Immutable.Map({counter: 0});
    }
}

var Button = Component.toReact(FKButton);
