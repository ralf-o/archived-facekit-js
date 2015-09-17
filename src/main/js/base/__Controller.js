'use strict';

class Controller {
    constructor(state) {
        this.__state = state;

        Object.defineProperty(this, 'state', {
            get: () => this.__state,
            set: (_) => { throw new Error("[Controller] Property 'state' is not writable") },
            enumerable: false,
            configurable: false
        });
    }



    publish(msgName, event) {
        // Optionally to be overridden
    }
}
