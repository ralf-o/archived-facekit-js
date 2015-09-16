class CounterController extends Controller {
    construct(state = null) {
        super(state);
    }

    incrementCounter(n = 1) {console.log(999, this.state.toString())
        let ret = this.state.update('counter', x => x + n);
        return ret;
    }

    static getDefaultState() {
        return Immutable.Map({counter: 0})  ;
    }
}

class CounterView extends View {
   render(state, props, dispatch) {
        return (
            <div style={{padding: '50px'}}>
                <button style={{margin: '0 80px'}} className="btn btn-warning" onClick={ () => alert("Juhuuuuuuuuuuuuu") }>Juhuuuu</button>
                <div className="btn-group" role="group">
                    <button className="btn btn-default" onClick={() => dispatch({incrementCounter: -10})}>- 10</button>
                    <button className="btn btn-default" onClick={() => dispatch({incrementCounter: -1})}>- 1</button>
                </div>
                <span style={{padding: '0 10px'}}>{'Counter: ' + state.get('counter')}</span>
                <div className="btn-group" role="group">
                    <button className="btn btn-default" onClick={() => dispatch({incrementCounter: 1})}>+ 1</button>
                    <button className="btn btn-default" onClick={() => dispatch({incrementCounter: 10})}>+ 10</button>
                </div>
            </div>
        );
   }
}

class CounterFK extends Component {
    constructor() {
        super(CounterView, CounterController);
    }

    static getTypeName() {
        return 'facekit/Counter';
    }

    static getInitialState() {
        return CounterController.getDefaultState();
    }
}

Counter = Component.toReact(CounterFK);
