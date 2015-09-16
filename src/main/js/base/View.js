'use strict';

class View {
    render(state, props, dispatch) {
        throw new Error("[View] Must implement method 'render(props, state, dispatch)'");
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }
}