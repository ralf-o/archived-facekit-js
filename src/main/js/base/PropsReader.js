'use strict';

const {Reader, Objects} = mojo;

export default class PropsReader extends Reader {
    constructor(obj) {
        super(obj);
    }

    get(key) {
        key = Objects.asString(key);

        var ret = super.get(key);

        if (ret === undefined) {
            ret = super.get(key.toLowerCase())
        }

        return ret;
    }

    static from(obj) {
        var ret;

        if (obj instanceof PropsReader) {
            ret = obj;
        } else {
            ret = new PropsReader(obj);
        }

        return ret;
    }
}
