
const Store : any = {

    get(key:string, def: any = null) {
        if ((this as any)[key]) {
            return (this as any)[key];
        }
        return def;
    },

    set(key: string, value: any) {
        (this as any)[key] = value;
    },

    has(key: string) {
        if ((this as any)[key] === undefined) {
            return false;
        }
        return true;
    },

    middlewareStatus: false

}

export default Store;