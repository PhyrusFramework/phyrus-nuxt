import jwt from 'jsonwebtoken';
import Config from './config';

export default class Storage {

    static set (key: string, value: any) {

        if (typeof value === 'string')
            window.localStorage.setItem(key, value);
        else if (typeof value == 'object' || Array.isArray(value)) {
            window.localStorage.setItem(key, JSON.stringify(value));
        } else {
            window.localStorage.setItem(key, "" + value);
        }

    }

    static get (key: string) {

        let value = window.localStorage.getItem(key);
        if (value == null) return;

        try {
            let val = JSON.parse(value);
            return val;
        } catch (e) {
            return value;
        }

    }

    static remove (key: string) {
        window.localStorage.removeItem(key);
    }

    static clear () {
        window.localStorage.clear();
    }

    private static jwtkey() : string {
        const conf = Config.get();
        if (conf.auth && conf.auth.clientId) {
            return conf.auth.clientId;
        }
        return Config.title;
    }

    static setEncrypted(key: string, value: any) {
        const val = JSON.stringify(value === undefined ? null : value);
        const tk = jwt.sign(val, this.jwtkey());
        window.localStorage.setItem(key, tk);
    }

    static getEncrypted(key: string) : any {
        let val = window.localStorage.getItem(key);
        if (!val) return null;
        try {
            let decoded : any = jwt.verify(val!, this.jwtkey());
            decoded = JSON.parse(decoded);
            return decoded;
        } catch(err) {
            return null;
        }
    }

}