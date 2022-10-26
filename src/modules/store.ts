
const Store : any = {

    _getters: {},
    getter(key: string, loader?: () => Promise<any>) {

        if (!this._getters[key]) {
            this._getters[key] = {
                value: undefined,
                loader,
                listeners: [],
                status: 'none'
            }
        }
        else {
            this._getters[key].loader = loader;

            if (this._getters[key].listeners.length > 0) {
                this.get(key);
            }
        }

    },

    clear(key:string) {
        delete this._getters[key];
    },

    reload(key: string) {
        this.clear(key);
        return this.get(key);
    },

    get(key:string, loader?: () => Promise<any>) {
        return new Promise((resolve, reject) => {

            if (!this._getters[key]) {
                this.getter(key, loader);
            }
    
            const g = this._getters[key];

            if (g.value === undefined) {

                if ((g.status == 'none' && !g.loader) || g.status == 'loading') {
                    g.listeners.push(resolve);
                } else if (g.loader) {

                    g.loader()
                    .then((value: any) => {

                        g.status == 'loaded';
                        g.value = value;

                        g.listeners.push(resolve);
                        for(let r of g.listeners)
                            r(g.value);
                        g.listeners = [];

                    });

                }

            } else {

                g.listeners.push(resolve);

                for(let r of g.listeners)
                    r(g.value);
                
                g.listeners = [];

            }

        });
    },

    middlewareStatus: false

}

export default Store;