
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

}